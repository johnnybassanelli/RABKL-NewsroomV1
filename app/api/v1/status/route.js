// Status endpoint for RABKL Newsroom (App Router)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'running',
    message: 'RABKL Newsroom Agent is running!',
    articles_count: 0, // Will be updated when articles are published
    endpoints: {
      newsroom_loop: '/api/v1/newsroom-loop',
      status: '/api/v1/status',
      publish: '/api/publish',
      weekly_power_rankings: '/api/v1/weekly-power-rankings'
    }
  });
}

export async function POST() {
  return GET(); // Same response for POST
}

