import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/server/middleware/api-response";

export async function GET(request: NextRequest) {
  try {
    const [
      totalPatients,
      totalNurses,
      totalAdmins,
      pendingVerifications,
      waitlistCount,
      newContacts,
    ] = await Promise.all([
      prisma.patientProfile.count(),
      prisma.nurseProfile.count(),
      prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
      prisma.nurseProfile.count({ where: { verificationStatus: "PENDING" } }),
      prisma.waitlist.count(),
      prisma.contactInquiry.count({ where: { status: "NEW" } }),
    ]);

    return apiResponse({
      totalPatients,
      totalNurses,
      totalAdmins,
      pendingVerifications,
      waitlistCount,
      newContacts,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
