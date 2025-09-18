// Image utilities for RABKL Newsroom
// Determines appropriate hero images based on article content and category

export function getHeroImage(article) {
  if (!article) return '/images/rabkl-logo-main.png';
  
  const { category, tags = [], title = '' } = article;
  const titleLower = title.toLowerCase();
  const tagsLower = tags.map(tag => tag.toLowerCase());
  
  // Breaking news gets special treatment
  if (tagsLower.includes('breaking') || titleLower.includes('breaking')) {
    return '/images/rabkl-breaking-news.png';
  }
  
  // Category-based image selection
  switch (category?.toLowerCase()) {
    case 'trade':
      return '/images/rabkl-trade-hero.png';
    
    case 'power-rankings':
    case 'rankings':
      return '/images/rabkl-power-rankings.png';
    
    case 'matchup':
    case 'preview':
    case 'game':
      return '/images/rabkl-matchup-preview.png';
    
    default:
      // Tag-based fallbacks
      if (tagsLower.includes('trade')) {
        return '/images/rabkl-trade-hero.png';
      }
      if (tagsLower.includes('power-rankings') || tagsLower.includes('rankings')) {
        return '/images/rabkl-power-rankings.png';
      }
      if (tagsLower.includes('matchup') || tagsLower.includes('preview')) {
        return '/images/rabkl-matchup-preview.png';
      }
      
      // Default RABKL logo
      return '/images/rabkl-logo-main.png';
  }
}

export function getImageAlt(article) {
  if (!article) return 'RABKL Fantasy Basketball League';
  
  const { category, title } = article;
  
  switch (category?.toLowerCase()) {
    case 'trade':
      return `RABKL Trade Alert: ${title}`;
    case 'power-rankings':
    case 'rankings':
      return `RABKL Power Rankings: ${title}`;
    case 'matchup':
    case 'preview':
    case 'game':
      return `RABKL Matchup Preview: ${title}`;
    default:
      return `RABKL News: ${title}`;
  }
}

export function getCategoryIcon(category) {
  switch (category?.toLowerCase()) {
    case 'trade':
      return '🔄';
    case 'power-rankings':
    case 'rankings':
      return '📊';
    case 'matchup':
    case 'preview':
    case 'game':
      return '⚔️';
    case 'breaking':
      return '🚨';
    case 'signing':
    case 'add':
    case 'drop':
      return '✍️';
    case 'recap':
    case 'wrap':
      return '📝';
    default:
      return '🏀';
  }
}

export function getCategoryColor(category) {
  switch (category?.toLowerCase()) {
    case 'trade':
      return '#D21E2B'; // Crimson
    case 'power-rankings':
    case 'rankings':
      return '#F2B300'; // Gold
    case 'matchup':
    case 'preview':
    case 'game':
      return '#0B1D3A'; // Navy
    case 'breaking':
      return '#DC2626'; // Bright Red
    case 'signing':
    case 'add':
    case 'drop':
      return '#059669'; // Green
    case 'recap':
    case 'wrap':
      return '#7C3AED'; // Purple
    default:
      return '#0B1D3A'; // Navy default
  }
}
