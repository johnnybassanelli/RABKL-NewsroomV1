// Debug endpoint to check storage synchronization status
import { NextResponse } from 'next/server';
import { getEnhancedArticles, getEnhancedStorageStatus } from '../../../../lib/enhanced-storage.js';

export async function GET() {
  try {
    const articles = await getEnhancedArticles();
    const storageStatus = await getEnhancedStorageStatus();
    
    return NextResponse.json({
      success: true,
      storage_info: {
        total_articles: articles.length,
        storage_status: storageStatus,
        articles_preview: articles.slice(0, 3).map(a => ({
          id: a.id,
          title: a.title,
          timestamp: a.timestamp || a.date,
          category: a.category
        }))
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Storage debug error:', error);
    return NextResponse.json({ 
      error: 'Debug error', 
      details: error.message 
    }, { status: 500 });
  }
}
