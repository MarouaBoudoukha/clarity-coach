'use client';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';
import { useState } from 'react';

/**
 * This component is an example of how to use World ID in Mini Apps
 * Minikit commands must be used on client components
 * It's critical you verify the proof on the server side
 * Read More: https://docs.world.org/mini-apps/commands/verify#verifying-the-proof
 */
export const Verify = () => {
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);

  const [whichVerification, setWhichVerification] = useState<VerificationLevel>(
    VerificationLevel.Device,
  );

  const handleVerify = async (verificationLevel: VerificationLevel) => {
    if (!MiniKit.isInstalled()) {
      console.log('MiniKit is not installed');
      return;
    }

    setButtonState('pending');
    setWhichVerification(verificationLevel);

    try {
      const verifyPayload = {
        action: 'test-action', // Make sure this matches your action ID from the Developer Portal
      verification_level: verificationLevel,
      };

      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

      if (finalPayload.status === 'error') {
        console.error('Error payload', finalPayload);
        setButtonState('failed');
        return;
      }

      // Verify the proof in the backend
      const verifyResponse = await fetch('/api/verify-proof', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
        action: 'test-action',
      }),
    });

      const verifyResponseJson = await verifyResponse.json();
      
      if (verifyResponseJson.status === 200) {
        console.log('Verification success!');
      setButtonState('success');
    } else {
        console.error('Verification failed:', verifyResponseJson);
        setButtonState('failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setButtonState('failed');
    }

      // Reset the button state after 3 seconds
      setTimeout(() => {
        setButtonState(undefined);
    }, 3000);
  };

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Verify</p>
      <LiveFeedback
        label={{
          failed: 'Failed to verify',
          pending: 'Verifying',
          success: 'Verified',
        }}
        state={
          whichVerification === VerificationLevel.Device
            ? buttonState
            : undefined
        }
        className="w-full"
      >
        <Button
          onClick={() => handleVerify(VerificationLevel.Device)}
          disabled={buttonState === 'pending'}
          size="lg"
          variant="tertiary"
          className="w-full"
        >
          Verify (Device)
        </Button>
      </LiveFeedback>
      <LiveFeedback
        label={{
          failed: 'Failed to verify',
          pending: 'Verifying',
          success: 'Verified',
        }}
        state={
          whichVerification === VerificationLevel.Orb ? buttonState : undefined
        }
        className="w-full"
      >
        <Button
          onClick={() => handleVerify(VerificationLevel.Orb)}
          disabled={buttonState === 'pending'}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Verify (Orb)
        </Button>
      </LiveFeedback>
    </div>
  );
};
