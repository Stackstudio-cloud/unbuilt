import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Clock, Crown, Zap, Target, Lightbulb } from "lucide-react";
import Layout from "@/components/layout";
import PremiumSearchBar from "@/components/premium-search-bar";
import LoadingModal from "@/components/loading-modal";
import OnboardingTour, { useOnboardingTour } from "@/components/onboarding-tour";
import FreeTrialBanner from "@/components/free-trial-banner";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import type { Search } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isSearching, setIsSearching] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();
  const { shouldShowTour, markTourAsShown } = useOnboardingTour();

  React.useEffect(() => {
    if (shouldShowTour) {
      // Show tour after a brief delay for better UX
      const timer = setTimeout(() => setShowOnboarding(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldShowTour]);

  // If user is not authenticated, redirect to landing page
  if (!user) {
    setLocation("/landing");
    return null;
  }

  const { data: recentSearches } = useQuery({
    queryKey: ["/api/searches"],
    select: (data: Search[]) => data.slice(0, 5),
  });

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    
    try {
      const response = await apiRequest("POST", "/api/search", { query });
      const data = await response.json();
      
      if (data.upgradeRequired) {
        // Handle upgrade required
        setLocation("/auth/upgrade");
        return;
      }
      
      // Navigate to results page with search ID
      setLocation(`/search/${data.search.id}`);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartTrial = () => {
    setLocation("/free-trial");
  };

  const handleCloseTour = () => {
    setShowOnboarding(false);
    markTourAsShown();
  };

  return (
    <Layout>
      <div className="relative min-h-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-cyan-900/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="animate-float mb-8">
              <h1 className="text-6xl font-bold mb-6">
                <span className="neon-glow">Discover What's</span>
                <br />
                <span className="neon-glow">Still Unbuilt</span>
              </h1>
            </div>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Find untapped market opportunities and innovation gaps using AI-powered analysis.
              <br />
              <span className="text-purple-400">Turn hidden potential into your next big venture.</span>
            </p>
            
            {/* User Status Badge */}
            {user && (
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="premium-card dark:premium-card px-6 py-3 rounded-full">
                  <span className="text-sm font-medium">
                    Welcome back, <span className="neon-text">{user.name || user.email}</span>
                  </span>
                  {user.plan === 'pro' && (
                    <Crown className="inline w-4 h-4 ml-2 text-yellow-500" />
                  )}
                </div>
                {user.plan === 'free' && (
                  <div className="text-sm text-muted-foreground">
                    {user.searchCount || 0}/5 searches used this month
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Free Trial Banner */}
          <FreeTrialBanner onStartTrial={handleStartTrial} />

          {/* Premium Search Bar */}
          <div className="mb-16">
            <PremiumSearchBar
              onSearch={handleSearch}
              loading={isSearching}
              placeholder="What market opportunities are waiting to be discovered?"
            />
          </div>

          {/* Recent Searches */}
          {recentSearches && recentSearches.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-center">
                <span className="neon-text">Recent Discoveries</span>
              </h2>
              <div className="grid gap-4 max-w-2xl mx-auto">
                {recentSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => setLocation(`/search/${search.id}`)}
                    className="premium-card dark:premium-card rounded-lg p-4 hover-glow transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="font-medium">{search.query}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(search.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <LoadingModal
        isOpen={isSearching}
        title="Analyzing Market Gaps"
        message="Our AI is exploring untapped opportunities in your search area..."
      />
      
      <OnboardingTour
        isOpen={showOnboarding}
        onClose={handleCloseTour}
        onStartTrial={handleStartTrial}
      />
    </Layout>
  );
}
