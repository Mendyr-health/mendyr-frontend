import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { apiHandler, successResponse, errorResponse } from "@/server/middleware/api-response";
import { createAdminSchema } from "@/lib/validators";

// GET /api/v1/admin/admins — list admins
export const GET = apiHandler(async (request: Request) => {
  await requireAuth(request);
  await requireRole(request, ["SUPER_ADMIN"]);

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(url.searchParams.get("limit") || "20"));

  const where = { role: { in: ["ADMIN" as const, "SUPER_ADMIN" as const] } };

  const [admins, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        publicId: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return successResponse({ admins, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

// POST /api/v1/admin/admins — create an admin
export const POST = apiHandler(async (request: Request) => {
  await requireAuth(request);
  await requireRole(request, ["SUPER_ADMIN"]);

  const body = createAdminSchema.parse(await request.json());

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return errorResponse("EMAIL_EXISTS", "Email already in use", 409);
  }

  const passwordHash = await hashPassword(body.password);

  const admin = await prisma.user.create({
    data: {
      email: body.email,
      fullName: body.fullName,
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
    },
    select: {
      publicId: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  // Assign admin role
  const adminRole = await prisma.role.findUnique({ where: { slug: "admin" } });
  if (adminRole) {
    await prisma.userRoleAssignment.create({
      data: { userId: admin.publicId, roleId: adminRole.id },
    });
  }

  return successResponse(admin, 201);
});
