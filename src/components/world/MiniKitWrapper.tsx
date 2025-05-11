'use client';

import { useEffect, useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-react';

export default function MiniKitWrapper({ children }: { children: React.ReactNode }) {
    const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
    
    useEffect(() => {
        try {
        const installed = MiniKit.isInstalled();
        setIsInstalled(installed);
        console.log('World MiniKit status:', installed ? 'Installed' : 'Not installed');
        } catch (error) {
        console.error('Error checking MiniKit installation:', error);
        setIsInstalled(false);
        }
    }, []);

    return (
        <div>
        {/* Optional status indicator */}
        {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-2 right-2 z-50 bg-white dark:bg-gray-800 text-xs p-1 rounded shadow">
            MiniKit: {isInstalled === null ? 'Checking...' : isInstalled ? 'Active' : 'Browser Mode'}
            </div>
        )}
        {children}
        </div>
    );
}