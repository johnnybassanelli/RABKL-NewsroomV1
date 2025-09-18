import { NextResponse } from 'next/server';
import { generatePowerRankingsArticle } from '../../../../lib/power-rankings-generator.js';
import { addArticle } from '../../../../lib/simple-storage.js';

export async function GET(req) {
  try {
    // Generate the power rankings article
    const article = generatePowerRankingsArticle();
    
    // Add the article to storage
    const updatedArticles = addArticle(article);
    
    if (updatedArticles) {
      return NextResponse.json({
        success: true,
        message: 'Power Rankings article generated and published successfully',
        article_title: article.title,
        articles_count: updatedArticles.length,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to publish Power Rankings article',
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error generating power rankings:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
