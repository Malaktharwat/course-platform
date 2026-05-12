import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { verifyToken: token } });

  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verifyToken: null,
    },
  });

  return NextResponse.redirect(new URL('/login?verified=true', req.url));
}