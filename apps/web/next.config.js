/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    domains: [
      'api.mapbox.com',
      'images.unsplash.com',
      // Add your Supabase storage domain if using Supabase Storage
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '',
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers (additional to middleware)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fix for canvas module (if used by dependencies)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
      };
    }

    return config;
  },

  // Enable SWC minification for faster builds
  swcMinify: true,

  // Experimental features
  experimental: {
    // Enable optimistic client cache
    optimisticClientCache: true,
  },

  // Redirects
  async redirects() {
    return [
      // Redirect /admin to /admin/dashboard or login
      {
        source: '/admin',
        destination: '/admin/sponsors',
        permanent: false,
      },
    ];
  },

  // Environment variables to expose to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: 'YK Buddy',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // Performance optimizations
  compress: true,

  // Disable x-powered-by header
  poweredByHeader: false,
};

module.exports = nextConfig;
