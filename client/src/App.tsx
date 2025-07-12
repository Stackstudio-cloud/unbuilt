import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import About from "@/pages/about";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import SearchResults from "@/pages/search-results";
import SavedResults from "@/pages/saved-results";
import SearchHistory from "@/pages/search-history";
import Trending from "@/pages/trending";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import NotFound from "@/pages/not-found";
import { useAuth, initializeAuth } from "./hooks/use-auth";
import { useEffect } from "react";

function Router() {
  const { user } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={user ? Home : Landing} />
      <Route path="/landing" component={Landing} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/home" component={Home} />
      <Route path="/search/:id" component={SearchResults} />
      <Route path="/saved" component={SavedResults} />
      <Route path="/history" component={SearchHistory} />
      <Route path="/trending" component={Trending} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
