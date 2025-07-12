import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  resultsCount: integer("results_count").notNull().default(0),
});

export const searchResults = pgTable("search_results", {
  id: serial("id").primaryKey(),
  searchId: integer("search_id").references(() => searches.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  feasibility: text("feasibility").notNull(), // "high", "medium", "low"
  marketPotential: text("market_potential").notNull(), // "high", "medium", "low"
  innovationScore: integer("innovation_score").notNull(), // 1-10
  marketSize: text("market_size").notNull(),
  gapReason: text("gap_reason").notNull(),
  isSaved: boolean("is_saved").default(false).notNull(),
});

export const insertSearchSchema = createInsertSchema(searches).pick({
  query: true,
});

export const insertSearchResultSchema = createInsertSchema(searchResults).pick({
  searchId: true,
  title: true,
  description: true,
  category: true,
  feasibility: true,
  marketPotential: true,
  innovationScore: true,
  marketSize: true,
  gapReason: true,
});

export type InsertSearch = z.infer<typeof insertSearchSchema>;
export type Search = typeof searches.$inferSelect;
export type InsertSearchResult = z.infer<typeof insertSearchResultSchema>;
export type SearchResult = typeof searchResults.$inferSelect;
