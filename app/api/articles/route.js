// /api/articles endpoint for RABKL Newsroom (App Router)
import { NextResponse } from 'next/server';

// Import the articles array from the publish endpoint
// Note: In production, this would be a database query
let articles = [];

// This is a workaround to share articles between endpoints
// In production, you'd use a proper database
global.rabklArticles = global.rabklArticles || [];

export async function GET() {
  try {
    // Return the published articles
    const sortedArticles = global.rabklArticles.sort((a, b) => 
      new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
    );
    
    return NextResponse.json({
      success: true,
      articles: sortedArticles,
      count: sortedArticles.length,
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

// Export articles for use in other components
export { articles };
