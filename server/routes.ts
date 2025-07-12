import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeGaps } from "./services/gemini";
import { insertSearchSchema, insertSearchResultSchema } from "@shared/schema";
import { exportResults, sendEmailReport } from "./routes/export";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search endpoint
  app.post("/api/search", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
