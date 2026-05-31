import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guards";
import { apiHandler, successResponse, errorResponse } from "@/server/middleware/api-response";

// GET /api/v1/admin/settings — get all system settings
export const GET = apiHandler(async (request: Request) => {
  await requireAuth(request);
  await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);

  const settings = await prisma.systemSetting.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });

  // Group by category
  const grouped: Record<string, Record<string, unknown>> = {};
  for (const setting of settings) {
    if (!grouped[setting.group]) grouped[setting.group] = {};
    let value: unknown = setting.value;
    if (setting.type === "boolean") value = setting.value === "true";
    else if (setting.type === "number") value = Number(setting.value);
    grouped[setting.group][setting.key] = { value, description: setting.description, type: setting.type };
  }

  return successResponse(grouped);
});

// PATCH /api/v1/admin/settings — update settings
export const PATCH = apiHandler(async (request: Request) => {
  await requireAuth(request);
  await requireRole(request, ["SUPER_ADMIN"]);

  const body = await request.json();
  const updates = body.settings as Record<string, string>;

  if (!updates || typeof updates !== "object") {
    return errorResponse("INVALID_BODY", "settings object is required", 400);
  }

  const results: Record<string, string> = {};
  for (const [key, value] of Object.entries(updates)) {
    const existing = await prisma.systemSetting.findUnique({ where: { key } });
    if (!existing) continue;

    await prisma.systemSetting.update({
      where: { key },
      data: { value: String(value) },
    });
    results[key] = String(value);
  }

  return successResponse({ updated: results });
});
