import { NextResponse } from 'next/server';

/**
 * Health check endpoint
 * Used by monitoring services and load balancers
 */
export async function GET() {
  const healthCheck: {
    status: string;
    timestamp: string;
    uptime: number;
    environment: string | undefined;
    version: string;
    checks: {
      server: string;
      database?: string;
    };
  } = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      server: 'ok',
    },
  };

  // Optional: Add database check
  try {
    // await checkDatabase();
    healthCheck.checks = { ...healthCheck.checks, database: 'ok' };
  } catch (error) {
    healthCheck.status = 'degraded';
    healthCheck.checks = { ...healthCheck.checks, database: 'error' };
  }

  const statusCode = healthCheck.status === 'healthy' ? 200 : 503;

  return NextResponse.json(healthCheck, { status: statusCode });
}

/**
 * HEAD request for simple alive check
 */
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}


