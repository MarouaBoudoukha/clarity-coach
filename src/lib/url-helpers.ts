export function getDynamicNextAuthUrl() {
    // Check for explicit environment variable first
    if (process.env.NEXT_PUBLIC_NGROK_URL && process.env.NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_NGROK_URL;
    }
    
    // Check if running on Vercel
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    
    // Default to localhost for local development without ngrok
    return process.env.NEXTAUTH_URL || 'http://localhost:3000';
    }

    export function getAuthCallbackUrl() {
    return `${getDynamicNextAuthUrl()}/api/auth/callback/world`;
}