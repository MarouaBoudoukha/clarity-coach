'use client';

import { DeviceVerification } from '@/components/DeviceVerification';

export default function DeviceVerificationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Device Verification</h1>
          <p className="mt-2 text-gray-600">Please verify your device to continue</p>
        </div>

        <div className="space-y-6">
          <DeviceVerification />
        </div>
      </div>
    </div>
  );
} 