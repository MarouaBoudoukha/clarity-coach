import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverExternalPackages: ['@worldcoin/minikit-js', '@auth/core']
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.worldcoin.org https://*.worldcoin.org:443 https://5d6e-2a04-cec0-c00b-470b-68b2-f599-7761-23a8.ngrok-free.app"
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type'
          }
        ]
      }
    ];
  },
  images: {
    domains: ['*.ngrok-free.app', 'localhost'],
  },
  allowedDevOrigins: ['https://5d6e-2a04-cec0-c00b-470b-68b2-f599-7761-23a8.ngrok-free.app']
};

export default config;
