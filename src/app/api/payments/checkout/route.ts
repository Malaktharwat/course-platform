import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ url: 'stripe-session-url' });
}