// Power Rankings Image Generator for RABKL Newsroom
// Creates professional graphics with GM profile images from Sleeper

import SleeperAPI from './sleeper-api.js';

// GM Profile Image URLs from Sleeper (these would be fetched from Sleeper API)
const GM_AVATARS = {
  'MarginalMoves': 'https://sleepercdn.com/avatars/thumbs/[avatar_id]',
  'Pregame Charania': 'https://sleepercdn.com/avatars/thumbs/[avatar_id]',
  'Darlow': 'https://sleepercdn.com/avatars/thumbs/[avatar_id]',
  'jbrockhoff': 'https://sleepercdn.com/avatars/thumbs/[avatar_id]'
};

export async function generatePowerRankingsImage(teams, title = 'RABKL Preseason Power Rankings') {
  try {
    // Get team data with GM avatars
    const teamsWithAvatars = await Promise.all(
      teams.slice(0, 12).map(async (team, index) => {
        let avatarUrl = null;
        
        // Try to get avatar from Sleeper API
        try {
          const users = await SleeperAPI.getLeagueUsers();
          const user = users?.find(u => u.user_id === team.owner_id);
          if (user?.avatar) {
            avatarUrl = `https://sleepercdn.com/avatars/thumbs/${user.avatar}`;
          }
        } catch (error) {
          console.log('Could not fetch avatar for', team.display_name);
        }
        
        return {
          rank: index + 1,
          teamName: team.team_name || `Team ${team.roster_id}`,
          manager: team.display_name || team.username,
          record: team.record || '0-0',
          projection: team.adjustedProjection || team.projection || 0,
          avatar: avatarUrl,
          tier: index < 4 ? 'Contender' : index < 8 ? 'Playoff' : 'Hunt'
        };
      })
    );

    // Generate SVG for the power rankings graphic
    const svgContent = generateRankingsSVG(teamsWithAvatars, title);
    
    return {
      svg: svgContent,
      filename: 'rabkl-preseason-rankings-2025.svg',
      title: title
    };
    
  } catch (error) {
    console.error('Error generating power rankings image:', error);
    return null;
  }
}

function generateRankingsSVG(teams, title) {
  const width = 800;
  const height = 1000;
  const headerHeight = 120;
  const teamHeight = 70;
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#1a365d;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2d5a87;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="contenderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.2" />
        <stop offset="100%" style="stop-color:#ffed4e;stop-opacity:0.1" />
      </linearGradient>
      <linearGradient id="playoffGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#48bb78;stop-opacity:0.2" />
        <stop offset="100%" style="stop-color:#68d391;stop-opacity:0.1" />
      </linearGradient>
      <linearGradient id="huntGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#4299e1;stop-opacity:0.2" />
        <stop offset="100%" style="stop-color:#63b3ed;stop-opacity:0.1" />
      </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="#f7fafc"/>
    
    <!-- Header -->
    <rect width="${width}" height="${headerHeight}" fill="url(#headerGrad)"/>
    
    <!-- RABKL Logo Area -->
    <circle cx="80" cy="60" r="35" fill="#ff6b35"/>
    <text x="80" y="68" text-anchor="middle" fill="white" font-family="Arial Black" font-size="24" font-weight="bold">R</text>
    
    <!-- Title -->
    <text x="140" y="45" fill="white" font-family="Arial" font-size="28" font-weight="bold">${title}</text>
    <text x="140" y="75" fill="#e2e8f0" font-family="Arial" font-size="16">Roth Annual Basketball Keeper League</text>
    <text x="140" y="95" fill="#cbd5e0" font-family="Arial" font-size="14">Season starts in 10 days • Preseason Analysis</text>`;

  // Add teams
  teams.forEach((team, index) => {
    const y = headerHeight + (index * teamHeight) + 20;
    const tierColor = team.tier === 'Contender' ? 'url(#contenderGrad)' : 
                     team.tier === 'Playoff' ? 'url(#playoffGrad)' : 'url(#huntGrad)';
    
    // Team row background
    svg += `
    <rect x="20" y="${y}" width="${width - 40}" height="${teamHeight - 10}" fill="${tierColor}" stroke="#e2e8f0" stroke-width="1" rx="8"/>
    
    <!-- Rank -->
    <text x="50" y="${y + 35}" text-anchor="middle" fill="#2d3748" font-family="Arial Black" font-size="24" font-weight="bold">${team.rank}</text>
    
    <!-- Avatar placeholder (would be actual image in real implementation) -->
    <circle cx="100" cy="${y + 30}" r="20" fill="#4a5568" stroke="#e2e8f0" stroke-width="2"/>
    <text x="100" y="${y + 35}" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">${team.manager.charAt(0)}</text>
    
    <!-- Team Info -->
    <text x="140" y="${y + 25}" fill="#1a202c" font-family="Arial" font-size="18" font-weight="bold">${team.teamName}</text>
    <text x="140" y="${y + 45}" fill="#4a5568" font-family="Arial" font-size="14">${team.manager} • Proj: ${team.projection.toFixed(1)} PPG</text>
    
    <!-- Tier Badge -->
    <rect x="${width - 120}" y="${y + 15}" width="80" height="20" fill="${team.tier === 'Contender' ? '#ffd700' : team.tier === 'Playoff' ? '#48bb78' : '#4299e1'}" rx="10"/>
    <text x="${width - 80}" y="${y + 28}" text-anchor="middle" fill="white" font-family="Arial" font-size="11" font-weight="bold">${team.tier.toUpperCase()}</text>`;
  });

  // Footer
  const footerY = headerHeight + (teams.length * teamHeight) + 40;
  svg += `
    <!-- Footer -->
    <text x="400" y="${footerY}" text-anchor="middle" fill="#718096" font-family="Arial" font-size="12">
      Rankings based on roster analysis, projections, and strength of schedule
    </text>
    <text x="400" y="${footerY + 20}" text-anchor="middle" fill="#a0aec0" font-family="Arial" font-size="11">
      RABKL Newsroom • Follow for weekly updates
    </text>
  </svg>`;

  return svg;
}

export async function savePowerRankingsImage(teams, outputPath) {
  try {
    const imageData = await generatePowerRankingsImage(teams);
    if (!imageData) return null;
    
    // In a real implementation, you would save the SVG or convert to PNG
    // For now, return the SVG content
    return {
      path: outputPath,
      content: imageData.svg,
      type: 'svg'
    };
    
  } catch (error) {
    console.error('Error saving power rankings image:', error);
    return null;
  }
}

export default {
  generatePowerRankingsImage,
  savePowerRankingsImage
};
