import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guards";
import { apiHandler, successResponse } from "@/server/middleware/api-response";

// GET /api/v1/patients — list patients with pagination/search
export const GET = apiHandler(async (request: Request) => {
  await requireAuth(request);
  await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";

  const where: Record<string, unknown> = { role: "PATIENT" };

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const [patients, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        publicId: true,
        email: true,
        phone: true,
        fullName: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        patientProfile: {
          select: {
            city: true,
            state: true,
            registrationStatus: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return successResponse({
    patients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
