import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService } from "./auth";
import { analyzeGaps } from "./services/gemini";
import { insertSearchSchema, insertSearchResultSchema } from "@shared/schema";
import { exportResults, sendEmailReport } from "./routes/export";
import { register, login, logout, getProfile, updateProfile } from "./routes/auth";
import { exportResults, sendEmailReport } from "./routes/export";
import { requireAuth, optionalAuth } from "./middleware/auth";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not found. Stripe functionality will be disabled.');
}
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/profile", requireAuth, getProfile);
  app.patch("/api/auth/profile", requireAuth, updateProfile);

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
