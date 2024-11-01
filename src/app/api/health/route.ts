// src/app/api/health/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getRedis } from '@/lib/redis';
import { DockerHealthCheck } from '@/lib/dockerHealth';

interface ServiceStatus {
  status: boolean;
  message: string;
  latency: number;
}

interface DockerStatus {
  status: boolean;
  message: string;
  missingServices: string[];
}

interface HealthCheck {
  uptime: number;
  timestamp: number;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message: string;
  services: {
    docker: DockerStatus;
    database: ServiceStatus;
    redis: ServiceStatus;
  };
  recommendations?: string[];
}

export async function GET() {
  const health: HealthCheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'healthy',
    message: '',
    services: {
      docker: {
        status: false,
        message: '',
        missingServices: []
      },
      database: {
        status: false,
        message: '',
        latency: 0
      },
      redis: {
        status: false,
        message: '',
        latency: 0
      }
    }
  };

  // Check Docker first
  try {
    const dockerStatus = await DockerHealthCheck.checkAllServices();
    health.services.docker = {
      status: dockerStatus.ok,
      message: dockerStatus.message,
      missingServices: dockerStatus.missingServices
    };

    if (!dockerStatus.ok) {
      health.status = 'unhealthy';
      health.message = 'Docker services are not fully operational';
    }
  } catch (error) {
    health.services.docker.message = 'Failed to check Docker status';
    health.status = 'degraded';
  }

  // Check Database
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = {
      status: true,
      message: 'Connected successfully',
      latency: Date.now() - startTime
    };
  } catch (error) {
    health.status = 'unhealthy';
    health.services.database = {
      status: false,
      message: error instanceof Error ? error.message : 'Database connection failed',
      latency: 0
    };
    console.error('Database health check failed:', error);
  }

  // Check Redis
  try {
    const startTime = Date.now();
    const redis = await getRedis();
    
    // Only try to ping if we're not in build phase
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      await redis.ping();
    }
    
    health.services.redis = {
      status: true,
      message: 'Connected successfully',
      latency: Date.now() - startTime
    };
  } catch (error) {
    health.status = 'unhealthy';
    health.services.redis = {
      status: false,
      message: error instanceof Error ? error.message : 'Redis connection failed',
      latency: 0
    };
    console.error('Redis health check failed:', error);
  }

  // Determine overall status
  if (health.status === 'healthy' && 
      (!health.services.database.status || 
       !health.services.redis.status)) {
    health.status = 'degraded';
    health.message = 'Some services are not fully operational';
  }

  // Add recommendations if services are down
  if (health.status !== 'healthy') {
    const recommendations: string[] = [];
    
    if (!health.services.docker.status) {
      recommendations.push('Start Docker Desktop and run "docker compose up -d"');
    }
    if (!health.services.database.status) {
      recommendations.push('Check PostgreSQL container logs: "docker logs r3-postgres"');
    }
    if (!health.services.redis.status) {
      recommendations.push('Check Redis container logs: "docker logs r3-redis"');
    }

    if (recommendations.length > 0) {
      health.recommendations = recommendations;
    }
  }

  // Set response status code
  const statusCode = health.status === 'healthy' ? 200 : 
                    health.status === 'degraded' ? 207 :
                    503;

  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/health+json'
    }
  });
}