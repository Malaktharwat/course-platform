import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const user = await db.user.findUnique({ where: { email } });

  if (user) {
    const token = generateToken();
    await db.user.update({
      where: { id: user.id },
      data: { resetToken: token },
    });

    await sendPasswordResetEmail(email, token);
  }

  return NextResponse.json({ message: 'If email exists, link sent' });
}