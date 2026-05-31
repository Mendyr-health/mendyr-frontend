import { redis } from "../redis";
import { nanoid } from "nanoid";

const OTP_PREFIX = "otp:";
const OTP_RATE_PREFIX = "otp-rate:";
const OTP_EXPIRY = Number(process.env.OTP_EXPIRY_SECONDS) || 300; // 5 min
const OTP_MAX_PER_HOUR = 3;

/**
 * Generate a 6-digit OTP and store in Redis with TTL.
 */
export async function generateOTP(email: string): Promise<string> {
  // Rate limit: max 3 OTPs per email per hour
  const rateKey = `${OTP_RATE_PREFIX}${email}`;
  const attempts = await redis.incr(rateKey);
  if (attempts === 1) {
    await redis.expire(rateKey, 3600); // 1 hour window
  }
  if (attempts > OTP_MAX_PER_HOUR) {
    throw new Error("Too many OTP requests. Please try again later.");
  }

  // Generate 6-digit code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const verificationId = nanoid(32);

  const key = `${OTP_PREFIX}${email}`;
  await redis.set(
    key,
    JSON.stringify({ otp, verificationId, attempts: 0 }),
    "EX",
    OTP_EXPIRY
  );

  return otp;
}

/**
 * Verify an OTP code. Returns a verification token on success.
 */
export async function verifyOTP(
  email: string,
  code: string
): Promise<string | null> {
  const key = `${OTP_PREFIX}${email}`;
  const raw = await redis.get(key);
  if (!raw) return null;

  const data = JSON.parse(raw) as {
    otp: string;
    verificationId: string;
    attempts: number;
  };

  // Max 5 verification attempts
  if (data.attempts >= 5) {
    await redis.del(key);
    return null;
  }

  if (data.otp !== code) {
    data.attempts++;
    await redis.set(key, JSON.stringify(data), "KEEPTTL");
    return null;
  }

  // OTP verified — delete it and return verification token
  await redis.del(key);

  // Store verification token for password reset (valid 15 min)
  const verifyKey = `otp-verified:${data.verificationId}`;
  await redis.set(verifyKey, email, "EX", 900);

  return data.verificationId;
}

/**
 * Check if a verification token is valid (for password reset).
 */
export async function checkVerificationToken(
  token: string
): Promise<string | null> {
  const key = `otp-verified:${token}`;
  const email = await redis.get(key);
  if (email) {
    await redis.del(key); // Single use
  }
  return email;
}
