/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'ngrok.io', 'ngrok-free.app'],
    unoptimized: true
  },
  output: 'standalone'
}

export default nextConfig 