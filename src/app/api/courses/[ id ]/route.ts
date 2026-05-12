import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const course = await db.course.findUnique({
    where: { id: params.id },
  });

  return NextResponse.json(course);
}