import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWorldID } from '@/lib/worldid';

export async function POST(req: Request) {
  try {
    const { payload, verification_level, action } = await req.json();

    if (!payload || !verification_level || !action) {
      console.error('Missing required fields:', { payload, verification_level, action });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Verifying with params:', {
      action_id: action,
      merkle_root: payload.merkle_root,
      nullifier_hash: payload.nullifier_hash,
      credential_type: 'device',
      signal: 'device_verification',
    });

    // Verify the World ID proof
    const verificationResult = await verifyWorldID({
      action_id: action,
      merkle_root: payload.merkle_root,
      nullifier_hash: payload.nullifier_hash,
      proof: payload.proof,
      credential_type: 'device',
      signal: 'device_verification',
    });

    if (!verificationResult.success) {
      console.error('World ID verification failed:', verificationResult);
      return NextResponse.json(
        { error: verificationResult.error || 'Verification failed' },
        { status: 400 }
      );
    }

    // Store the verification result
    await prisma.verification.create({
      data: {
        nullifier_hash: payload.nullifier_hash,
        verification_level: verification_level,
        feature: 'device_verification',
        verified_at: new Date(),
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Device verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify device' },
      { status: 500 }
    );
  }
} 