import { redis } from "@/lib/redis";
import { createChildLogger } from "@/lib/logger";
import { RATE_LIMITS } from "@/lib/constants";
import { errorResponse } from "./api-response";
import { getClientIp } from "./api-response";

const log = createChildLogger("rate-limit");

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number; // seconds until window resets
}

/**
 * Sliding window rate limiter using Redis.
 */
async function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowMs;
  const redisKey = `rate-limit:${key}`;

  try {
    // Remove expired entries
    await redis.zremrangebyscore(redisKey, 0, windowStart);

    // Count current entries
    const count = await redis.zcard(redisKey);

    if (count >= max) {
      const oldestEntry = await redis.zrange(redisKey, 0, 0, "WITHSCORES");
      const reset = oldestEntry.length >= 2
        ? Math.ceil((parseFloat(oldestEntry[1]) + windowMs - now) / 1000)
        : Math.ceil(windowMs / 1000);

      return { allowed: false, remaining: 0, reset };
    }

    // Add new entry
    await redis.zadd(redisKey, now, `${now}`);
    await redis.pexpire(redisKey, windowMs);

    return {
      allowed: true,
      remaining: max - count - 1,
      reset: Math.ceil(windowMs / 1000),
    };
  } catch (err) {
    log.error({ key, err }, "Rate limit check error");
    // Fail open — don't block requests if Redis is down
    return { allowed: true, remaining: max, reset: 0 };
  }
}

/**
 * Rate limit middleware for login endpoint.
 */
export async function rateLimitLogin(request: Request) {
  const ip = getClientIp(request);
  const { max, windowMs } = RATE_LIMITS.login;
  const result = await checkRateLimit(`login:${ip}`, max, windowMs);

  if (!result.allowed) {
    return errorResponse(
      "RATE_LIMITED",
      `Too many login attempts. Please try again in ${result.reset} seconds.`,
      429
    );
  }
  return null;
}

/**
 * Rate limit middleware for registration endpoint.
 */
export async function rateLimitRegister(request: Request) {
  const ip = getClientIp(request);
  const { max, windowMs } = RATE_LIMITS.register;
  const result = await checkRateLimit(`register:${ip}`, max, windowMs);

  if (!result.allowed) {
    return errorResponse(
      "RATE_LIMITED",
      "Too many registration attempts. Please try again later.",
      429
    );
  }
  return null;
}

/**
 * General API rate limiter.
 */
export async function rateLimitApi(request: Request) {
  const ip = getClientIp(request);
  const { max, windowMs } = RATE_LIMITS.api;
  const result = await checkRateLimit(`api:${ip}`, max, windowMs);

  if (!result.allowed) {
    return errorResponse(
      "RATE_LIMITED",
      "Too many requests. Please slow down.",
      429
    );
  }
  return null;
}
