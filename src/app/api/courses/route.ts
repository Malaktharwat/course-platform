import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const courses = await db.course.findMany();
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const course = await db.course.create({
    data: body,
  });

  return NextResponse.json(course);
}