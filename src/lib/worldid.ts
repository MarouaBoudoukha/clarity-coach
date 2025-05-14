import { ISuccessResult } from '@worldcoin/minikit-js';

interface VerifyWorldIDParams {
  action_id: string;
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  credential_type: string;
  signal: string;
}

interface VerifyWorldIDResponse {
  success: boolean;
  error?: string;
}

export async function verifyWorldID(params: VerifyWorldIDParams): Promise<VerifyWorldIDResponse> {
  try {
    // Use the correct endpoint for device verification
    const endpoint = params.credential_type === 'device' 
      ? 'https://developer.worldcoin.org/api/v1/verify/device'
      : 'https://developer.worldcoin.org/api/v1/verify';

    console.log('Sending verification request to:', endpoint, {
      action_id: params.action_id,
      merkle_root: params.merkle_root,
      nullifier_hash: params.nullifier_hash,
      credential_type: params.credential_type,
      signal: params.signal,
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action_id: params.action_id,
        merkle_root: params.merkle_root,
        nullifier_hash: params.nullifier_hash,
        proof: params.proof,
        credential_type: params.credential_type,
        signal: params.signal,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('World ID verification failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return {
        success: false,
        error: `Verification failed: ${response.statusText}`,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('World ID verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 