import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { User, Search, Bookmark, History, TrendingUp, LogOut, Settings, Crown, HelpCircle, Info, FileText, Menu, X } from "lucide-react";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background transition-colors flame-bg">
      <header className="flame-glass sticky top-0 z-50 neon-flame-border-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section - Made More Prominent */}
            <div className="flex items-center">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Logo size="lg" />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link href="/about">
                <Button 
                  variant={location === '/about' ? 'default' : 'ghost'} 
                  size="sm"
                  className={location === '/about' ? 'neon-border-blue' : 'hover-glow text-white'}
                >
                  <Info className="w-4 h-4 mr-1" />
                  About
                </Button>
              </Link>
              <Link href="/help">
                <Button 
                  variant={location === '/help' ? 'default' : 'ghost'} 
                  size="sm"
                  className={location === '/help' ? 'neon-border-blue' : 'hover-glow text-white'}
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Help & Docs
                </Button>
              </Link>
              {user && (
                <>
                  <Link href="/trending">
                    <Button 
                      variant={location === '/trending' ? 'default' : 'ghost'} 
                      size="sm"
                      className={location === '/trending' ? 'neon-border-blue' : 'hover-glow text-white'}
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Trending
                    </Button>
                  </Link>
                  <Link href="/history">
                    <Button 
                      variant={location === '/history' ? 'default' : 'ghost'} 
                      size="sm"
                      className={location === '/history' ? 'neon-border-blue' : 'hover-glow text-white'}
                    >
                      <History className="w-4 h-4 mr-1" />
                      History
                    </Button>
                  </Link>
                  <Link href="/saved">
                    <Button 
                      variant={location === '/saved' ? 'default' : 'ghost'} 
                      size="sm"
                      className={location === '/saved' ? 'neon-border-blue' : 'hover-glow text-white'}
                    >
                      <Bookmark className="w-4 h-4 mr-1" />
                      Saved
                    </Button>
                  </Link>
                </>
              )}
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {user && (
                <>
                  {((user as any).plan === 'free' || !(user as any).plan) && (
                    <Link href="/subscribe">
                      <Button size="sm" className="btn-flame animate-pulse-glow">
                        <Crown className="w-4 h-4 mr-1" />
                        Upgrade Pro
                      </Button>
                    </Link>
                  )}
                  
                  <ThemeToggle />
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="hover-glow text-white"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {!user && (
                <>
                  <ThemeToggle />
                  <Link href="/">
                    <Button variant="ghost" size="sm" className="hover-glow text-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="sm" className="btn-flame">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-sm border-t border-purple-500/30">
            <div className="px-4 py-4 space-y-2">
              <Link href="/about">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-purple-600/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Button>
              </Link>
              <Link href="/help">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-white hover:bg-purple-600/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help & Docs
                </Button>
              </Link>
              {user && (
                <>
                  <Link href="/trending">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-white hover:bg-purple-600/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Trending
                    </Button>
                  </Link>
                  <Link href="/history">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-white hover:bg-purple-600/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <History className="w-4 h-4 mr-2" />
                      History
                    </Button>
                  </Link>
                  <Link href="/saved">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-white hover:bg-purple-600/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Saved
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      
      {children}
    </div>
  );
}
