import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guards";
import { apiHandler, successResponse } from "@/server/middleware/api-response";

// GET /api/v1/admin/audit-logs — list audit logs
export const GET = apiHandler(async (request: Request) => {
  await requireAuth(request);
  await requireRole(request, ["SUPER_ADMIN"]);

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "50"));
  const action = url.searchParams.get("action") || "";

  const where: Record<string, unknown> = {};
  if (action) where.action = action;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { publicId: true, email: true, fullName: true },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return successResponse({
    logs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});
