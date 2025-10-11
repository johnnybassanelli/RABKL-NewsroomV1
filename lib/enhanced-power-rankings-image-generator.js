// Enhanced Power Rankings Image Generator for RABKL Newsroom
// Creates professional graphics with GM profile images and enhanced visuals

import SleeperAPI from './sleeper-api.js';

export async function generateEnhancedPowerRankingsImage(teams, title = 'RABKL Preseason Power Rankings') {
  try {
    // Get team data with GM avatars from Sleeper
    const teamsWithAvatars = await Promise.all(
      teams.slice(0, 20).map(async (team, index) => {
        let avatarUrl = null;
        let displayName = team.manager;
        
        // Try to get avatar and display name from Sleeper API
        try {
          const users = await SleeperAPI.getLeagueUsers();
          const user = users?.find(u => 
            u.display_name?.toLowerCase() === team.manager.toLowerCase() ||
            u.username?.toLowerCase() === team.manager.toLowerCase()
          );
          if (user) {
            if (user.avatar) {
              avatarUrl = `https://sleepercdn.com/avatars/thumbs/${user.avatar}`;
            }
            displayName = user.display_name || user.username || team.manager;
          }
        } catch (error) {
          console.log('Could not fetch avatar for', team.manager);
        }
        
        return {
          rank: index + 1,
          teamName: team.teamName || `Team ${team.roster_id}`,
          manager: displayName,
          projection: team.projectedPoints || 0,
          avatar: avatarUrl,
          tier: index < 3 ? 'Championship' : index < 5 ? 'Playoff' : index < 10 ? 'Mid-Tier' : index < 15 ? 'Work to Do' : 'Rebuilding'
        };
      })
    );

    // Generate enhanced SVG for the power rankings graphic
    const svgContent = generateEnhancedRankingsSVG(teamsWithAvatars, title);
    
    return {
      svg: svgContent,
      filename: 'rabkl-enhanced-preseason-rankings-2025.svg',
      title: title
    };
    
  } catch (error) {
    console.error('Error generating enhanced power rankings image:', error);
    return null;
  }
}

function generateEnhancedRankingsSVG(teams, title) {
  const width = 1000;
  const height = 1400;
  const headerHeight = 140;
  const teamHeight = 90;
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradients for different tiers -->
      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a365d;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#2d5a87;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#4a90a4;stop-opacity:1" />
      </linearGradient>
      
      <linearGradient id="championshipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#ffed4e;stop-opacity:0.1" />
      </linearGradient>
      
      <linearGradient id="playoffGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#48bb78;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#68d391;stop-opacity:0.1" />
      </linearGradient>
      
      <linearGradient id="midTierGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#4299e1;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#63b3ed;stop-opacity:0.1" />
      </linearGradient>
      
      <linearGradient id="workGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ed8936;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#f6ad55;stop-opacity:0.1" />
      </linearGradient>
      
      <linearGradient id="rebuildGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#e53e3e;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#fc8181;stop-opacity:0.1" />
      </linearGradient>
      
      <!-- Drop shadow filter -->
      <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
      
      <!-- Glow effect -->
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Background with subtle pattern -->
    <rect width="${width}" height="${height}" fill="#f8fafc"/>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="0.5" opacity="0.3"/>
    </pattern>
    <rect width="${width}" height="${height}" fill="url(#grid)"/>
    
    <!-- Header with enhanced styling -->
    <rect width="${width}" height="${headerHeight}" fill="url(#headerGrad)" filter="url(#dropshadow)"/>
    
    <!-- RABKL Logo with glow -->
    <circle cx="100" cy="70" r="40" fill="#ff6b35" filter="url(#glow)"/>
    <text x="100" y="78" text-anchor="middle" fill="white" font-family="Arial Black" font-size="28" font-weight="bold">R</text>
    
    <!-- Title with enhanced typography -->
    <text x="160" y="50" fill="white" font-family="Arial Black" font-size="32" font-weight="bold" filter="url(#glow)">${title}</text>
    <text x="160" y="80" fill="#e2e8f0" font-family="Arial" font-size="18" font-weight="600">Roth Annual Basketball Keeper League</text>
    <text x="160" y="105" fill="#cbd5e0" font-family="Arial" font-size="16">Week 1 Projections • Season starts in 10 days</text>
    <text x="160" y="125" fill="#a0aec0" font-family="Arial" font-size="14">Based on actual Sleeper matchup data</text>`;

  // Add teams with enhanced styling
  teams.forEach((team, index) => {
    const y = headerHeight + (index * teamHeight) + 20;
    const tierColor = getTierGradient(team.tier);
    const tierBadgeColor = getTierBadgeColor(team.tier);
    const rankColor = getRankColor(team.rank);
    
    // Team row background with border
    svg += `
    <!-- Team ${team.rank} Background -->
    <rect x="30" y="${y}" width="${width - 60}" height="${teamHeight - 15}" 
          fill="${tierColor}" 
          stroke="${tierBadgeColor}" 
          stroke-width="2" 
          rx="12" 
          filter="url(#dropshadow)"/>
    
    <!-- Rank circle with tier color -->
    <circle cx="80" cy="${y + 35}" r="25" fill="${rankColor}" stroke="white" stroke-width="3" filter="url(#dropshadow)"/>
    <text x="80" y="${y + 42}" text-anchor="middle" fill="white" font-family="Arial Black" font-size="20" font-weight="bold">${team.rank}</text>
    
    <!-- GM Avatar (placeholder circle with initials) -->
    <circle cx="140" cy="${y + 35}" r="22" fill="#4a5568" stroke="white" stroke-width="2" filter="url(#dropshadow)"/>
    <text x="140" y="${y + 40}" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">${team.manager.charAt(0)}</text>
    
    <!-- Team Info with enhanced typography -->
    <text x="180" y="${y + 25}" fill="#1a202c" font-family="Arial Black" font-size="20" font-weight="bold">${team.teamName}</text>
    <text x="180" y="${y + 45}" fill="#2d3748" font-family="Arial" font-size="16" font-weight="600">${team.manager}</text>
    <text x="180" y="${y + 62}" fill="#4a5568" font-family="Arial" font-size="14">Week 1 Projection: ${team.projection} points</text>
    
    <!-- Tier Badge with enhanced styling -->
    <rect x="${width - 150}" y="${y + 20}" width="100" height="25" fill="${tierBadgeColor}" rx="12" filter="url(#dropshadow)"/>
    <text x="${width - 100}" y="${y + 37}" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${team.tier.toUpperCase()}</text>
    
    <!-- Projection bar -->
    <rect x="${width - 150}" y="${y + 50}" width="${Math.min(90, (team.projection / 250) * 90)}" height="8" fill="${tierBadgeColor}" rx="4" opacity="0.7"/>
    
    <!-- Separator line -->
    <line x1="50" y1="${y + teamHeight - 5}" x2="${width - 50}" y2="${y + teamHeight - 5}" stroke="#e2e8f0" stroke-width="1" opacity="0.5"/>`;
  });

  // Enhanced footer
  const footerY = headerHeight + (teams.length * teamHeight) + 60;
  svg += `
    <!-- Footer section -->
    <rect x="30" y="${footerY - 20}" width="${width - 60}" height="80" fill="url(#headerGrad)" rx="12" opacity="0.1"/>
    
    <text x="${width/2}" y="${footerY}" text-anchor="middle" fill="#2d3748" font-family="Arial" font-size="16" font-weight="bold">
      Championship Contenders: 200+ points | Playoff Contenders: 180-199 points
    </text>
    <text x="${width/2}" y="${footerY + 25}" text-anchor="middle" fill="#4a5568" font-family="Arial" font-size="14">
      Rankings based on Week 1 matchup projections • Next update: October 27th
    </text>
    <text x="${width/2}" y="${footerY + 45}" text-anchor="middle" fill="#718096" font-family="Arial" font-size="12">
      RABKL Newsroom • Follow for weekly updates and trade alerts
    </text>
  </svg>`;

  return svg;
}

function getTierGradient(tier) {
  switch(tier) {
    case 'Championship': return 'url(#championshipGrad)';
    case 'Playoff': return 'url(#playoffGrad)';
    case 'Mid-Tier': return 'url(#midTierGrad)';
    case 'Work to Do': return 'url(#workGrad)';
    case 'Rebuilding': return 'url(#rebuildGrad)';
    default: return 'url(#midTierGrad)';
  }
}

function getTierBadgeColor(tier) {
  switch(tier) {
    case 'Championship': return '#ffd700';
    case 'Playoff': return '#48bb78';
    case 'Mid-Tier': return '#4299e1';
    case 'Work to Do': return '#ed8936';
    case 'Rebuilding': return '#e53e3e';
    default: return '#4299e1';
  }
}

function getRankColor(rank) {
  if (rank <= 3) return '#ffd700'; // Gold for top 3
  if (rank <= 5) return '#48bb78'; // Green for playoff
  if (rank <= 10) return '#4299e1'; // Blue for mid-tier
  if (rank <= 15) return '#ed8936'; // Orange for work to do
  return '#e53e3e'; // Red for rebuilding
}

export async function saveEnhancedPowerRankingsImage(teams, outputPath) {
  try {
    const imageData = await generateEnhancedPowerRankingsImage(teams);
    if (!imageData) return null;
    
    return {
      path: outputPath,
      content: imageData.svg,
      type: 'svg'
    };
    
  } catch (error) {
    console.error('Error saving enhanced power rankings image:', error);
    return null;
  }
}

export default {
  generateEnhancedPowerRankingsImage,
  saveEnhancedPowerRankingsImage
};
