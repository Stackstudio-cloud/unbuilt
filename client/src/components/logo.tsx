import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white' | 'dark';
}

export default function Logo({ className = '', size = 'md', variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'white':
        return 'from-white to-gray-200';
      case 'dark':
        return 'from-gray-800 to-gray-900';
      default:
        return 'from-purple-600 via-blue-600 to-cyan-500';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'white':
        return 'text-white';
      case 'dark':
        return 'text-gray-900';
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="stop-purple-600" />
              <stop offset="50%" className="stop-blue-600" />
              <stop offset="100%" className="stop-cyan-500" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main circle */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="url(#logoGradient)"
            className="drop-shadow-lg"
            filter="url(#glow)"
          />
          
          {/* Letter "U" in modern style */}
          <path
            d="M12 10 L12 22 Q12 28 18 28 L22 28 Q28 28 28 22 L28 10"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />
          
          {/* Small dot accent */}
          <circle
            cx="32"
            cy="12"
            r="2"
            fill="white"
            className="animate-pulse"
          />
        </svg>
      </div>
      
      {/* Text */}
      <span className={`font-bold ${textSizes[size]} ${getTextColor()} tracking-tight`}>
        Unbuilt
      </span>
    </div>
  );
}

export function LogoIcon({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="stop-purple-600" />
            <stop offset="50%" className="stop-blue-600" />
            <stop offset="100%" className="stop-cyan-500" />
          </linearGradient>
        </defs>
        
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="url(#iconGradient)"
          className="drop-shadow-lg"
        />
        
        <path
          d="M12 10 L12 22 Q12 28 18 28 L22 28 Q28 28 28 22 L28 10"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <circle
          cx="32"
          cy="12"
          r="2"
          fill="white"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}