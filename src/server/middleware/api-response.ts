import { NextResponse } from "next/server";
import type { ApiResponse, PaginationMeta } from "@/types";
import { ZodError, type ZodSchema } from "zod";
import { AuthError } from "@/lib/auth/guards";
import { createChildLogger } from "@/lib/logger";

const log = createChildLogger("api");

/**
 * Success response.
 */
export function successResponse<T>(
  data: T,
  status = 200,
  meta?: PaginationMeta
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data, meta: meta ?? null, error: null },
    { status }
  );
}

/**
 * Error response.
 */
export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { success: false, data: null, meta: null, error: { code, message, details } },
    { status }
  );
}

/**
 * Paginated response. Accepts either positional args or an options object.
 */
export function paginatedResponse<T>(
  data: T[],
  opts: { page: number; limit: number; total: number }
): NextResponse<ApiResponse<T[]>> {
  return successResponse(data, 200, {
    page: opts.page,
    limit: opts.limit,
    total: opts.total,
    totalPages: Math.ceil(opts.total / opts.limit),
  });
}

/**
 * Parse and validate request body against a Zod schema.
 */
export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<T> {
  const body = await request.json();
  return schema.parse(body);
}

/**
 * Wrap an API route handler with error handling.
 */
export function apiHandler(
  handler: (request: Request, context?: { params: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
  return async (request: Request, context?: { params: Promise<Record<string, string>> }) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return errorResponse("VALIDATION_ERROR", "Validation failed", 400, details);
      }

      if (error instanceof AuthError) {
        return errorResponse(error.code, error.message, error.status);
      }

      log.error({ error }, "Unhandled API error");

      return errorResponse(
        "INTERNAL_ERROR",
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : "An unexpected error occurred",
        500
      );
    }
  };
}

/**
 * Get client IP from request headers.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Get user agent from request headers.
 */
export function getUserAgent(request: Request): string {
  return request.headers.get("user-agent") || "unknown";
}

// ── Convenience aliases used throughout the app ──
export const apiResponse = successResponse;
export const apiError = (message: string, code: string, status: number) =>
  errorResponse(code, message, status);
