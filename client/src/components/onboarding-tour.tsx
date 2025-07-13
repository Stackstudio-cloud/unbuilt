import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, Sparkles, TrendingUp, Users, FileText, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  proOnly?: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Unbuilt',
    description: 'Discover untapped market opportunities with AI-powered gap analysis',
    icon: <Sparkles className="w-8 h-8 text-purple-400" />,
    features: [
      'AI-powered market gap discovery',
      'Innovation scoring and feasibility analysis',
      'Real-time opportunity identification',
      'Professional business insights'
    ]
  },
  {
    id: 'search',
    title: 'Start Your Search',
    description: 'Enter any industry, product category, or market to discover gaps',
    icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
    features: [
      'Natural language search queries',
      'Industry-specific gap analysis',
      'Market size estimation',
      'Feasibility scoring (High/Medium/Low)'
    ]
  },
  {
    id: 'pro-features',
    title: 'Unlock Pro Features',
    description: 'Get comprehensive business intelligence with Pro subscription',
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    features: [
      'Action Plan Generator - 4-phase development roadmaps',
      'Competitive Analysis - Market positioning insights',
      'Market Intelligence - Demographics & growth data',
      'Professional Export - PDF reports, CSV data, pitch decks'
    ],
    proOnly: true
  },
  {
    id: 'collaboration',
    title: 'Save & Share Results',
    description: 'Build your opportunity portfolio and collaborate with your team',
    icon: <Users className="w-8 h-8 text-green-400" />,
    features: [
      'Save promising opportunities',
      'Share findings with stakeholders',
      'Export professional reports',
      'Track your discovery history'
    ]
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrial?: () => void;
}

export default function OnboardingTour({ isOpen, onClose, onStartTrial }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  
  if (!isOpen) return null;

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartTrial = () => {
    onStartTrial?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl premium-card">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center justify-center mb-4">
            {step.icon}
          </div>
          
          <CardTitle className="text-2xl neon-glow">{step.title}</CardTitle>
          <CardDescription className="text-lg">{step.description}</CardDescription>
          
          {step.proOnly && (
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              Pro Features
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3">
            {step.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {step.proOnly && user?.plan === 'free' && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                <p className="text-sm text-muted-foreground mb-3">
                  Start your 7-day free trial to access all Pro features worth $29/month
                </p>
                <Button onClick={handleStartTrial} className="btn-premium">
                  Start Free Trial
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-purple-400' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {!isFirstStep && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              
              <Button onClick={handleNext} className="btn-premium">
                {isLastStep ? 'Get Started' : 'Next'}
                {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function useOnboardingTour() {
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const tourShown = localStorage.getItem('unbuilt-tour-shown');
    setHasSeenTour(!!tourShown);
  }, []);

  const showTour = () => {
    return user && !hasSeenTour;
  };

  const markTourAsShown = () => {
    localStorage.setItem('unbuilt-tour-shown', 'true');
    setHasSeenTour(true);
  };

  return {
    shouldShowTour: showTour(),
    markTourAsShown
  };
}