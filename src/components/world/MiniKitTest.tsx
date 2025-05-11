'use client';

import { useEffect, useState } from 'react';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';

export default function MiniKitTest() {
    const [isChecking, setIsChecking] = useState(true);
    const { isInstalled } = useMiniKit();
    
    useEffect(() => {
        setIsChecking(false);
    }, [isInstalled]);
    
    return (
        <div className="p-4 bg-gray-100 rounded-lg mt-4">
            <h2 className="text-lg font-semibold">World MiniKit Status</h2>
            <p>MiniKit installed: {isChecking ? 'Checking...' : isInstalled ? 'Yes' : 'No'}</p>
            <p className="text-sm text-gray-500 mt-2">
                {isInstalled 
                ? 'Running inside World App' 
                : 'Running in browser mode - Some features will be limited'}
            </p>
        </div>
    );
}