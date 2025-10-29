/**
 * Health Check API Endpoint
 * 
 * Returns application health status including:
 * - Database connectivity
 * - External service status
 * - System information
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: HealthStatus;
    supabase: HealthStatus;
    memory?: HealthStatus;
  };
  environment: string;
}

interface HealthStatus {
  status: 'pass' | 'fail' | 'warn';
  message?: string;
  responseTime?: number;
  details?: any;
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    const supabase = createClient();
    
    // Simple query to check database connection
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single();

    const responseTime = Date.now() - startTime;

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is fine for health check
      return {
        status: 'fail',
        message: 'Database query failed',
        responseTime,
        details: error.message,
      };
    }

    // Warn if response time is slow
    if (responseTime > 1000) {
      return {
        status: 'warn',
        message: 'Database responding slowly',
        responseTime,
      };
    }

    return {
      status: 'pass',
      message: 'Database connection healthy',
      responseTime,
    };
  } catch (error) {
    return {
      status: 'fail',
      message: 'Database connection failed',
      responseTime: Date.now() - startTime,
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check Supabase connectivity
 */
async function checkSupabase(): Promise<HealthStatus> {
  const startTime = Date.now();
  
  try {
    // Check if Supabase environment variables are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        status: 'fail',
        message: 'Supabase not configured',
        responseTime: Date.now() - startTime,
      };
    }

    const supabase = createClient();
    
    // Check authentication service
    const { error } = await supabase.auth.getSession();

    const responseTime = Date.now() - startTime;

    if (error) {
      return {
        status: 'warn',
        message: 'Supabase auth check failed',
        responseTime,
        details: error.message,
      };
    }

    return {
      status: 'pass',
      message: 'Supabase services healthy',
      responseTime,
    };
  } catch (error) {
    return {
      status: 'fail',
      message: 'Supabase connection failed',
      responseTime: Date.now() - startTime,
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check memory usage
 */
function checkMemory(): HealthStatus {
  if (typeof process === 'undefined' || !process.memoryUsage) {
    return {
      status: 'warn',
      message: 'Memory usage not available',
    };
  }

  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const usagePercent = Math.round((usage.heapUsed / usage.heapTotal) * 100);

  // Warn if memory usage is high
  if (usagePercent > 90) {
    return {
      status: 'warn',
      message: 'High memory usage',
      details: {
        heapUsedMB,
        heapTotalMB,
        usagePercent,
      },
    };
  }

  return {
    status: 'pass',
    message: 'Memory usage normal',
    details: {
      heapUsedMB,
      heapTotalMB,
      usagePercent,
    },
  };
}

/**
 * GET /api/health
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Run health checks
    const [database, supabase, memory] = await Promise.all([
      checkDatabase(),
      checkSupabase(),
      Promise.resolve(checkMemory()),
    ]);

    // Determine overall status
    const checks = { database, supabase, memory };
    const hasFailure = Object.values(checks).some(check => check.status === 'fail');
    const hasWarning = Object.values(checks).some(check => check.status === 'warn');

    const overallStatus: 'healthy' | 'degraded' | 'unhealthy' = hasFailure
      ? 'unhealthy'
      : hasWarning
      ? 'degraded'
      : 'healthy';

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? process.uptime() : 0,
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      checks,
      environment: process.env.NODE_ENV || 'unknown',
    };

    // Return appropriate status code
    const statusCode = overallStatus === 'unhealthy' ? 503 : 200;

    return NextResponse.json(result, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check-Duration': `${Date.now() - startTime}ms`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}
