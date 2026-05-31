import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = basePrisma;

// ── Soft-Delete Extension ──────────────────────────────────
// Auto-filters `deletedAt IS NULL` on findMany/findFirst/findUnique
// and converts delete → soft-delete for models with deletedAt

const SOFT_DELETE_MODELS = ["User", "NurseProfile", "PatientProfile", "Service"];

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async findMany({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
      async findFirst({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
      async findUnique({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          // findUnique doesn't support arbitrary where, so we pass through
          // and do post-check
          const result = await query(args);
          if (
            result &&
            "deletedAt" in result &&
            (result as Record<string, unknown>).deletedAt !== null
          ) {
            return null;
          }
          return result;
        }
        return query(args);
      },
      async delete({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          // Convert delete → soft-delete
          return (basePrisma[model as keyof typeof basePrisma] as any).update({
            where: args.where,
            data: { deletedAt: new Date() },
          });
        }
        return query(args);
      },
      async deleteMany({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          return (basePrisma[model as keyof typeof basePrisma] as any).updateMany({
            where: args.where,
            data: { deletedAt: new Date() },
          });
        }
        return query(args);
      },
      async count({ model, args, query }) {
        if (SOFT_DELETE_MODELS.includes(model)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
    },
  },
});

export type ExtendedPrismaClient = typeof prisma;
