'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface OnboardingCarouselProps {
  onComplete: () => void;
}

const screens = [
  {
    title: 'Meet Coach Clarity',
    subtitle: 'Your personal guide to emotional intelligence',
    description: 'Transform confusion into clarity in under 10 minutes through guided self-reflection',
    image: '/onboarding/intro.png',
  },
  {
    title: 'Decode Your Emotions',
    subtitle: 'Using the proven SIGMA framework',
    description: 'A 5-step journey to understand your triggers, beliefs, and take aligned action',
    image: '/onboarding/sigma.png',
  },
  {
    title: 'Clarity Rewards',
    subtitle: 'Earn while you grow',
    description: 'Complete sessions to earn Clarity Tokens you can stake and redeem for premium features',
    image: '/onboarding/rewards.png',
  },
  {
    title: 'Build Your Clarity Practice',
    subtitle: 'Just 10 minutes a day',
    description: 'Track your progress and watch your emotional intelligence grow with each session',
    image: '/onboarding/practice.png',
  },
  {
    title: 'Join the Clarity Community',
    subtitle: 'You&apos;re not alone on this journey',
    description: 'Share anonymously, gain insights from others, and celebrate breakthroughs together',
    image: '/onboarding/community.png',
  },
];

export const OnboardingCarousel = ({ onComplete }: OnboardingCarouselProps) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const nextScreen = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md space-y-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentScreen ? 'bg-blue-600 scale-125' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Screen content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-xl space-y-6"
          >
            <div className="relative w-48 h-48 mx-auto">
              <Image
                src={screens[currentScreen].image}
                alt={screens[currentScreen].title}
                fill
                className="object-contain"
              />
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {screens[currentScreen].title}
              </h2>
              <p className="text-lg text-gray-600">
                {screens[currentScreen].subtitle}
              </p>
              <p className="text-gray-500">
                {screens[currentScreen].description}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={skipOnboarding}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextScreen}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentScreen === screens.length - 1 ? 'Get Started' : 'Next'}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}; 