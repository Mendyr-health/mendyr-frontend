import { NextRequest, NextResponse } from "next/server";
import { apiResponse, apiError } from "@/server/middleware/api-response";

export async function POST(request: NextRequest) {
  const response = apiResponse({ message: "Logged out successfully" });
  response.cookies.delete("mendyr_access_token");
  response.cookies.delete("mendyr_refresh_token");
  return response;
}
