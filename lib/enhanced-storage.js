// Enhanced storage utility for RABKL articles
// Uses production storage (Vercel Blob + Redis) in production, fallback storage in development

import { 
  getProductionArticles, 
  addProductionArticle, 
  getProductionArticleCount,
  getProductionStorageStatus 
} from './production-storage.js';

import { 
  getSharedArticles, 
  addSharedArticle, 
  getSharedArticleCount,
  getCacheStatus 
} from './shared-storage.js';

// Determine if we're in production environment
function isProduction() {
  return process.env.NODE_ENV === 'production' || 
         process.env.VERCEL_ENV === 'production' ||
         process.env.VERCEL === '1';
}

// Get articles using appropriate storage backend
export async function getEnhancedArticles() {
  try {
    if (isProduction()) {
      console.log('Using production storage (Vercel Blob + Redis)');
      return await getProductionArticles();
    } else {
      console.log('Using development storage (file system + memory)');
      return await getSharedArticles();
    }
  } catch (error) {
    console.error('Error getting enhanced articles:', error);
    // Fallback to development storage
    return await getSharedArticles();
  }
}

// Add article using appropriate storage backend
export async function addEnhancedArticle(article) {
  try {
    if (isProduction()) {
      console.log('Adding article to production storage');
      return await addProductionArticle(article);
    } else {
      console.log('Adding article to development storage');
      return await addSharedArticle(article);
    }
  } catch (error) {
    console.error('Error adding enhanced article:', error);
    // Fallback to development storage
    return await addSharedArticle(article);
  }
}

// Get article count using appropriate storage backend
export async function getEnhancedArticleCount() {
  try {
    if (isProduction()) {
      return await getProductionArticleCount();
    } else {
      return await getSharedArticleCount();
    }
  } catch (error) {
    console.error('Error getting enhanced article count:', error);
    // Fallback to development storage
    return await getSharedArticleCount();
  }
}

// Get storage status for debugging
export async function getEnhancedStorageStatus() {
  const environment = isProduction() ? 'production' : 'development';
  
  try {
    if (isProduction()) {
      const productionStatus = await getProductionStorageStatus();
      return {
        environment,
        backend: 'production',
        storage: productionStatus,
        timestamp: new Date().toISOString()
      };
    } else {
      const developmentStatus = getCacheStatus();
      return {
        environment,
        backend: 'development',
        storage: {
          cache: developmentStatus,
          filesystem: 'Available'
        },
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    return {
      environment,
      backend: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize storage (ensures sample articles exist)
export async function initializeEnhancedStorage() {
  try {
    const articles = await getEnhancedArticles();
    return articles.length > 0;
  } catch (error) {
    console.error('Error initializing enhanced storage:', error);
    return false;
  }
}
