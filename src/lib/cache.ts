import { redis } from "./redis";
import { createChildLogger } from "./logger";

const log = createChildLogger("cache");

/**
 * Get a cached value, parsing JSON automatically.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    log.error({ key, err }, "Cache GET error");
    return null;
  }
}

/**
 * Set a cached value with TTL in seconds.
 */
export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    log.error({ key, err }, "Cache SET error");
  }
}

/**
 * Delete a specific cache key.
 */
export async function cacheDel(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (err) {
    log.error({ key, err }, "Cache DEL error");
  }
}

/**
 * Invalidate all cache keys matching a pattern (e.g. `cache:search:nurses:*`).
 * Uses SCAN to avoid blocking Redis.
 */
export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  try {
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (err) {
    log.error({ pattern, err }, "Cache invalidate pattern error");
  }
}

/**
 * Cache-aside pattern: get from cache, or compute + cache.
 */
export async function cacheGetOrSet<T>(
  key: string,
  ttlSeconds: number,
  compute: () => Promise<T>
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const value = await compute();
  await cacheSet(key, value, ttlSeconds);
  return value;
}
