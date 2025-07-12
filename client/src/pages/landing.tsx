import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, BarChart3, Users, CheckCircle, ArrowRight, Star } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");

  const handleGetStarted = () => {
    setLocation("/auth/register");
  };

  const handleSignIn = () => {
    setLocation("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">InnoGap</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setLocation("/about")}>
              About
            </Button>
            <Button variant="ghost" onClick={handleSignIn}>
              Sign In
            </Button>
            <Button onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
            🚀 Discover What's Missing in the Market
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Innovation Gaps & <span className="text-blue-600">Unlock Opportunities</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The only AI-powered platform that reveals untapped market opportunities, 
            helping entrepreneurs and innovators discover what doesn't exist yet but should.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-6 text-lg" onClick={handleGetStarted}>
              Start Finding Gaps
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg" onClick={handleSignIn}>
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose GapFinder?
            </h2>
            <p className="text-lg text-gray-600">
              Turn market gaps into million-dollar opportunities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Our advanced AI scans markets and identifies real opportunities that competitors miss
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Detailed Market Insights</CardTitle>
                <CardDescription>
                  Get feasibility scores, market size estimates, and innovation ratings for every opportunity
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Export & Share</CardTitle>
                <CardDescription>
                  Generate professional reports, pitch decks, and presentations for investors and teams
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your innovation needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                <CardDescription>Perfect for exploring ideas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>5 searches per month</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Basic gap analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Save results</span>
                </div>
                <Button className="w-full mt-6" onClick={handleGetStarted}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">$29</div>
                <CardDescription>For serious entrepreneurs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Unlimited searches</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Advanced AI analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Export to PDF/CSV</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Trending insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Priority support</span>
                </div>
                <Button className="w-full mt-6" onClick={handleGetStarted}>
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">$299</div>
                <CardDescription>For teams & organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Everything in Pro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Team collaboration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Custom integrations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Dedicated support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>API access</span>
                </div>
                <Button className="w-full mt-6" onClick={handleGetStarted}>
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Discover Your Next Big Opportunity?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of entrepreneurs who've found their breakthrough with InnoGap
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6" onClick={handleGetStarted}>
              Start Finding Gaps Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <span className="text-xl font-bold">InnoGap</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered market gap discovery platform for entrepreneurs and innovators.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setLocation("/about")} className="hover:text-white">About</button></li>
                <li><button onClick={() => setLocation("/trending")} className="hover:text-white">Features</button></li>
                <li><button onClick={handleGetStarted} className="hover:text-white">Pricing</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setLocation("/about")} className="hover:text-white">About Us</button></li>
                <li><a href="mailto:support@innogap.ai" className="hover:text-white">Contact</a></li>
                <li><a href="mailto:careers@innogap.ai" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setLocation("/privacy")} className="hover:text-white">Privacy Policy</button></li>
                <li><button onClick={() => setLocation("/terms")} className="hover:text-white">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 InnoGap Technologies. All rights reserved. Business Registration: Pending
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}