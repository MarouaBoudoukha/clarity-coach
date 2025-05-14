'use client';

import { useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { AuthOptions } from '@/components/AuthOptions';
import { OnboardingCarousel } from '@/components/OnboardingCarousel';

type OnboardingStep = 'splash' | 'auth' | 'onboarding' | 'complete';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('splash');

  const handleSplashComplete = () => {
    setCurrentStep('auth');
  };

  const handleAuthComplete = () => {
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentStep('complete');
    window.location.href = '/coach';
  };

  switch (currentStep) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
    case 'auth':
      return <AuthOptions onVerify={handleAuthComplete} />;
    case 'onboarding':
      return <OnboardingCarousel onComplete={handleOnboardingComplete} />;
    default:
      return null;
  }
}
