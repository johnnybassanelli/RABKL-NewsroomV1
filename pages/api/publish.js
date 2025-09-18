// /api/publish endpoint for RABKL Newsroom
import fs from 'fs';
import path from 'path';

// In-memory storage for articles (in production, use a database)
let articles = [];

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for publish secret
  const publishSecret = req.headers['x-publish-secret'];
  const expectedSecret = process.env.PUBLISH_SECRET || 'RABKLsecretkey_92h3jd83';
  
  if (publishSecret !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { files = [] } = req.body;
    
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
    
    return res.status(200).json({
      success: true,
      message: 'Content published successfully',
      articles_count: articles.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Publish error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

// Export articles for use in other pages
export { articles };

