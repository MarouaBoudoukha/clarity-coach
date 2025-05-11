'use client';
import { useState } from 'react';

interface StepProgressProps {
  currentStep: string;
  sessionTime: number;
}

const steps = [
  { id: 'situation', label: 'Situation', icon: '🔍' },
  { id: 'identify', label: 'Identify', icon: '🧭' },
  { id: 'gut', label: 'Gut Feeling', icon: '💢' },
  { id: 'mental', label: 'Mental Response', icon: '🧠' },
  { id: 'action', label: 'Aligned Action', icon: '🔄' },
  { id: 'completed', label: 'Clarity Snapshot', icon: '📸' },
];

export default function StepProgress({ currentStep, sessionTime }: StepProgressProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [targetTime] = useState<number>(10 * 60); // 10 minutes in seconds
  
  // Calculate current step index
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  const progress = currentIndex === -1 ? 0 : (currentIndex / (steps.length - 1)) * 100;
  
  // Calculate time progress as percentage
  const timeProgress = Math.min((sessionTime / targetTime) * 100, 100);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Time remaining
  const timeRemaining = Math.max(targetTime - sessionTime, 0);
  
  // Time warning color
  const getTimeColor = () => {
    if (timeProgress >= 90) return 'text-red-500';
    if (timeProgress >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  return (
    <div className="w-full mb-4">
      {/* Step progress */}
      <div className="flex items-center mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 dark:bg-gray-700">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className={`text-sm font-medium ${getTimeColor()}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          // Determine if step is active, completed, or upcoming
          const isActive = currentStep === step.id;
          const isCompleted = currentIndex >= index;
          const isUpcoming = currentIndex < index;
          
          return (
            <div 
              key={step.id} 
              className="relative flex flex-col items-center"
              onMouseEnter={() => setShowTooltip(step.id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive 
                    ? 'bg-purple-600 text-white' 
                    : isCompleted 
                      ? 'bg-purple-200 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
                      : 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                }`}
              >
                <span>{step.icon}</span>
              </div>
              
              {/* Step label (visible on larger screens) */}
              <span className={`text-xs mt-1 hidden md:block ${
                isActive 
                  ? 'text-purple-600 dark:text-purple-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.label}
              </span>
              
              {/* Tooltip (visible on hover and small screens) */}
              {showTooltip === step.id && (
                <div className="absolute top-full mt-2 z-10 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg md:hidden">
                  {step.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 