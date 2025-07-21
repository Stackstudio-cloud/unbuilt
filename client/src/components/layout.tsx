import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { User, Search, Bookmark, History, TrendingUp, LogOut, Settings, Crown } from "lucide-react";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background transition-colors flame-bg">
      <header className="flame-glass sticky top-0 z-50 neon-flame-border-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Logo size="md" />
              </Link>
            </div>
            
            <div className="flex items-center space-x-1">
              {user && (
                <>
                  <Link href="/trending">
                    <Button 
                      variant={location === '/trending' ? 'default' : 'ghost'} 
                      size="sm"
                      className={location === '/trending' ? 'neon-border-blue' : 'hover-glow'}
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Trending
                    </Button>
                  </Link>
                  <Link href="/search-history">
                    <Button 
                      variant={location === '/search-history' ? 'default' : 'ghost'} 
                      size="sm"
                      className={location === '/search-history' ? 'neon-border-blue' : 'hover-glow'}
                    >
                      <History className="w-4 h-4 mr-1" />
                      History
                    </Button>
                  </Link>
                  <Link href="/saved-results">
                    <Button 
                      variant={location === '/saved-results' ? 'default' : 'ghost'} 
                      size="sm"
                      className={location === '/saved-results' ? 'neon-border-blue' : 'hover-glow'}
                    >
                      <Bookmark className="w-4 h-4 mr-1" />
                      Saved
                    </Button>
                  </Link>
                  
                  {(user.plan === 'free' || !user.plan) && (
                    <Link href="/subscribe">
                      <Button size="sm" className="btn-flame ml-2 animate-pulse-glow">
                        <Crown className="w-4 h-4 mr-1" />
                        Upgrade Pro
                      </Button>
                    </Link>
                  )}
                  
                  <ThemeToggle />
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="hover-glow ml-2"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {!user && (
                <>
                  <ThemeToggle />
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="hover-glow">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="btn-premium">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {children}
    </div>
  );
}
