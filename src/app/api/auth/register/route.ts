import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password } = result.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User exists' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 12);
    const verifyToken = generateToken();

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verifyToken,
      },
    });

    await sendVerificationEmail(email, verifyToken);

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}