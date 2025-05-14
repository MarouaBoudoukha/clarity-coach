'use client';

import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';
import { useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';

export const DeviceVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyPayload: VerifyCommandInput = {
    action: 'verify2',
    verification_level: VerificationLevel.Device,
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

      if (!finalPayload.merkle_root || !finalPayload.nullifier_hash || !finalPayload.proof) {
        console.error('Missing required fields in payload:', finalPayload);
        setError('Invalid verification data. Please try again.');
        return;
      }

      const verifyResponse = await fetch('/api/verify/device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          verification_level: VerificationLevel.Device,
          action: 'verify2',
        }),
      });

      const verifyResponseJson = await verifyResponse.json();
      
      if (!verifyResponse.ok) {
        throw new Error(verifyResponseJson.error || 'Verification failed');
      }

      if (verifyResponseJson.status === 200) {
        console.log('Device verification success!');
        window.location.href = '/';
      } else {
        console.error('Device verification failed:', verifyResponseJson);
        setError('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Device verification failed:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Device Verification</h2>
        <p className="text-gray-600 mb-4">
          Please verify your device using World ID to continue
        </p>
      </div>

      <Button
        onClick={handleVerify}
        disabled={isLoading}
        size="lg"
        variant="primary"
        className="w-full"
      >
        {isLoading ? 'Verifying...' : 'Verify Device'}
      </Button>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}; 