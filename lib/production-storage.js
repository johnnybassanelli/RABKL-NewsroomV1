// Production storage for RABKL articles using Vercel Blob and Upstash Redis
// This provides reliable persistence across serverless function executions

import { put, list, head } from '@vercel/blob';
import { Redis } from '@upstash/redis';

// Initialize Redis client (will use environment variables)
let redis = null;
try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} catch (error) {
  console.log('Redis not available:', error.message);
}

// Storage configuration
const BLOB_PREFIX = 'rabkl-articles';
const REDIS_KEY = 'rabkl:articles';
const CACHE_TTL = 300; // 5 minutes

// Sample articles for initialization
const SAMPLE_ARTICLES = [
  {
    "title": "RABKL Trade Alert: Major Roster Shakeup in Week 3",
    "content": "The RABKL trade market exploded this week with a significant multi-player deal that has fantasy managers buzzing. In a move that could reshape the playoff picture, two teams executed a strategic trade that addresses key roster needs on both sides.\n\n**Trade Details:**\nThe transaction involves multiple players and draft considerations, with both teams looking to optimize their lineups for the remainder of the season. This trade demonstrates the active and competitive nature of the RABKL, where managers are constantly seeking ways to improve their championship odds.\n\n**Impact Analysis:**\nFantasy experts are already weighing in on the potential impact of this trade. The move addresses depth concerns for one team while providing immediate starter-level talent for the other. Both managers appear to have identified value in players that fit their specific team construction and strategy.\n\n**League Reaction:**\nOther RABKL managers have taken notice of this trade, with several expressing interest in making their own moves before the trade deadline. The active trade market is a hallmark of competitive keeper leagues, where long-term planning meets short-term opportunity.\n\nThis trade serves as a reminder that in the RABKL, every week brings new opportunities for teams to improve their rosters and chase championship glory.",
    "author": "RABKL Newsroom",
    "timestamp": "2025-09-18T17:25:00Z",
    "category": "trade",
    "tags": ["trade", "roster", "strategy", "week3"],
    "id": "trade_alert_week3_2025",
    "published": true
  },
  {
    "title": "Breaking: RABKL Managers Execute Strategic Player Swap",
    "content": "In a calculated move that showcases the strategic depth of RABKL management, two teams have completed a player exchange that addresses specific roster construction needs. This trade highlights the sophisticated approach that RABKL managers take when evaluating talent and team building.\n\n**Strategic Considerations:**\nThe trade appears to be driven by positional needs and long-term planning rather than immediate impact. Both teams have demonstrated their commitment to building sustainable competitive rosters that can contend not just this season, but in future campaigns as well.\n\n**Player Evaluation:**\nRABKL managers are known for their thorough player evaluation process, and this trade reflects that attention to detail. The exchanged players bring different skill sets and upside potential, allowing each team to better align their roster with their strategic vision.\n\n**Market Implications:**\nThis transaction could signal the beginning of increased trade activity as we approach the midseason mark. Other managers are likely evaluating their own rosters and considering whether similar strategic moves could benefit their championship aspirations.\n\n**Looking Ahead:**\nWith this trade completed, both teams now have the flexibility to pursue additional moves or focus on optimizing their current lineups. The RABKL trade market remains active, with several other managers reportedly exploring potential deals.",
    "author": "RABKL Newsroom",
    "timestamp": "2025-09-18T17:26:00Z",
    "category": "trade",
    "tags": ["trade", "strategy", "management", "analysis"],
    "id": "strategic_player_swap_2025",
    "published": true
  },
  {
    "title": "RABKL Trade Wire: Teams Address Depth and Upside",
    "content": "The RABKL continues to showcase why it's considered one of the most competitive keeper leagues, with another strategic trade that demonstrates the sophisticated approach managers take to roster construction. This latest deal focuses on addressing depth concerns while maintaining long-term upside potential.\n\n**Trade Philosophy:**\nThis transaction exemplifies the RABKL philosophy of balancing immediate needs with future considerations. Both teams have identified opportunities to improve their roster construction while maintaining flexibility for future moves.\n\n**Competitive Balance:**\nThe active trade market in the RABKL ensures that competitive balance is maintained throughout the season. Teams that fall behind early have opportunities to retool, while contending teams can address specific weaknesses to strengthen their championship push.\n\n**Manager Expertise:**\nThe level of analysis and strategic thinking that goes into RABKL trades is evident in this latest transaction. Both managers have clearly identified value and opportunity that aligns with their team's specific needs and long-term goals.\n\n**League Dynamics:**\nThis trade adds another layer to the complex web of team relationships and strategic positioning within the RABKL. As teams continue to evolve their rosters, the competitive landscape becomes increasingly dynamic and unpredictable.\n\nThe RABKL trade market remains one of the most active and sophisticated in fantasy basketball, with managers consistently finding creative ways to improve their teams and pursue championship glory.",
    "author": "RABKL Newsroom",
    "timestamp": "2025-09-18T17:27:00Z",
    "category": "trade",
    "tags": ["trade", "depth", "upside", "competition"],
    "id": "trade_wire_depth_upside_2025",
    "published": true
  }
];

// Load articles from Vercel Blob
async function loadFromBlob() {
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX });
    
    if (blobs.length === 0) {
      console.log('No articles found in Vercel Blob');
      return [];
    }
    
    // Get the latest articles blob
    const latestBlob = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
    
    const response = await fetch(latestBlob.url);
    const articles = await response.json();
    
    console.log(`Loaded ${articles.length} articles from Vercel Blob`);
    return articles;
  } catch (error) {
    console.error('Error loading from Vercel Blob:', error);
    return [];
  }
}

// Save articles to Vercel Blob
async function saveToBlob(articles) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${BLOB_PREFIX}-${timestamp}.json`;
    
    const blob = await put(filename, JSON.stringify(articles), {
      access: 'public',
      contentType: 'application/json',
    });
    
    console.log(`Saved ${articles.length} articles to Vercel Blob: ${blob.url}`);
    return true;
  } catch (error) {
    console.error('Error saving to Vercel Blob:', error);
    return false;
  }
}

// Load articles from Redis cache
async function loadFromRedis() {
  if (!redis) return null;
  
  try {
    const cached = await redis.get(REDIS_KEY);
    if (cached) {
      console.log(`Loaded ${cached.length} articles from Redis cache`);
      return cached;
    }
  } catch (error) {
    console.error('Error loading from Redis:', error);
  }
  
  return null;
}

// Save articles to Redis cache
async function saveToRedis(articles) {
  if (!redis) return false;
  
  try {
    await redis.setex(REDIS_KEY, CACHE_TTL, articles);
    console.log(`Cached ${articles.length} articles in Redis`);
    return true;
  } catch (error) {
    console.error('Error saving to Redis:', error);
    return false;
  }
}

// Get all articles with multi-tier loading
export async function getProductionArticles() {
  try {
    // Try Redis cache first (fastest)
    let articles = await loadFromRedis();
    
    if (articles && articles.length > 0) {
      return articles.sort((a, b) => 
        new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
      );
    }
    
    // Fall back to Vercel Blob (persistent)
    articles = await loadFromBlob();
    
    if (articles.length === 0) {
      // Initialize with sample articles
      articles = [...SAMPLE_ARTICLES];
      await saveToBlob(articles);
      console.log('Initialized with sample articles');
    }
    
    // Cache in Redis for next time
    await saveToRedis(articles);
    
    return articles.sort((a, b) => 
      new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
    );
    
  } catch (error) {
    console.error('Error getting production articles:', error);
    // Ultimate fallback to sample articles
    return [...SAMPLE_ARTICLES];
  }
}

// Add article with multi-tier persistence
export async function addProductionArticle(article) {
  try {
    // Get current articles
    const articles = await getProductionArticles();
    
    // Check if article already exists
    const existingIndex = articles.findIndex(a => 
      a.id === article.id || a.title === article.title
    );
    
    if (existingIndex >= 0) {
      // Update existing article
      articles[existingIndex] = { ...articles[existingIndex], ...article };
    } else {
      // Add new article
      articles.push(article);
    }
    
    // Save to both Blob and Redis
    const blobSaved = await saveToBlob(articles);
    const redisSaved = await saveToRedis(articles);
    
    console.log(`Article added: ${article.title}. Total: ${articles.length}`);
    console.log(`Blob saved: ${blobSaved}, Redis saved: ${redisSaved}`);
    
    return articles;
  } catch (error) {
    console.error('Error adding production article:', error);
    return null;
  }
}

// Get article count
export async function getProductionArticleCount() {
  const articles = await getProductionArticles();
  return articles.length;
}

// Clear all articles (for testing)
export async function clearProductionArticles() {
  try {
    const emptyArticles = [];
    await saveToBlob(emptyArticles);
    await saveToRedis(emptyArticles);
    return true;
  } catch (error) {
    console.error('Error clearing production articles:', error);
    return false;
  }
}

// Get storage status for debugging
export async function getProductionStorageStatus() {
  const hasRedis = !!redis;
  let redisStatus = 'Not configured';
  let blobStatus = 'Unknown';
  
  if (hasRedis) {
    try {
      await redis.ping();
      redisStatus = 'Connected';
    } catch (error) {
      redisStatus = `Error: ${error.message}`;
    }
  }
  
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX, limit: 1 });
    blobStatus = `Available (${blobs.length} blobs)`;
  } catch (error) {
    blobStatus = `Error: ${error.message}`;
  }
  
  return {
    redis: redisStatus,
    blob: blobStatus,
    environment: process.env.NODE_ENV || 'development'
  };
}
