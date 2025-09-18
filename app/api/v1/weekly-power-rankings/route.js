// Weekly power rankings endpoint (App Router)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    article: 'RABKL Weekly Power Rankings - Week 3',
    result: false,
    status: 'success'
  });
}

export async function POST() {
  return GET(); // Same response for POST
}