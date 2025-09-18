// /api/publish endpoint for RABKL Newsroom (App Router)
import { NextResponse } from 'next/server';

// In-memory storage for articles (in production, use a database)
let articles = [];

export async function POST(request) {
  try {
    // Check for publish secret
    const publishSecret = request.headers.get('x-publish-secret');
    const expectedSecret = process.env.PUBLISH_SECRET || 'RABKLsecretkey_92h3jd83';
    
    if (publishSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { files = [] } = body;
    
    // Process files and extract article metadata
    for (const file of files) {
      const { path: filePath, content } = file;
      
      // If this is a JSON metadata file
      if (filePath?.endsWith('.json') && filePath.includes('content/')) {
        try {
          const articleData = JSON.parse(content);
          
          // Add to articles list
          articles.push(articleData);
          
          console.log(`Added article: ${articleData.title || 'Unknown'}`);
          
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          continue;
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Content published successfully',
      articles_count: articles.length,
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

// Export articles for use in other components
export { articles };