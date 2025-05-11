'use client';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit, VerificationLevel } from '@worldcoin/minikit-js';
import { useState } from 'react';

/**
 * This component is an example of how to authenticate a user
 * We will use Next Auth for this example, but you can use any auth provider
 * Read More: https://docs.world.org/mini-apps/commands/wallet-auth
 */
export const AuthButton = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (verificationLevel: VerificationLevel) => {
    if (!MiniKit.isInstalled()) {
      console.log('MiniKit is not installed');
      return;
    }

    setIsVerifying(true);

    try {
      const verifyPayload = {
        action: 'test-action',
        verification_level: verificationLevel,
      };

      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

      if (finalPayload.status === 'error') {
        console.error('Error payload', finalPayload);
        return;
      }

      // Verify the proof in the backend
      const verifyResponse = await fetch('/api/verify-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: finalPayload,
          action: 'test-action',
        }),
      });

      const verifyResponseJson = await verifyResponse.json();
      
      if (verifyResponseJson.status === 200) {
        console.log('Verification success!');
      } else {
        console.error('Verification failed:', verifyResponseJson);
      }
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!MiniKit.isInstalled()) {
    return (
      <div className="text-center p-4">
        <p className="text-sm text-gray-500">
          Please open this app in the World App to verify your identity
        </p>
      </div>
    );
  }

  return (
    <div className="grid w-full gap-4">
      <Button
        onClick={() => handleVerify(VerificationLevel.Device)}
        disabled={isVerifying}
        size="lg"
        variant="tertiary"
        className="w-full"
      >
        {isVerifying ? 'Verifying...' : 'Verify with Device'}
      </Button>
      <Button
        onClick={() => handleVerify(VerificationLevel.Orb)}
        disabled={isVerifying}
        size="lg"
        variant="primary"
        className="w-full"
      >
        {isVerifying ? 'Verifying...' : 'Verify with Orb'}
      </Button>
    </div>
  );
};
