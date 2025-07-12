import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/layout";
import ResultCard from "@/components/result-card";
import ShareModal from "@/components/share-modal";
import ActionPlanModal from "@/components/action-plan-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import type { Search, SearchResult } from "@shared/schema";

export default function SearchResults() {
  const [match, params] = useRoute("/search/:id");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [actionPlanModalOpen, setActionPlanModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([
    "Tech That's Missing",
    "Services That Don't Exist", 
    "Products Nobody's Made"
  ]);
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const queryClient = useQueryClient();
  const searchId = params?.id ? parseInt(params.id) : null;

  const { data: search, isLoading: searchLoading } = useQuery({
    queryKey: ["/api/search", searchId],
    enabled: !!searchId,
    queryFn: async () => {
      const response = await fetch(`/api/search/${searchId}`);
      return response.json();
    }
  });

  const { data: results = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["/api/search", searchId, "results"],
    enabled: !!searchId,
  });

  const saveResultMutation = useMutation({
    mutationFn: async ({ id, isSaved }: { id: number; isSaved: boolean }) => {
      const response = await apiRequest("PATCH", `/api/results/${id}/save`, { isSaved });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/search", searchId, "results"] });
    },
  });

  const handleSaveResult = (id: number, isSaved: boolean) => {
    saveResultMutation.mutate({ id, isSaved });
  };

  const handleShareResult = (result: SearchResult) => {
    setSelectedResult(result);
    setShareModalOpen(true);
  };

  const handleViewDetails = (result: SearchResult) => {
    setSelectedResult(result);
    setActionPlanModalOpen(true);
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilters(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredResults = results.filter((result: SearchResult) => 
    categoryFilters.includes(result.category)
  );

  const sortedResults = [...filteredResults].sort((a: SearchResult, b: SearchResult) => {
    switch (sortBy) {
      case "feasibility":
        const feasibilityOrder = { high: 3, medium: 2, low: 1 };
        return feasibilityOrder[b.feasibility as keyof typeof feasibilityOrder] - feasibilityOrder[a.feasibility as keyof typeof feasibilityOrder];
      case "market-potential":
        const marketOrder = { high: 3, medium: 2, low: 1 };
        return marketOrder[b.marketPotential as keyof typeof marketOrder] - marketOrder[a.marketPotential as keyof typeof marketOrder];
      case "innovation":
        return b.innovationScore - a.innovationScore;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);
  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  if (!match || !searchId) {
    return <div>Search not found</div>;
  }

  if (searchLoading || resultsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="w-8 h-8 border-4 border-google-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <h3 className="font-medium text-google-gray-dark mb-3">Filter by Category</h3>
              <div className="space-y-2">
                {["Tech That's Missing", "Services That Don't Exist", "Products Nobody's Made", "Business Models"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={categoryFilters.includes(category)}
                      onCheckedChange={() => handleCategoryFilter(category)}
                    />
                    <label htmlFor={category} className="text-sm cursor-pointer">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium text-google-gray-dark">Gap Analysis Results</h2>
                <p className="text-sm text-google-gray">
                  About {filteredResults.length} opportunities found for "{search?.query}"
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by Relevance</SelectItem>
                    <SelectItem value="feasibility">Sort by Feasibility</SelectItem>
                    <SelectItem value="market-potential">Sort by Market Potential</SelectItem>
                    <SelectItem value="innovation">Sort by Innovation Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {paginatedResults.map((result: SearchResult) => (
                <ResultCard
                  key={result.id}
                  result={result}
                  onSave={handleSaveResult}
                  onShare={handleShareResult}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        result={selectedResult}
        onClose={() => setShareModalOpen(false)}
      />

      <ActionPlanModal
        isOpen={actionPlanModalOpen}
        result={selectedResult}
        onClose={() => setActionPlanModalOpen(false)}
      />
    </Layout>
  );
}
