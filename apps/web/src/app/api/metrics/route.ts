import { NextResponse } from 'next/server';

/**
 * Metrics endpoint for monitoring
 * Returns application metrics in a format compatible with monitoring tools
 */
export async function GET() {
  const metrics = {
    timestamp: new Date().toISOString(),
    application: {
      name: 'yk-buddy-web',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
    },
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
    },
    // Add custom metrics here
    custom: {
      // Example: totalUsers, activeUsers, apiCalls, etc.
    },
  };

  return NextResponse.json(metrics);
}


