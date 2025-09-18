// /api/articles endpoint for RABKL Newsroom (App Router)
import { NextResponse } from 'next/server';
import { getArticles, initializeSampleArticles } from '../../../lib/simple-storage.js';

export async function GET() {
  try {
    // Initialize sample articles if none exist
    initializeSampleArticles();
    
    // Get articles from storage
    const articles = getArticles();
    
    return NextResponse.json({
      success: true,
      articles: articles,
      count: articles.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Articles fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
