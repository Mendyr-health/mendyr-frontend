import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guards";
import { apiHandler, successResponse, errorResponse } from "@/server/middleware/api-response";
import { createServiceSchema } from "@/lib/validators";

// GET /api/v1/services — list services (public)
export const GET = apiHandler(async () => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDesc: true,
      description: true,
      icon: true,
      features: true,
      pricingRange: true,
      sortOrder: true,
      isActive: true,
      seoTitle: true,
      seoDescription: true,
    },
  });

  return successResponse(services);
});

// POST /api/v1/services — create service (admin only)
export const POST = apiHandler(async (request: Request) => {
  await requireAuth(request);
  await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);

  const raw = await request.json();
  const body = createServiceSchema.parse(raw);

  const existing = await prisma.service.findUnique({ where: { slug: body.slug } });
  if (existing) {
    return errorResponse("SLUG_EXISTS", "A service with this slug already exists", 409);
  }

  const lastService = await prisma.service.findFirst({ orderBy: { sortOrder: "desc" } });
  const sortOrder = (lastService?.sortOrder ?? -1) + 1;

  const service = await prisma.service.create({
    data: {
      ...body,
      sortOrder,
      isActive: true,
      seoTitle: `${body.name} — Mendyr Home Healthcare`,
      seoDescription: body.shortDesc,
    },
  });

  return successResponse(service, 201);
});
