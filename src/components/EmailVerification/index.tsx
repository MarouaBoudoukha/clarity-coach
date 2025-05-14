'use client';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useState } from 'react';

export const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendCode = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setSuccess('Verification code sent! Please check your email.');
      setStep('code');
    } catch (error) {
      console.error('Email verification error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      setSuccess('Email verified successfully!');
      // Redirect to device verification page after successful email verification
      setTimeout(() => {
        window.location.href = '/verify/device';
      }, 2000);
    } catch (error) {
      console.error('Email verification error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {step === 'email' ? (
        <>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <Button
            onClick={handleSendCode}
            disabled={isLoading || !email}
            size="lg"
            variant="primary"
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter verification code"
            />
          </div>
          <Button
            onClick={handleVerifyCode}
            disabled={isLoading || !code}
            size="lg"
            variant="primary"
            className="w-full"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </>
      )}
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 mt-2">{success}</p>
      )}
      {step === 'code' && (
        <button
          onClick={() => setStep('email')}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Change email
        </button>
      )}
    </div>
  );
}; 