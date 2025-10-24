/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'], // Add your image domains here
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },
  // Allow network access for local development
  allowedDevOrigins: [
    'http://192.168.86.35:3002',
    '192.168.86.35:3002',
  ],
  // Enable experimental features if needed
  experimental: {
    // appDir: true, // Already default in Next.js 14
  },
};

module.exports = nextConfig;
