import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupSimpleAuth, isAuthenticated } from "./simpleAuth";
import { analyzeGaps } from "./services/gemini";
import { insertSearchSchema, insertSearchResultSchema } from "@shared/schema";
import { exportResults, sendEmailReport } from "./routes/export";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found. Stripe functionality will be disabled.');
}
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple auth setup
  await setupSimpleAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Trial activation endpoint
  app.post('/api/activate-trial', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      if (user.trialUsed) {
        return res.status(400).json({ error: "Trial already used" });
      }
      
      // Activate trial
      const trialExpiration = new Date();
      trialExpiration.setDate(trialExpiration.getDate() + 7); // 7 days trial
      
      await storage.upsertUser({
        ...user,
        plan: 'pro',
        trialUsed: true,
        trialExpiration,
        subscriptionStatus: 'trialing'
      });
      
      res.json({ success: true, message: "Trial activated successfully" });
    } catch (error) {
      console.error("Trial activation error:", error);
      res.status(500).json({ error: "Failed to activate trial" });
    }
  });

  // Search endpoint - now requires authentication
  app.post("/api/search", isAuthenticated, async (req, res) => {
    try {
      const { query } = insertSearchSchema.parse(req.body);
      const userId = (req.user as any).claims.sub;
      
      // Create search record
      const search = await storage.createSearch({ query, userId });
      
      // Analyze gaps using Gemini
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
            innovationScore: Math.round(gap.innovationScore), // Ensure integer
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
      // For now return empty array until getAllSavedResults is implemented
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get saved results' });
    }
  });

  // Export results
  app.post("/api/export", exportResults);

  // Send email report
  app.post("/api/email-report", sendEmailReport);

  // Stripe subscription routes
  app.post('/api/create-subscription', isAuthenticated, async (req, res) => {
    try {
      const { plan } = req.body;
      const user = (req as any).user;

      if (!user.claims.email) {
        return res.status(400).json({ error: 'User email required' });
      }

      // Define price based on plan (you'll need to create these in Stripe Dashboard)
      const priceMap = {
        pro: 'price_pro_monthly',
        enterprise: 'price_enterprise_monthly'
      };

      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing unavailable' });
      }

      // Create or get Stripe customer
      let customer;
      if (user.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.claims.email,
          name: user.claims.first_name + ' ' + user.claims.last_name,
        });
        
        // Update user with Stripe customer ID
        await storage.upsertUser({ 
          id: user.claims.sub,
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
      await storage.upsertUser({
        id: user.claims.sub,
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
  app.post('/api/activate-trial', isAuthenticated, async (req, res) => {
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
      await storage.upsertUser({
        id: user.claims.sub,
        plan: 'pro',
        trialUsed: true,
        trialExpiration: trialExpiration,
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
  app.get('/api/subscription-status', isAuthenticated, async (req, res) => {
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
  app.post('/api/export', isAuthenticated, exportResults);
  app.post('/api/send-report', isAuthenticated, sendEmailReport);

  const httpServer = createServer(app);
  return httpServer;
}
