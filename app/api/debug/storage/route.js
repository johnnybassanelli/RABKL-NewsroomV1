// Debug endpoint to check storage synchronization status
import { NextResponse } from 'next/server';
import { getSharedArticles, getCacheStatus } from '../../../../lib/shared-storage.js';

export async function GET() {
  try {
    const articles = await getSharedArticles();
    const cacheStatus = getCacheStatus();
    
    return NextResponse.json({
      success: true,
      storage_info: {
        total_articles: articles.length,
        cache_status: cacheStatus,
        articles_preview: articles.slice(0, 3).map(a => ({
          id: a.id,
          title: a.title,
          timestamp: a.timestamp || a.date,
          category: a.category
        })),
        environment: {
          node_env: process.env.NODE_ENV,
          vercel_env: process.env.VERCEL_ENV,
          has_tmp_access: typeof require !== 'undefined' ? 'yes' : 'no'
        }
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
