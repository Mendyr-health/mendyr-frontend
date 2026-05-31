import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/auth/google-oauth";
import { nanoid } from "nanoid";

export async function GET() {
  // Generate a state parameter for CSRF protection
  const state = nanoid(32);
  const authUrl = getGoogleAuthUrl(state);

  // Store state in a cookie for validation on callback
  const response = NextResponse.redirect(authUrl);
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  return response;
}
