import { searches, searchResults, type Search, type SearchResult, type InsertSearch, type InsertSearchResult } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private searches: Map<number, Search>;
  private searchResults: Map<number, SearchResult>;
  private searchCurrentId: number;
  private resultCurrentId: number;

  constructor() {
    this.searches = new Map();
    this.searchResults = new Map();
    this.searchCurrentId = 1;
    this.resultCurrentId = 1;
  }

  async createSearch(insertSearch: InsertSearch): Promise<Search> {
    const id = this.searchCurrentId++;
    const search: Search = {
      ...insertSearch,
      id,
      timestamp: new Date(),
      resultsCount: 0,
    };
    this.searches.set(id, search);
    return search;
  }

  async getSearches(): Promise<Search[]> {
    return Array.from(this.searches.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async getSearchById(id: number): Promise<Search | undefined> {
    return this.searches.get(id);
  }

  async createSearchResult(insertResult: InsertSearchResult): Promise<SearchResult> {
    const id = this.resultCurrentId++;
    const result: SearchResult = {
      ...insertResult,
      id,
      isSaved: false,
    };
    this.searchResults.set(id, result);
    
    // Update search results count
    const search = this.searches.get(insertResult.searchId);
    if (search) {
      search.resultsCount++;
    }
    
    return result;
  }

  async getSearchResults(searchId: number): Promise<SearchResult[]> {
    return Array.from(this.searchResults.values()).filter(
      result => result.searchId === searchId
    );
  }

  async getAllSavedResults(): Promise<SearchResult[]> {
    return Array.from(this.searchResults.values()).filter(
      result => result.isSaved
    );
  }

  async updateSearchResult(id: number, updates: Partial<SearchResult>): Promise<SearchResult | undefined> {
    const result = this.searchResults.get(id);
    if (result) {
      const updatedResult = { ...result, ...updates };
      this.searchResults.set(id, updatedResult);
      return updatedResult;
    }
    return undefined;
  }

  async deleteSearchResult(id: number): Promise<boolean> {
    return this.searchResults.delete(id);
  }
}

export const storage = new MemStorage();
