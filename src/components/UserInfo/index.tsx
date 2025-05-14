'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

/**
 * Minikit is only available on client side. Thus user info needs to be rendered on client side.
 * UserInfo component displays user information including profile picture, username, and verification status.
 * It uses the Marble component from the mini-apps-ui-kit-react library to display the profile picture.
 * The component is client-side rendered.
 */
export const UserInfo = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex flex-row items-center justify-start gap-4 rounded-xl w-full border-2 border-gray-200 p-4">
        <div className="animate-pulse bg-gray-200 rounded-full w-12 h-12"></div>
        <div className="animate-pulse bg-gray-200 rounded h-4 w-32"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-start gap-4 rounded-xl w-full border-2 border-gray-200 p-4">
      {session.user?.image && (
        <Image
          src={session.user.image}
          alt="Profile"
          width={48}
          height={48}
          className="rounded-full"
        />
      )}
      <div className="flex flex-col">
        <span className="font-medium">{session.user?.name || 'Anonymous'}</span>
        <span className="text-sm text-gray-500">{session.user?.email}</span>
      </div>
    </div>
  );
};
