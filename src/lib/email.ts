import { Resend } from "resend";
import { createChildLogger } from "./logger";
import { APP_NAME } from "./constants";

const log = createChildLogger("email");

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");
const FROM = process.env.EMAIL_FROM || `${APP_NAME} <noreply@mendyr.app>`;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      log.error({ error, to: options.to }, "Email send failed");
      return false;
    }

    log.info({ to: options.to, subject: options.subject }, "Email sent");
    return true;
  } catch (err) {
    log.error({ err, to: options.to }, "Email send exception");
    return false;
  }
}

// ── Email Templates ──────────────────────────────

export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: `Welcome to ${APP_NAME}!`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h1 style="color: #0D9488; margin: 0 0 16px;">Welcome to ${APP_NAME} 🎉</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Hi ${name},<br><br>
            Thank you for joining ${APP_NAME}! We're building a platform to connect patients with verified nurses and caregivers for at-home healthcare services.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            We're currently in our pre-launch phase and will notify you as soon as services become available in your area.
          </p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background: linear-gradient(135deg, #0D9488, #059669); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Visit ${APP_NAME}
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">
            If you have any questions, reply to this email or reach out at support@mendyr.app.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendNurseApplicationEmail(to: string, name: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: `Application Received — ${APP_NAME}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h1 style="color: #0D9488; margin: 0 0 16px;">Application Received ✅</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Hi ${name},<br><br>
            Thank you for applying to join ${APP_NAME} as a nurse. We've received your application and documents.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Our team will review your profile and credentials. You'll receive an update within 3–5 business days.
          </p>
          <div style="background: #f0fdfa; border-left: 4px solid #0D9488; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
            <p style="color: #0D9488; font-weight: 600; margin: 0;">What's next?</p>
            <ul style="color: #475569; margin: 8px 0 0; padding-left: 20px;">
              <li>Our verification team reviews your documents</li>
              <li>You'll receive approval or a request for additional info</li>
              <li>Once approved, your profile will be activated</li>
            </ul>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendOTPEmail(to: string, otp: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: `Your ${APP_NAME} verification code: ${otp}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
          <h1 style="color: #0D9488; margin: 0 0 16px;">Verification Code</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Use the following code to verify your identity:
          </p>
          <div style="background: #f0fdfa; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #0D9488;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">
            This code expires in 5 minutes. Do not share it with anyone.
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendNurseStatusEmail(
  to: string,
  name: string,
  status: "APPROVED" | "REJECTED",
  reason?: string
): Promise<boolean> {
  const isApproved = status === "APPROVED";

  return sendEmail({
    to,
    subject: `Application ${isApproved ? "Approved" : "Update"} — ${APP_NAME}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
        <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h1 style="color: ${isApproved ? "#0D9488" : "#EF4444"}; margin: 0 0 16px;">
            ${isApproved ? "Congratulations! 🎉" : "Application Update"}
          </h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Hi ${name},<br><br>
            ${
              isApproved
                ? `Your application to join ${APP_NAME} has been approved! You can now log in and access your nurse dashboard.`
                : `Unfortunately, your application could not be approved at this time.${reason ? ` Reason: ${reason}` : ""}`
            }
          </p>
          ${
            isApproved
              ? `<div style="margin: 32px 0; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background: linear-gradient(135deg, #0D9488, #059669); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    Log In Now
                  </a>
                </div>`
              : `<p style="color: #475569; font-size: 16px; line-height: 1.6;">
                  You can update your application and resubmit. If you have questions, contact us at support@mendyr.app.
                </p>`
          }
        </div>
      </div>
    `,
  });
}

export async function sendAdminNotification(
  subject: string,
  message: string
): Promise<boolean> {
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@mendyr.app";
  return sendEmail({
    to: adminEmail,
    subject: `[Admin] ${subject}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e293b;">${subject}</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">${message}</p>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 24px;">— ${APP_NAME} System</p>
      </div>
    `,
  });
}

export { resend };
