import { apiHandler, successResponse } from "@/server/middleware/api-response";

export const GET = apiHandler(async () => {
  const checks: Record<string, string> = { status: "ok" };

  // Check DB
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "connected";
  } catch {
    checks.database = "disconnected";
  }

  // Check Redis
  try {
    const { redis } = await import("@/lib/redis");
    await redis.ping();
    checks.redis = "connected";
  } catch {
    checks.redis = "disconnected";
  }

  const allHealthy = Object.values(checks).every(
    (v) => v === "ok" || v === "connected"
  );
  checks.status = allHealthy ? "healthy" : "degraded";

  return successResponse(checks, allHealthy ? 200 : 503);
});
