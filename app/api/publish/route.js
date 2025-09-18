// /api/publish endpoint for RABKL Newsroom (App Router)
import { NextResponse } from 'next/server';
import { addArticle, getArticleCount, initializeSampleArticles } from '../../../lib/simple-storage.js';

export async function POST(request) {
  try {
    // Initialize sample articles if none exist
    initializeSampleArticles();
    
    // Check for publish secret
    const publishSecret = request.headers.get('x-publish-secret');
    const expectedSecret = process.env.PUBLISH_SECRET || 'RABKLsecretkey_92h3jd83';
    
    // Debug logging (remove in production)
    console.log('Received secret:', publishSecret ? 'PROVIDED' : 'MISSING');
    console.log('Expected secret:', expectedSecret ? 'SET' : 'NOT_SET');
    
    // Allow multiple valid secrets for flexibility
    const validSecrets = [
      'RABKLsecretkey_92h3jd83',
      process.env.PUBLISH_SECRET,
      process.env.VERCEL_SECRET,
      'rabkl-secret-2025'
    ].filter(Boolean);
    
    if (!publishSecret || !validSecrets.includes(publishSecret)) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        debug: process.env.NODE_ENV === 'development' ? {
          received: publishSecret ? 'SECRET_PROVIDED' : 'NO_SECRET',
          validCount: validSecrets.length
        } : undefined
      }, { status: 401 });
    }

    const body = await request.json();
    const { files = [] } = body;
    
    let publishedCount = 0;
    
    // Process files and extract article metadata
    for (const file of files) {
      const { path: filePath, content } = file;
      
      // If this is a JSON metadata file
      if (filePath?.endsWith('.json') && filePath.includes('content/')) {
        try {
          const articleData = JSON.parse(content);
          
          // Add to persistent storage
          const updatedArticles = addArticle(articleData);
          
          if (updatedArticles) {
            publishedCount++;
            console.log(`Added article: ${articleData.title || 'Unknown'}`);
          } else {
            console.error(`Failed to add article: ${articleData.title || 'Unknown'}`);
          }
          
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          continue;
        }
      }
    }
    
    const totalCount = getArticleCount();
    
    return NextResponse.json({
      success: true,
      message: 'Content published successfully',
      articles_count: totalCount,
      published_this_request: publishedCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ 
    error: 'Method not allowed. Use POST to publish content.' 
  }, { status: 405 });
}
