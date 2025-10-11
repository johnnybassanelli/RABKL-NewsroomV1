// /api/articles endpoint for RABKL Newsroom (App Router)
import { NextResponse } from 'next/server';
import { getEnhancedArticles, initializeEnhancedStorage } from '../../../lib/enhanced-storage.js';
import { generateEnhancedDetailedPowerRankingsArticle } from '../../../lib/enhanced-detailed-power-rankings-generator.js';

export async function GET() {
  try {
    // Initialize sample articles if none exist
    await initializeEnhancedStorage();
    
    // Get articles from storage
    let articles = await getEnhancedArticles();

    // Generate the latest enhanced detailed preseason power rankings article with Week 1 data
    const powerRankingsArticle = await generateEnhancedDetailedPowerRankingsArticle();

    // Remove any existing power rankings article to prevent duplicates
    articles = articles.filter(a => a.category !== 'power-rankings');

    // Add the new power rankings article
    articles.push(powerRankingsArticle);
    
    // Sort articles by timestamp, newest first
    articles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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

