// src/components/ProcessingAnimation.tsx
import React from "react";
import { Loader } from "lucide-react";

interface ProcessingAnimationProps {
  status: string;
  isDark: boolean;
}

export const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({ status, isDark }) => {
  if (status === 'Processed') {
    return (
      <div className={`relative w-32 h-32 mx-auto ${
        isDark ? 'text-green-400' : 'text-green-600'
      }`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeDasharray="283" 
            strokeDashoffset="0" 
            className="animate-pulse"
          />
          <path 
            d="M30 50 L45 65 L70 35" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (status === 'Extracting') {
    return (
      <div className="relative w-32 h-32 mx-auto">
        <div className={`absolute inset-0 flex items-center justify-center ${
          isDark ? 'text-yellow-400' : 'text-yellow-600'
        }`}>
          <Loader className="w-12 h-12 animate-spin" />
        </div>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke={isDark ? '#2e2c50' : '#e5e7eb'} 
            strokeWidth="8" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeDasharray="283" 
            strokeDashoffset="142" 
            className="animate-pulse"
          />
        </svg>
      </div>
    );
  }

  if (status === 'In queue') {
    return (
      <div className="relative w-32 h-32 mx-auto">
        <div className={`absolute inset-0 ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        }`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke={isDark ? '#2e2c50' : '#e5e7eb'} 
              strokeWidth="8" 
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeDasharray="283" 
              strokeDashoffset="212" 
              className="animate-spin"
              style={{ animationDuration: '3s' }}
            />
          </svg>
        </div>
      </div>
    );
  }

  // Not extracted
  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className={`absolute inset-0 ${
        isDark ? 'text-gray-600' : 'text-gray-400'
      }`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeDasharray="283" 
            strokeDashoffset="283" 
          />
          <text 
            x="50" 
            y="50" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fill="currentColor" 
            fontSize="12"
            fontWeight="bold"
          >
            Not Started
          </text>
        </svg>
      </div>
    </div>
  );
};