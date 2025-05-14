'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center space-y-8"
      >
        <div className="relative w-32 h-32 mx-auto mb-8">
          <Image
            src="/coach-clarity.png"
            alt="Coach Clarity"
            fill
            className="rounded-full"
            priority
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900">
          Clarity Coach
        </h1>

        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Emotional clarity in under 10 minutes
        </p>

        <div className="w-full max-w-xs mx-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="w-full px-8 py-4 bg-[#4F46E5] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#4338CA] hover:border-white focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:ring-offset-2 hover:bg-[#4338CA]"
          >
            Begin Your Clarity Journey
          </motion.button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Powered by the SIGMA framework
        </p>
      </motion.div>
    </div>
  );
}; 