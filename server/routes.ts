import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService } from "./auth";
import { analyzeGaps } from "./services/gemini";
import { insertSearchSchema, insertSearchResultSchema } from "@shared/schema";
import { exportResults, sendEmailReport } from "./routes/export";
import { register, login, logout, getProfile, updateProfile, forgotPassword, resetPassword } from "./routes/auth";
import { 
  googleAuth, 
  googleCallback, 
  googleCallbackSuccess, 
  githubAuth, 
  githubCallback, 
  githubCallbackSuccess 
} from "./routes/oauth";
import { requireAuth, optionalAuth } from "./middleware/auth";
import session from "express-session";
import passport from "./passport";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found. Stripe functionality will be disabled.');
}
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Initialize Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/profile", requireAuth, getProfile);
  app.patch("/api/auth/profile", requireAuth, updateProfile);
  app.post("/api/auth/forgot-password", forgotPassword);
  app.post("/api/auth/reset-password", resetPassword);

  // OAuth routes - graceful handling of missing credentials
  app.get("/api/auth/google", (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(501).json({ 
        error: 'Google OAuth not configured', 
        message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.',
        setup_guide: 'See OAUTH_SETUP.md for instructions'
      });
    }
    return googleAuth()(req, res);
  });
  
  app.get("/api/auth/google/callback", (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.redirect('/auth/login?error=oauth_not_configured');
    }
    return googleCallback()(req, res, next);
  }, googleCallbackSuccess);
  
  app.get("/api/auth/github", (req, res) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return res.status(501).json({ 
        error: 'GitHub OAuth not configured', 
        message: 'Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.',
        setup_guide: 'See OAUTH_SETUP.md for instructions'
      });
    }
    return githubAuth()(req, res);
  });
  
  app.get("/api/auth/github/callback", (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return res.redirect('/auth/login?error=oauth_not_configured');
    }
    return githubCallback()(req, res, next);
  }, githubCallbackSuccess);

  // Search endpoint - now requires authentication and checks limits
  app.post("/api/search", requireAuth, async (req, res) => {
    try {
      const { query } = insertSearchSchema.parse(req.body);
      
      // Create search record
      const search = await storage.createSearch({ query });
      
      // Analyze gaps using OpenAI
      const gaps = await analyzeGaps(query);
      
      // Create search results
      const results = await Promise.all(
        gaps.map(gap => 
          storage.createSearchResult({
            searchId: search.id,
            title: gap.title,
            description: gap.description,
            category: gap.category,
            feasibility: gap.feasibility,
            marketPotential: gap.marketPotential,
            innovationScore: gap.innovationScore,
            marketSize: gap.marketSize,
            gapReason: gap.gapReason,
          })
        )
      );
      
      res.json({ search, results });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Failed to perform search' });
    }
  });

  // Get search results
  app.get("/api/search/:id/results", async (req, res) => {
    try {
      const searchId = parseInt(req.params.id);
      const results = await storage.getSearchResults(searchId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get search results' });
    }
  });

  // Get search history
  app.get("/api/searches", async (req, res) => {
    try {
      const searches = await storage.getSearches();
      res.json(searches);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get search history' });
    }
  });

  // Save/unsave result
  app.patch("/api/results/:id/save", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isSaved } = req.body;
      
      const result = await storage.updateSearchResult(id, { isSaved });
      if (!result) {
        return res.status(404).json({ message: 'Result not found' });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update result' });
    }
  });

  // Get saved results
  app.get("/api/results/saved", async (req, res) => {
    try {
      const results = await storage.getAllSavedResults();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get saved results' });
    }
  });

  // Export results
  app.post("/api/export", exportResults);

  // Send email report
  app.post("/api/email-report", sendEmailReport);

  // Stripe subscription routes
  app.post('/api/create-subscription', requireAuth, async (req, res) => {
    try {
      const { plan } = req.body;
      const user = (req as any).user;

      if (!user.email) {
        return res.status(400).json({ error: 'User email required' });
      }

      // Define price based on plan (you'll need to create these in Stripe Dashboard)
      const priceMap = {
        pro: 'price_pro_monthly',
        enterprise: 'price_enterprise_monthly'
      };

      // Create or get Stripe customer
      let customer;
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
        });
        
        // Update user with Stripe customer ID
        await authService.updateUserProfile(user.id, { 
          stripeCustomerId: customer.id 
        });
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: priceMap[plan as keyof typeof priceMap] || priceMap.pro,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription info
      await authService.updateUserProfile(user.id, {
        stripeSubscriptionId: subscription.id,
        plan: plan
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Activate free trial
  app.post('/api/activate-trial', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      
      // Check if user is already on a paid plan
      if (user.plan === 'pro' || user.plan === 'enterprise') {
        return res.status(400).json({ error: 'User already has an active subscription' });
      }
      
      // Check if user has already used trial
      if (user.trialUsed) {
        return res.status(400).json({ error: 'Free trial has already been used' });
      }
      
      // Set trial expiration to 7 days from now
      const trialExpiration = new Date();
      trialExpiration.setDate(trialExpiration.getDate() + 7);
      
      // Update user to Pro trial
      await authService.updateUserProfile(user.id, {
        plan: 'pro',
        trialUsed: true,
        trialExpiration: trialExpiration.toISOString(),
        subscriptionStatus: 'trialing'
      });
      
      res.json({ 
        success: true, 
        message: 'Free trial activated successfully',
        trialExpiration: trialExpiration.toISOString()
      });
    } catch (error) {
      console.error('Trial activation error:', error);
      res.status(500).json({ error: 'Failed to activate trial' });
    }
  });

  // Check subscription status
  app.get('/api/subscription-status', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      
      if (!user.stripeSubscriptionId || !stripe) {
        return res.json({ status: 'none', plan: 'free' });
      }

      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      
      res.json({
        status: subscription.status,
        plan: user.plan || 'free',
        currentPeriodEnd: subscription.current_period_end,
      });
    } catch (error) {
      console.error('Subscription status error:', error);
      res.status(500).json({ error: 'Failed to get subscription status' });
    }
  });

  // Export routes
  app.post('/api/export', requireAuth, exportResults);
  app.post('/api/send-report', requireAuth, sendEmailReport);

  const httpServer = createServer(app);
  return httpServer;
}
