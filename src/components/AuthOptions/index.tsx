'use client';

import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface AuthOptionsProps {
  onVerify: () => void;
}

export const AuthOptions = ({ onVerify }: AuthOptionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orbVerifyPayload: VerifyCommandInput = {
    action: 'verify',
    verification_level: VerificationLevel.Orb,
  };

  const handleOrbVerify = async () => {
    if (!MiniKit.isInstalled()) {
      setError('Please open this app in the World App to verify');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify(orbVerifyPayload);
      
      if (finalPayload.status === 'error') {
        console.error('Error payload:', finalPayload);
        setError('Verification failed. Please try again.');
        return;
      }

      const verifyResponse = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          action: 'verify',
        }),
      });

      const verifyResponseJson = await verifyResponse.json();
      if (verifyResponseJson.status === 200) {
        console.log('Verification success!');
        onVerify();
      } else {
        console.error('Verification failed:', verifyResponseJson);
        setError('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Clarity Coach
          </h1>
          <p className="text-gray-600">
            Choose how you'd like to continue
          </p>
        </div>

        <div className="space-y-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOrbVerify}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gray-900 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? 'Verifying...' : 'Verify with World ID'}
          </motion.button>

          <p className="text-sm text-gray-500 text-center">
            Secure, private authentication
          </p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onVerify}
            className="w-full py-4 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300"
          >
            Continue as Guest
          </motion.button>

          <p className="text-sm text-gray-500 text-center">
            Limited features, no personalized tracking
          </p>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}; 