import { verifyOTP } from "@/lib/auth/otp";
import { verifyOtpSchema } from "@/lib/validators";
import { apiHandler, parseBody, successResponse, errorResponse } from "@/server/middleware/api-response";

export const POST = apiHandler(async (request: Request) => {
  const body = await parseBody(request, verifyOtpSchema);

  const verificationToken = await verifyOTP(body.email, body.otp);

  if (!verificationToken) {
    return errorResponse("INVALID_OTP", "Invalid or expired OTP", 400);
  }

  return successResponse({
    message: "OTP verified successfully",
    token: verificationToken,
  });
});
