import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError, paginatedResponse } from "@/server/middleware/api-response";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/constants";

/**
 * Unified search API with server-side filtering, sorting, and pagination.
 * 
 * GET /api/v1/search?entity=nurses&q=john&status=PENDING&sortBy=createdAt&sortOrder=desc&page=1&limit=20
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get("entity");
    const q = searchParams.get("q") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE));
    const skip = (page - 1) * limit;

    if (!entity) {
      return apiError("Entity parameter is required", "VALIDATION_ERROR", 400);
    }

    let data: unknown[] = [];
    let total = 0;

    switch (entity) {
      case "nurses": {
        const status = searchParams.get("status");
        const where: any = {};
        if (q) {
          where.user = {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
            ],
          };
        }
        if (status) where.verificationStatus = status;

        [data, total] = await Promise.all([
          prisma.nurseProfile.findMany({
            where,
            include: { user: { select: { publicId: true, email: true, fullName: true, phone: true, status: true, createdAt: true } } },
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit,
          }),
          prisma.nurseProfile.count({ where }),
        ]);
        break;
      }

      case "patients": {
        const registrationStatus = searchParams.get("registrationStatus");
        const where: any = {};
        if (q) {
          where.user = {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
            ],
          };
        }
        if (registrationStatus) where.registrationStatus = registrationStatus;

        [data, total] = await Promise.all([
          prisma.patientProfile.findMany({
            where,
            include: { user: { select: { publicId: true, email: true, fullName: true, phone: true, status: true, createdAt: true } } },
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit,
          }),
          prisma.patientProfile.count({ where }),
        ]);
        break;
      }

      case "waitlist": {
        const notified = searchParams.get("notified");
        const where: any = {};
        if (q) {
          where.OR = [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
          ];
        }
        if (notified !== null && notified !== undefined && notified !== "") {
          where.notified = notified === "true";
        }

        [data, total] = await Promise.all([
          prisma.waitlist.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit,
          }),
          prisma.waitlist.count({ where }),
        ]);
        break;
      }

      case "contacts": {
        const status = searchParams.get("status");
        const where: any = {};
        if (q) {
          where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { subject: { contains: q, mode: "insensitive" } },
          ];
        }
        if (status) where.status = status;

        [data, total] = await Promise.all([
          prisma.contactInquiry.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit,
          }),
          prisma.contactInquiry.count({ where }),
        ]);
        break;
      }

      case "services": {
        const isActive = searchParams.get("isActive");
        const where: any = {};
        if (q) {
          where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ];
        }
        if (isActive !== null && isActive !== undefined && isActive !== "") {
          where.isActive = isActive === "true";
        }

        [data, total] = await Promise.all([
          prisma.service.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit,
          }),
          prisma.service.count({ where }),
        ]);
        break;
      }

      default:
        return apiError(`Unknown entity: ${entity}`, "VALIDATION_ERROR", 400);
    }

    return paginatedResponse(data, { page, limit, total });
  } catch (error) {
    console.error("Search error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
