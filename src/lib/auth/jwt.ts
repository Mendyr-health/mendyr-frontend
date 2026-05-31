import * as jose from "jose";
import { cookies } from "next/headers";
import { JWT_COOKIE_NAME, REFRESH_COOKIE_NAME } from "../constants";
import type { JwtPayload } from "@/types";
import {
  ACCESS_TOKEN_COOKIE_PATH,
  DEFAULT_DURATION_SECONDS,
  DURATION_MULTIPLIERS,
  DURATION_REGEX,
  JWT_ALGORITHM,
  JWT_EXPIRES_IN_DEFAULT,
  JWT_ISSUER,
  JWT_REFRESH_EXPIRES_IN_DEFAULT,
  JWT_SECRET_DEV,
  REFRESH_TOKEN_COOKIE_PATH,
} from "./constants";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || JWT_SECRET_DEV
);

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || JWT_EXPIRES_IN_DEFAULT;
const JWT_REFRESH_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || JWT_REFRESH_EXPIRES_IN_DEFAULT;

function parseDuration(duration: string): number {
  const match = duration.match(DURATION_REGEX);
  if (!match) return DEFAULT_DURATION_SECONDS;
  const [, num, unit] = match;
  return parseInt(num) * (DURATION_MULTIPLIERS[unit] || 60);
}

/**
 * Sign an access token (short-lived).
 */
export async function signAccessToken(
  payload: Omit<JwtPayload, "iat" | "exp">
): Promise<string> {
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .setIssuer(JWT_ISSUER)
    .sign(JWT_SECRET);
}

/**
 * Sign a refresh token (long-lived).
 */
export async function signRefreshToken(payload: {
  userId: string;
  tokenId: string;
}): Promise<string> {
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_REFRESH_EXPIRES_IN)
    .setIssuer(JWT_ISSUER)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT.
 */
export async function verifyToken<T = JwtPayload>(token: string): Promise<T> {
  const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
    issuer: JWT_ISSUER,
  });
  return payload as unknown as T;
}

/**
 * Set auth cookies (HttpOnly, Secure, SameSite).
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(JWT_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: ACCESS_TOKEN_COOKIE_PATH,
    maxAge: parseDuration(JWT_EXPIRES_IN),
  });

  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: REFRESH_TOKEN_COOKIE_PATH,
    maxAge: parseDuration(JWT_REFRESH_EXPIRES_IN),
  });
}

/**
 * Clear auth cookies on logout.
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(JWT_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: ACCESS_TOKEN_COOKIE_PATH,
    maxAge: 0,
  });

  cookieStore.set(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 0,
  });
}

/**
 * Get access token from cookies or Authorization header.
 */
export async function getAccessToken(request?: Request): Promise<string | null> {
  // Try Authorization header first
  if (request) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.slice(7);
    }
  }

  // Fall back to cookies
  try {
    const cookieStore = await cookies();
    return cookieStore.get(JWT_COOKIE_NAME)?.value ?? null;
  } catch {
    return null;
  }
}

/**
 * Get current user from JWT (for use in API routes).
 */
export async function getCurrentUser(request?: Request): Promise<JwtPayload | null> {
  const token = await getAccessToken(request);
  if (!token) return null;

  try {
    return await verifyToken<JwtPayload>(token);
  } catch {
    return null;
  }
}
