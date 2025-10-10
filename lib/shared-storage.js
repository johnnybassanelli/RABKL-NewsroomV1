// Shared storage utility for RABKL articles
// This provides a unified interface for article storage across all endpoints

import { getArticles as getPersistentArticles, addArticle as addPersistentArticle, getArticleCount as getPersistentCount, initializeSampleArticlesIfNeeded } from './persistent-storage.js';

// Global storage state to ensure consistency within the same execution context
let globalArticlesCache = null;
let lastLoadTime = 0;
const CACHE_DURATION = 30000; // 30 seconds cache

// Get articles with smart caching
export async function getSharedArticles() {
  const now = Date.now();
  
  // Use cache if it's fresh and exists
  if (globalArticlesCache && (now - lastLoadTime) < CACHE_DURATION) {
    return globalArticlesCache;
  }
  
  // Load fresh articles from persistent storage
  const articles = await getPersistentArticles();
  
  // Update global cache
  globalArticlesCache = articles;
  lastLoadTime = now;
  
  return articles;
}

// Add article with cache invalidation
export async function addSharedArticle(article) {
  try {
    // Add to persistent storage
    const result = await addPersistentArticle(article);
    
    // Invalidate cache to force reload
    globalArticlesCache = null;
    lastLoadTime = 0;
    
    return result;
  } catch (error) {
    console.error('Error adding shared article:', error);
    return null;
  }
}

// Get article count
export async function getSharedArticleCount() {
  const articles = await getSharedArticles();
  return articles.length;
}

// Initialize if needed
export async function initializeSharedStorage() {
  return await initializeSampleArticlesIfNeeded();
}

// Force cache refresh
export function invalidateCache() {
  globalArticlesCache = null;
  lastLoadTime = 0;
}

// Get cache status for debugging
export function getCacheStatus() {
  return {
    hasCache: !!globalArticlesCache,
    cacheSize: globalArticlesCache ? globalArticlesCache.length : 0,
    lastLoadTime: new Date(lastLoadTime).toISOString(),
    cacheAge: Date.now() - lastLoadTime
  };
}
