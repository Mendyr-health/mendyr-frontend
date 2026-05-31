import { getCurrentUser } from "./jwt";
import { ROLE_HIERARCHY } from "../constants";
import type { JwtPayload } from "@/types";

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string = "UNAUTHORIZED",
    public status: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Require authentication — throws if no valid JWT.
 */
export async function requireAuth(request?: Request): Promise<JwtPayload> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw new AuthError("Authentication required", "UNAUTHORIZED", 401);
  }
  return user;
}

/**
 * Require a specific role (or higher authority in hierarchy).
 */
export async function requireRole(
  request: Request,
  allowedRoles: string[]
): Promise<JwtPayload> {
  const user = await requireAuth(request);

  const userHierarchy = ROLE_HIERARCHY[user.role] ?? 99;
  const hasAccess = allowedRoles.some((role) => {
    const requiredHierarchy = ROLE_HIERARCHY[role] ?? 99;
    return userHierarchy <= requiredHierarchy;
  });

  if (!hasAccess) {
    throw new AuthError(
      "Insufficient role privileges",
      "FORBIDDEN",
      403
    );
  }

  return user;
}

/**
 * Require a specific permission.
 */
export async function requirePermission(
  request: Request,
  permission: string
): Promise<JwtPayload> {
  const user = await requireAuth(request);

  if (!user.permissions.includes(permission)) {
    // Super admins bypass permission checks
    if (user.role === "SUPER_ADMIN") return user;

    throw new AuthError(
      `Missing permission: ${permission}`,
      "FORBIDDEN",
      403
    );
  }

  return user;
}

/**
 * Require multiple permissions (all must be present).
 */
export async function requirePermissions(
  request: Request,
  permissions: string[]
): Promise<JwtPayload> {
  const user = await requireAuth(request);

  if (user.role === "SUPER_ADMIN") return user;

  const missing = permissions.filter((p) => !user.permissions.includes(p));
  if (missing.length > 0) {
    throw new AuthError(
      `Missing permissions: ${missing.join(", ")}`,
      "FORBIDDEN",
      403
    );
  }

  return user;
}
