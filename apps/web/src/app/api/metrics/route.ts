/**
 * Metrics API Endpoint
 * 
 * Returns application metrics for monitoring
 * Requires admin authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface MetricsResponse {
  timestamp: string;
  system: {
    uptime: number;
    memory: {
      heapUsed: number;
      heapTotal: number;
      external: number;
      rss: number;
    };
    cpu?: {
      user: number;
      system: number;
    };
  };
  application: {
    environment: string;
    version: string;
    nodeVersion: string;
  };
  database?: {
    totalUsers: number;
    totalProfiles: number;
    totalGarageSales?: number;
    totalSponsors?: number;
  };
  errors?: {
    last24Hours?: number;
    lastError?: string;
  };
}

/**
 * Check if user is admin
 */
async function isAdmin(request: NextRequest): Promise<boolean> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    return profile?.is_admin === true;
  } catch {
    return false;
  }
}

/**
 * Get database metrics
 */
async function getDatabaseMetrics() {
  try {
    const supabase = await createClient();

    // Get counts in parallel
    const [usersResult, profilesResult, salesResult, sponsorsResult] = await Promise.all([
      supabase.from('profiles').select('count', { count: 'exact', head: true }),
      supabase.from('profiles').select('count', { count: 'exact', head: true }),
      supabase.from('garage_sales').select('count', { count: 'exact', head: true }),
      supabase.from('premium_sponsors').select('count', { count: 'exact', head: true }),
    ]);

    return {
      totalUsers: usersResult.count || 0,
      totalProfiles: profilesResult.count || 0,
      totalGarageSales: salesResult.count || 0,
      totalSponsors: sponsorsResult.count || 0,
    };
  } catch (error) {
    return undefined;
  }
}

/**
 * GET /api/metrics
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminCheck = await isAdmin(request);

    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin access required' },
        { status: 401 }
      );
    }

    // Gather system metrics
    const memory = process.memoryUsage();
    const cpuUsage = process.cpuUsage ? process.cpuUsage() : undefined;

    // Get database metrics
    const database = await getDatabaseMetrics();

    const metrics: MetricsResponse = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memory: {
          heapUsed: Math.round(memory.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(memory.heapTotal / 1024 / 1024), // MB
          external: Math.round(memory.external / 1024 / 1024), // MB
          rss: Math.round(memory.rss / 1024 / 1024), // MB
        },
        cpu: cpuUsage
          ? {
              user: cpuUsage.user,
              system: cpuUsage.system,
            }
          : undefined,
      },
      application: {
        environment: process.env.NODE_ENV || 'unknown',
        version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        nodeVersion: process.version,
      },
      database,
    };

    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
