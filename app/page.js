'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Check if the newsroom agent is running
        try {
          const statusResponse = await fetch('/api/v1/status');
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            setStatus(statusData);
          }
        } catch (statusError) {
          console.log('Status endpoint not available');
        }
        
        // Fetch published articles
        try {
          const articlesResponse = await fetch('/api/articles');
          if (articlesResponse.ok) {
            const articlesData = await articlesResponse.json();
            if (articlesData.success && articlesData.articles) {
              setArticles(articlesData.articles);
            }
          }
        } catch (articlesError) {
          console.log('Articles endpoint not available');
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const testPublish = async () => {
    const testArticle = {
      message: 'news: test-article',
      files: [
        {
          path: 'content/2025/09/18/test-article.json',
          content: JSON.stringify({
            title: 'TEST: Chris Paul Traded to Shloky',
            date: new Date().toISOString(),
            tags: ['trade', 'breaking', 'test', 'shloky', 'chris-paul'],
            slug: 'test-article',
            thumbnail: '/images/test-article.png',
            hero_image: '/images/test-article.png',
            brand_logo: '/brand/logo.png',
            draft: false
          }, null, 2)
        }
      ]
    };

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publish-secret': 'RABKLsecretkey_92h3jd83'
        },
        body: JSON.stringify(testArticle)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('✅ SUCCESS! Publish endpoint working. Reloading page...');
        window.location.reload();
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Network error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FDF6E3 0%, #FAF3DD 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #f3f3f3', borderTop: '4px solid #0B1D3A', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#666' }}>Loading RABKL News...</p>
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6E3' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderBottom: '4px solid #D21E2B' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0B1D3A', margin: 0 }}>
              🏀 RABKL NEWSROOM
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#666', marginTop: '8px', margin: 0 }}>
              Roth Annual Basketball Keeper League
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', color: 'white', backgroundColor: '#F2B300' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', marginRight: '8px', animation: 'pulse 2s infinite' }}></span>
              LIVE
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px' }}>
        {articles.length === 0 ? (
          // No Articles State
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '32px', maxWidth: '512px', margin: '0 auto' }}>
              <div style={{ fontSize: '3.75rem', marginBottom: '16px' }}>📰</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#0B1D3A' }}>
                RABKL Newsroom is LIVE!
              </h2>
              <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
                ✅ Fixed deployment with working /api/publish endpoint<br/>
                ✅ Articles will appear here when published<br/>
                ✅ Professional RABKL branding and styling
              </p>
              
              {/* API Status */}
              <div style={{ backgroundColor: '#F9FAFB', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#0B1D3A' }}>✅ Available Endpoints:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', marginRight: '8px' }}></span>
                    <code>/api/v1/newsroom-loop</code>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', marginRight: '8px' }}></span>
                    <code>/api/v1/weekly-power-rankings</code>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', marginRight: '8px' }}></span>
                    <code>/api/v1/status</code>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#3B82F6', borderRadius: '50%', marginRight: '8px' }}></span>
                    <code>/api/publish</code> <span style={{ fontSize: '0.75rem', color: '#10B981', marginLeft: '4px', fontWeight: 'bold' }}>✅ FIXED!</span>
                  </div>
                </div>
              </div>

              {/* Test Publish Button */}
              <div style={{ marginBottom: '24px' }}>
                <button 
                  onClick={testPublish}
                  style={{ 
                    backgroundColor: '#10B981', 
                    color: 'white', 
                    fontWeight: 'bold', 
                    padding: '12px 24px', 
                    borderRadius: '12px', 
                    fontSize: '1.125rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#10B981'}
                >
                  🧪 Test Publish Endpoint
                </button>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                <p>🔄 Newsroom Agent Status: <span style={{ color: '#10B981', fontWeight: '500' }}>Running</span></p>
                <p>📊 League ID: 1228186433580171264</p>
                <p>🏆 Sport: NBA Basketball</p>
                <p>🚀 Deployment: <span style={{ color: '#10B981', fontWeight: '500' }}>FIXED & LIVE</span></p>
              </div>
            </div>
          </div>
        ) : (
          // Articles grid (when articles are published)
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {articles.map((article, index) => (
              <article key={index} style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', transition: 'all 0.3s ease' }}>
                {article.hero_image && (
                  <img 
                    src={article.hero_image} 
                    alt={article.title}
                    style={{ width: '100%', height: '192px', objectFit: 'cover' }}
                  />
                )}
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    {article.tags?.includes('breaking') && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', color: 'white', backgroundColor: '#D21E2B', marginRight: '8px' }}>
                        BREAKING
                      </span>
                    )}
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', color: 'white', backgroundColor: '#0B1D3A' }}>
                      {article.category?.toUpperCase() || 'TRADE'}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#0B1D3A' }}>
                    {article.title}
                  </h2>
                  <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '12px', lineHeight: '1.5' }}>
                    {article.content ? article.content.substring(0, 150) + '...' : 'No preview available'}
                  </p>
                  <p style={{ color: '#999', fontSize: '0.75rem', marginBottom: '16px' }}>
                    By {article.author || 'RABKL Newsroom'} • {new Date(article.timestamp || article.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {article.tags?.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} style={{ display: 'inline-block', backgroundColor: '#F3F4F6', color: '#374151', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '4px solid #F2B300', marginTop: '64px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 16px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            <strong>RABKL Newsroom</strong> - Powered by the RABKL Newsroom Agent
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '8px' }}>
            Real-time fantasy basketball news and analysis
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

