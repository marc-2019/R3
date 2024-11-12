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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function GET() {
  console.log("Health check started");
  const health: HealthCheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'healthy',  // Initially set as healthy
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
    console.log("Checking Docker services...");
    const dockerStatus = await withTimeout(DockerHealthCheck.checkAllServices(), 5000);
    health.services.docker = {
      status: dockerStatus.ok,
      message: dockerStatus.message,
      missingServices: dockerStatus.missingServices
    };
    console.log("Docker services check completed");
  } catch (error) {
    health.services.docker.message = 'Failed to check Docker status';
    health.services.docker.status = false;
    console.error('Docker health check failed:', error);
  }

  // Check Database
  try {
    console.log("Checking database connectivity...");
    const startTime = Date.now();
    await withTimeout(prisma.$queryRaw`SELECT 1`, 5000);
    health.services.database = {
      status: true,
      message: 'Connected successfully',
      latency: Date.now() - startTime
    };
    console.log("Database check completed successfully");
  } catch (error) {
    health.services.database = {
      status: false,
      message: error instanceof Error ? error.message : 'Database connection failed',
      latency: 0
    };
    console.error('Database health check failed:', error);
  }

  // Check Redis
  try {
    console.log("Checking Redis connectivity...");
    const startTime = Date.now();
    const redis = await getRedis();

    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      await withTimeout(redis.ping(), 5000);
    }

    health.services.redis = {
      status: true,
      message: 'Connected successfully',
      latency: Date.now() - startTime
    };
    console.log("Redis check completed successfully");
  } catch (error) {
    health.services.redis = {
      status: false,
      message: error instanceof Error ? error.message : 'Redis connection failed',
      latency: 0
    };
    console.error('Redis health check failed:', error);
  }

  // Determine overall status based on individual services
  if (
    !health.services.docker.status ||
    !health.services.database.status ||
    !health.services.redis.status
  ) {
    health.status = 'unhealthy';
    health.message = 'One or more services are not fully operational';
  } else {
    health.status = 'healthy';
    health.message = 'All services are operational';
  }

  // Log details of all services to help debug
  console.log("Service Details:", JSON.stringify(health.services, null, 2));

  // Add recommendations if services are down
  if (health.status === 'unhealthy') {
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
  const statusCode = health.status === 'healthy' ? 200 : 503;

  console.log("Health check completed with status:", health.status);
  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/health+json'
    }
  });
}
