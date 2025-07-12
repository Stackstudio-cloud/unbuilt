import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import Layout from "@/components/layout";
import SearchBar from "@/components/search-bar";
import LoadingModal from "@/components/loading-modal";
import { apiRequest } from "@/lib/queryClient";
import type { Search } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isSearching, setIsSearching] = useState(false);

  const { data: recentSearches } = useQuery({
    queryKey: ["/api/searches"],
    select: (data: Search[]) => data.slice(0, 5),
  });

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    
    try {
      const response = await apiRequest("POST", "/api/search", { query });
      const data = await response.json();
      
      // Navigate to results page with search ID
      setLocation(`/search/${data.search.id}`);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Layout>
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-google-gray-dark mb-2">
              What should exist but doesn't?
            </h1>
            <p className="text-lg text-google-gray">
              Discover gaps in innovation and untapped opportunities
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} loading={isSearching} />
          
          {recentSearches && recentSearches.length > 0 && (
            <div className="mt-8 max-w-md mx-auto">
              <h3 className="text-sm font-medium text-google-gray-dark mb-3">Recent Searches</h3>
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => setLocation(`/search/${search.id}`)}
                    className="w-full text-left text-sm text-google-gray hover:text-google-blue cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Clock className="w-4 h-4 inline mr-2" />
                    {search.query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <LoadingModal isOpen={isSearching} />
    </Layout>
  );
}
