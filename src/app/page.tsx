'use client';
import { EmailVerification } from '@/components/EmailVerification';
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';
import { useState } from 'react';

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyPayload: VerifyCommandInput = {
    action: 'verify',
    verification_level: VerificationLevel.Orb,
  };

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      setError('Please open this app in the World App to verify');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
      
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
        setIsVerified(true);
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

  if (!isVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Clarity Coach</h1>
            <p className="mt-2 text-gray-600">Verify your identity to begin</p>
          </div>

          <div className="space-y-6">
            {/* World ID Verification */}
            <div className="space-y-4">
              <button
                onClick={handleVerify}
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Verifying...' : 'Verify with World ID'}
              </button>
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Email Verification */}
            <div className="space-y-4">
              <EmailVerification />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to Clarity Coach
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your AI-powered companion for emotional clarity and personal growth
            </p>
          </div>
        </div>
      </div>

      {/* SIGMA Framework Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">The SIGMA Framework</h2>
            <p className="mt-4 text-lg text-gray-500">
              A structured approach to emotional clarity and decision-making
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  title: 'Situation',
                  description: 'Understand the current context and circumstances',
                },
                {
                  title: 'Identify',
                  description: 'Recognize emotions and patterns in your response',
                },
                {
                  title: 'Gut Feeling',
                  description: 'Acknowledge your initial instincts and reactions',
                },
                {
                  title: 'Mental Response',
                  description: 'Analyze thoughts and beliefs about the situation',
                },
                {
                  title: 'Aligned Action',
                  description: 'Take steps that align with your values and goals',
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="relative p-6 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
