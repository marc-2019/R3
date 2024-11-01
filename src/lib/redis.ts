// src/lib/redis.ts

import { Redis, RedisOptions } from 'ioredis';
import { DockerHealthCheck } from './dockerHealth';

const getRedisConfig = async (): Promise<RedisOptions> => {
  // During build time, use default config
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return {
      host: 'localhost',
      port: 6379,
      lazyConnect: true
    };
  }

  // Check Docker status in development
  if (process.env.NODE_ENV !== 'production') {
    const dockerStatus = await DockerHealthCheck.checkAllServices();
    if (!dockerStatus.ok) {
      console.warn('Docker warning:', dockerStatus.message);
    }
  }
  
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.REDIS_URL) {
      console.warn('REDIS_URL not found in production, using default configuration');
      return {
        host: 'localhost',
        port: 6379,
        lazyConnect: true
      };
    }

    try {
      const redisUrl = new URL(process.env.REDIS_URL);
      return {
        host: redisUrl.hostname,
        port: parseInt(redisUrl.port || '6379', 10),
        username: redisUrl.username || undefined,
        password: redisUrl.password || undefined,
        db: redisUrl.pathname ? parseInt(redisUrl.pathname.substring(1), 10) : undefined,
        lazyConnect: true,
        retryStrategy: (times: number) => {
          if (times > 3) {
            console.error('Redis connection failed after 3 retries');
            return null;
          }
          return Math.min(times * 200, 1000);
        }
      };
    } catch (error) {
      console.error('Failed to parse REDIS_URL:', error);
      return {
        host: 'localhost',
        port: 6379,
        lazyConnect: true
      };
    }
  }

  // Development/test defaults
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    lazyConnect: true,
    retryStrategy: (times: number) => {
      if (times > 3) {
        console.error('Redis connection failed after 3 retries');
        return null;
      }
      return Math.min(times * 200, 1000);
    }
  };
};

// Type for our global Redis instance
type GlobalRedis = {
  redis: Redis | undefined;
  promise: Promise<Redis> | undefined;
};

// Declare global Redis instance
const globalForRedis = globalThis as unknown as { 
  redisClient: GlobalRedis | undefined;
};

// Create or get Redis client
const getRedisClient = async (): Promise<Redis> => {
  if (!globalForRedis.redisClient) {
    globalForRedis.redisClient = {
      redis: undefined,
      promise: undefined,
    };
  }

  if (globalForRedis.redisClient.redis) {
    return globalForRedis.redisClient.redis;
  }

  if (!globalForRedis.redisClient.promise) {
    globalForRedis.redisClient.promise = getRedisConfig().then(config => {
      const client = new Redis(config);
      globalForRedis.redisClient!.redis = client;
      return client;
    });
  }

  return globalForRedis.redisClient.promise;
};

// Export the Redis client getter
export const getRedis = async () => {
  try {
    return await getRedisClient();
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
    throw error;
  }
};

// Initial configuration for direct Redis usage
const getInitialConfig = async (): Promise<RedisOptions> => {
  // Check Docker in development
  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
    const dockerStatus = await DockerHealthCheck.checkAllServices();
    if (!dockerStatus.ok) {
      console.warn('Docker warning:', dockerStatus.message);
    }
  }

  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    lazyConnect: true
  };
};

// Export Redis instance with lazy connection
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  lazyConnect: true
});

// Set up global instance if not in production
if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redisClient = {
    redis,
    promise: Promise.resolve(redis),
  };
}