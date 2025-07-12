import { searches, searchResults, type Search, type SearchResult, type InsertSearch, type InsertSearchResult } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Search operations
  createSearch(search: InsertSearch): Promise<Search>;
  getSearches(): Promise<Search[]>;
  getSearchById(id: number): Promise<Search | undefined>;
  
  // Search result operations
  createSearchResult(result: InsertSearchResult): Promise<SearchResult>;
  getSearchResults(searchId: number): Promise<SearchResult[]>;
  getAllSavedResults(): Promise<SearchResult[]>;
  updateSearchResult(id: number, updates: Partial<SearchResult>): Promise<SearchResult | undefined>;
  deleteSearchResult(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async createSearch(insertSearch: InsertSearch): Promise<Search> {
    const [search] = await db
      .insert(searches)
      .values(insertSearch)
      .returning();
    return search;
  }

  async getSearches(): Promise<Search[]> {
    return await db
      .select()
      .from(searches)
      .orderBy(desc(searches.timestamp));
  }

  async getSearchById(id: number): Promise<Search | undefined> {
    const [search] = await db.select().from(searches).where(eq(searches.id, id));
    return search || undefined;
  }

  async createSearchResult(insertResult: InsertSearchResult): Promise<SearchResult> {
    const [result] = await db
      .insert(searchResults)
      .values(insertResult)
      .returning();
    
    // Update search results count
    await db
      .update(searches)
      .set({ resultsCount: sql`${searches.resultsCount} + 1` })
      .where(eq(searches.id, insertResult.searchId));
    
    return result;
  }

  async getSearchResults(searchId: number): Promise<SearchResult[]> {
    return await db
      .select()
      .from(searchResults)
      .where(eq(searchResults.searchId, searchId));
  }

  async getAllSavedResults(): Promise<SearchResult[]> {
    return await db
      .select()
      .from(searchResults)
      .where(eq(searchResults.isSaved, true));
  }

  async updateSearchResult(id: number, updates: Partial<SearchResult>): Promise<SearchResult | undefined> {
    const [result] = await db
      .update(searchResults)
      .set(updates)
      .where(eq(searchResults.id, id))
      .returning();
    return result || undefined;
  }

  async deleteSearchResult(id: number): Promise<boolean> {
    const result = await db
      .delete(searchResults)
      .where(eq(searchResults.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
