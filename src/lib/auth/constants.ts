/**
 * JWT-related constants for authentication.
 */
export const JWT_SECRET_DEV =
  "change-this-to-a-64-char-random-hex-string-in-production-please";
export const JWT_ALGORITHM = "HS256";
export const JWT_ISSUER = "mendyr";

/**
 * Default expiration times for JWTs.
 * Can be overridden by environment variables.
 */
export const JWT_EXPIRES_IN_DEFAULT = "15m"; // 15 minutes
export const JWT_REFRESH_EXPIRES_IN_DEFAULT = "30d"; // 30 days

/**
 * Cookie paths for authentication tokens.
 */
export const ACCESS_TOKEN_COOKIE_PATH = "/";
export const REFRESH_TOKEN_COOKIE_PATH = "/api/auth/refresh";

/**
 * Regular expression for parsing duration strings (e.g., "15m", "30d").
 */
export const DURATION_REGEX = /^(\d+)([smhd])$/;

/**
 * Default duration in seconds (15 minutes) if parsing fails.
 */
export const DEFAULT_DURATION_SECONDS = 900;

/**
 * Time multipliers for converting duration units to seconds.
 */
export const DURATION_MULTIPLIERS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
};
