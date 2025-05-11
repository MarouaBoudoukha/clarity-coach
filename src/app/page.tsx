'use client';
import { AuthButton } from '@/components/AuthButton';
import { EmailVerification } from '@/components/EmailVerification';
import { MiniKit } from '@worldcoin/minikit-js';

export default function Home() {
  const isWorldApp = MiniKit.isInstalled();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">Welcome to Clarity Coach</h1>
        
        <div className="space-y-8">
          {/* World ID Verification Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Verify with World ID</h2>
            <AuthButton />
            {!isWorldApp && (
              <p className="text-sm text-gray-500 text-center">
                Please open this app in the World App to verify with World ID
              </p>
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

          {/* Email Verification Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center">Verify with Email</h2>
            <EmailVerification />
          </div>
        </div>
      </div>
    </div>
  );
}
