import {
  users,
  searches,
  searchResults,
  type User,
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Search operations
  createSearch(search: { query: string; userId?: string }): Promise<{ id: number; query: string; timestamp: Date; resultsCount: number; userId: string | null }>;
  getSearches(userId?: string): Promise<any[]>;
  
  // Search results operations
  createSearchResult(result: any): Promise<any>;
  getSearchResults(searchId: number): Promise<any[]>;
  updateSearchResult(id: number, updates: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Search operations
  async createSearch(search: { query: string; userId?: string }) {
    const [newSearch] = await db.insert(searches).values({
      query: search.query,
      userId: search.userId || null,
      resultsCount: 0,
    }).returning();
    return newSearch;
  }

  async getSearches(userId?: string) {
    if (userId) {
      return await db.select().from(searches).where(eq(searches.userId, userId));
    }
    return await db.select().from(searches);
  }

  // Search results operations
  async createSearchResult(result: any) {
    const [newResult] = await db.insert(searchResults).values(result).returning();
    return newResult;
  }

  async getSearchResults(searchId: number) {
    return await db.select().from(searchResults).where(eq(searchResults.searchId, searchId));
  }

  async updateSearchResult(id: number, updates: any) {
    const [updated] = await db.update(searchResults)
      .set(updates)
      .where(eq(searchResults.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();