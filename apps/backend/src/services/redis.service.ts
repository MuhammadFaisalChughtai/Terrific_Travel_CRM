import { redis } from '../config';

export class RedisService {
  async get(key: string): Promise<string | null> {
    return redis.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await redis.set(key, value, 'EX', ttlSeconds);
    } else {
      await redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }

  async flushall(): Promise<void> {
    await redis.flushall();
  }
}

export const redisService = new RedisService();
