'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getHeroImage, getImageAlt, getCategoryIcon, getCategoryColor } from '../../../lib/image-utils.js';

export default function ArticlePage({ params }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    async function loadArticle() {
      try {
        // Fetch all articles
        const response = await fetch('/api/articles');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.articles) {
            // Find the article by slug (created from title)
            const targetArticle = data.articles.find(a => 
              createSlug(a.title) === params.slug || a.id === params.slug
            );
            
            if (targetArticle) {
              setArticle(targetArticle);
              
              // Get related articles (same category, excluding current)
              const related = data.articles
                .filter(a => a.category === targetArticle.category && a.id !== targetArticle.id)
                .slice(0, 3);
              setRelatedArticles(related);
            }
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadArticle();
  }, [params.slug]);

  // Create URL-friendly slug from title
  function createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Format content with basic Markdown-style rendering
  function formatContent(content) {
    if (!content) return '';
    
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        // Handle bold text
        const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        return (
          <p key={index} style={{ 
            marginBottom: '1.5rem', 
            lineHeight: '1.7',
            fontSize: '1.125rem',
            color: '#374151'
          }} dangerouslySetInnerHTML={{ __html: formattedParagraph }} />
        );
      });
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FDF6E3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #0B1D3A', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#666' }}>Loading article...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!article) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6E3' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderBottom: '4px solid #D21E2B' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0B1D3A', margin: 0 }}>
              🏀 RABKL NEWSROOM
            </h1>
          </Link>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: '#F2B300' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', marginRight: '8px', animation: 'pulse 2s infinite' }}></span>
            LIVE
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← Back to Newsroom
          </Link>
        </nav>

        {/* Article Header */}
        <article style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          {/* Category Badge */}
          <div style={{ padding: '24px 24px 0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              {article.tags?.includes('breaking') && (
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', color: 'white', backgroundColor: '#D21E2B', marginRight: '8px' }}>
                  🚨 BREAKING
                </span>
              )}
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', color: 'white', backgroundColor: getCategoryColor(article.category) }}>
                {getCategoryIcon(article.category)} {article.category?.toUpperCase() || 'NEWS'}
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', lineHeight: '1.2', color: '#0B1D3A', marginBottom: '16px' }}>
              {article.title}
            </h1>

            {/* Metadata */}
            <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#0B1D3A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>📰</span>
                </div>
                <div>
                  <p style={{ fontWeight: '600', color: '#0B1D3A', margin: 0 }}>
                    {article.author || 'RABKL Newsroom'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                    {new Date(article.timestamp || article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div style={{ margin: '0 24px 32px 24px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <img 
              src={getHeroImage(article)}
              alt={getImageAlt(article)}
              style={{ 
                width: '100%', 
                height: '300px', 
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{ 
              backgroundColor: '#F3F4F6', 
              height: '300px', 
              display: 'none', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#6B7280'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{getCategoryIcon(article?.category)}</div>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>RABKL Newsroom</p>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div style={{ padding: '0 24px 32px 24px' }}>
            <div style={{ fontSize: '1.125rem', lineHeight: '1.7', color: '#374151' }}>
              {formatContent(article.content)}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginBottom: '12px' }}>TAGS</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {article.tags.map((tag, index) => (
                    <span key={index} style={{ display: 'inline-block', backgroundColor: '#F3F4F6', color: '#374151', fontSize: '0.875rem', padding: '6px 12px', borderRadius: '6px', fontWeight: '500' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0B1D3A', marginBottom: '24px' }}>
              Related Stories
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {relatedArticles.map((relatedArticle, index) => (
                <Link key={index} href={`/article/${createSlug(relatedArticle.title)}`} style={{ textDecoration: 'none' }}>
                  <article style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ padding: '16px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '500', color: 'white', backgroundColor: '#0B1D3A', marginBottom: '8px' }}>
                        {relatedArticle.category?.toUpperCase() || 'NEWS'}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0B1D3A', marginBottom: '8px', lineHeight: '1.4' }}>
                        {relatedArticle.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                        {new Date(relatedArticle.timestamp || relatedArticle.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '4px solid #F2B300', marginTop: '64px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
          <p style={{ color: '#666', margin: 0 }}>
            <strong>RABKL Newsroom</strong> - Your source for fantasy basketball news
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
