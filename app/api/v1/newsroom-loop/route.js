// Newsroom loop endpoint (App Router)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    generated_articles: 0,
    published_articles: 0,
    status: 'success',
    message: 'No new articles to publish or publisher not available.'
  });
}

export async function POST() {
  return GET(); // Same response for POST
}

