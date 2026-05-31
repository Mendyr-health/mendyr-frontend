import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guards";
import { apiHandler, successResponse, errorResponse } from "@/server/middleware/api-response";

// GET /api/v1/nurses — list nurses with pagination/search
export const GET = apiHandler(async (request: Request) => {
  await requireAuth(request);
  await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);

  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const search = url.searchParams.get("search") || "";
  const verificationStatus = url.searchParams.get("verificationStatus") || "";

  const where: Record<string, unknown> = { role: "NURSE" };

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ];
  }

  if (verificationStatus) {
    where.nurseProfile = { verificationStatus };
  }

  const [nurses, total] = await Promise.all([
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
        nurseProfile: {
          select: {
            gender: true,
            city: true,
            state: true,
            experience: true,
            qualifications: true,
            verificationStatus: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return successResponse({
    nurses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// PATCH /api/v1/nurses — verify (approve/reject) a nurse
export const PATCH = apiHandler(async (request: Request) => {
  await requireAuth(request);
  await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);

  const body = await request.json();
  const { nursePublicId, action, reason } = body;

  if (!nursePublicId || !["approve", "reject"].includes(action)) {
    return errorResponse("INVALID_REQUEST", "nursePublicId and action (approve|reject) are required", 400);
  }

  const nurse = await prisma.user.findFirst({
    where: { publicId: nursePublicId, role: "NURSE" },
    include: { nurseProfile: true },
  });

  if (!nurse || !nurse.nurseProfile) {
    return errorResponse("NOT_FOUND", "Nurse not found", 404);
  }

  if (action === "approve") {
    await prisma.$transaction([
      prisma.nurseProfile.update({
        where: { userId: nurse.id },
        data: {
          verificationStatus: "APPROVED",
          verifiedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: nurse.id },
        data: { status: "ACTIVE" },
      }),
    ]);
  } else {
    await prisma.$transaction([
      prisma.nurseProfile.update({
        where: { userId: nurse.id },
        data: {
          verificationStatus: "REJECTED",
          rejectionReason: reason || "Application did not meet requirements",
        },
      }),
      prisma.user.update({
        where: { id: nurse.id },
        data: { status: "SUSPENDED" },
      }),
    ]);
  }

  return successResponse({ message: `Nurse ${action}d successfully` });
});
