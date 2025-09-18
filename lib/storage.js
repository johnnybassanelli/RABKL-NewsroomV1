// Simple storage utility for RABKL articles
// In production, this would be replaced with a proper database

import fs from 'fs';
import path from 'path';

const STORAGE_DIR = '/tmp';
const ARTICLES_FILE = path.join(STORAGE_DIR, 'rabkl-articles.json');

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

export function getArticles() {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      const data = fs.readFileSync(ARTICLES_FILE, 'utf8');
      const articles = JSON.parse(data);
      return Array.isArray(articles) ? articles : [];
    }
  } catch (error) {
    console.error('Error reading articles:', error);
  }
  return [];
}

export function saveArticles(articles) {
  try {
    const data = JSON.stringify(articles, null, 2);
    fs.writeFileSync(ARTICLES_FILE, data, 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving articles:', error);
    return false;
  }
}

export function addArticle(article) {
  try {
    const articles = getArticles();
    
    // Check if article already exists (by ID or title)
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
    
    // Sort by timestamp (newest first)
    articles.sort((a, b) => 
      new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
    );
    
    return saveArticles(articles) ? articles : null;
  } catch (error) {
    console.error('Error adding article:', error);
    return null;
  }
}

export function getArticleCount() {
  return getArticles().length;
}
