import { NextRequest, NextResponse } from 'next/server';
import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal: string | undefined;
}

export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload;
    
    // Validate that the action matches our configured action
    if (action !== 'verify') {
      return NextResponse.json(
        { error: 'Invalid action ID' },
        { status: 400 }
      );
    }

    const app_id = process.env.APP_ID as `app_${string}`;
    if (!app_id) {
      console.error('APP_ID environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    const verifyRes = (await verifyCloudProof(payload, app_id, action, signal)) as IVerifyResponse;

    if (verifyRes.success) {
      // This is where you should perform backend actions if the verification succeeds
      // Such as, setting a user as "verified" in a database
      return NextResponse.json({ verifyRes, status: 200 });
    } else {
      // This is where you should handle errors from the World ID /verify endpoint.
      // Usually these errors are due to a user having already verified.
      console.error('Verification failed:', verifyRes);
      return NextResponse.json({ verifyRes, status: 400 });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 