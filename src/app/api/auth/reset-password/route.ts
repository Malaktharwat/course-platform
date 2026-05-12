import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  const user = await db.user.findUnique({
    where: { resetToken: token },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  const hashed = await hash(password, 12);

  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
    },
  });

  return NextResponse.json({ message: 'Password updated' });
}