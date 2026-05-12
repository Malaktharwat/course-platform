import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'LearnHub';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const FROM = process.env.EMAIL_FROM || 'noreply@learnhub.com';

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Verify your email — ${APP_NAME}`,
    html: `<div>Verify: <a href="${verifyUrl}">Click here</a></div>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Reset password — ${APP_NAME}`,
    html: `<div>Reset: <a href="${resetUrl}">Click here</a></div>`,
  });
}