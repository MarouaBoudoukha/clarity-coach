'use client';
import { EmailVerification } from '@/components/EmailVerification';
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="space-y-4">
              <EmailVerification />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      >
        {isDarkMode ? '🌞' : '🌙'}
      </button>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <Image
                src="/coach-clarity.png"
                alt="Coach Clarity"
                fill
                className="rounded-full"
                priority
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Gain emotional clarity in under 10 minutes with the SIGMA framework
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
              Transform confusion into clarity with self-coaching that works
            </p>
            <div className="mt-10">
              <Button
                onClick={() => window.location.href = '/coach'}
                className="px-8 py-3 text-lg font-medium"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SIGMA Framework Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The SIGMA Framework</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              A structured approach to emotional clarity and decision-making
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  title: 'Situation',
                  description: 'Understand the current context and circumstances',
                  icon: '🎯',
                },
                {
                  title: 'Identify',
                  description: 'Recognize emotions and patterns in your response',
                  icon: '🔍',
                },
                {
                  title: 'Gut Feeling',
                  description: 'Acknowledge your initial instincts and reactions',
                  icon: '💭',
                },
                {
                  title: 'Mental Response',
                  description: 'Analyze thoughts and beliefs about the situation',
                  icon: '🧠',
                },
                {
                  title: 'Aligned Action',
                  description: 'Take steps that align with your values and goals',
                  icon: '✨',
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105"
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Benefits</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Experience the power of emotional clarity
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                title: 'Breakthrough Speed',
                description: 'Achieve clarity in minutes, not days',
                icon: '⚡',
              },
              {
                title: 'Emotional Clarity',
                description: 'Understand and process your emotions effectively',
                icon: '🌈',
              },
              {
                title: 'Actionable Insights',
                description: 'Get clear, practical steps to move forward',
                icon: '🎯',
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{benefit.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Users Say</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Real experiences from people who found clarity
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "The SIGMA framework helped me make a difficult decision in just 10 minutes.",
                author: "Sarah M.",
                role: "Product Manager",
              },
              {
                quote: "I've never felt so clear about my emotions and next steps.",
                author: "James K.",
                role: "Software Engineer",
              },
              {
                quote: "This is exactly what I needed to break through my confusion.",
                author: "Emma R.",
                role: "Designer",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                <div className="mt-4">
                  <p className="font-medium text-gray-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
