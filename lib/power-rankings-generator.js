// Power Rankings Generator for RABKL Newsroom
// Generates tiered rankings of all 32 teams with movement indicators
// Now uses live data from Sleeper API

import SleeperAPI from './sleeper-api.js';

function getMovementIndicator(previous, current) {
  if (previous > current) return '▲'; // Up
  if (previous < current) return '▼'; // Down
  return '▬'; // No change
}

function getTier(rank) {
  if (rank <= 4) return 'Championship Contenders';
  if (rank <= 8) return 'Playoff Locks';
  if (rank <= 16) return 'In the Hunt';
  if (rank <= 24) return 'Work to Do';
  return 'Lottery Bound';
}

export async function generatePowerRankingsArticle() {
  const timestamp = new Date().toISOString();
  const weekNumber = SleeperAPI.getCurrentWeek();

  try {
    // Get live RABKL power rankings
    const rankings = await SleeperAPI.generatePowerRankings();
    
    if (!rankings || rankings.length === 0) {
      throw new Error('No rankings data available');
    }

    // Generate article content with real RABKL data
    let content = `The RABKL Power Rankings are here for Week ${weekNumber}, and the competition is heating up in the Roth Annual Basketball Keeper League! With 32 teams battling for supremacy, let's dive into where each squad stands.\n\n`;

    let currentTier = '';
    rankings.forEach(team => {
      const tier = getTier(team.rank);
      if (tier !== currentTier) {
        content += `**${tier}**\n\n`;
        currentTier = tier;
      }
      
      content += `${team.rank}. **${team.team_name} (${team.manager})** ${team.movement} - ${team.record}\n`;
      content += `   Points For: ${team.points_for.toFixed(1)} | Points Against: ${team.points_against.toFixed(1)}\n\n`;
    });

    content += `The RABKL continues to showcase the depth and competitiveness that makes it one of the premier keeper leagues. With trades, waiver moves, and strategic lineup decisions happening daily, these rankings will continue to shift as the season progresses.\n\n`;
    content += `What do you think of the current standings? The race for the playoffs is heating up!`;

    return {
      id: `power-rankings-week-${weekNumber}-${new Date().getFullYear()}`,
      title: `RABKL Power Rankings: Week ${weekNumber}`,
      content: content,
      author: 'RABKL Newsroom',
      timestamp: timestamp,
      category: 'power-rankings',
      tags: ['power-rankings', 'rankings', `week${weekNumber}`, 'standings'],
      published: true,
    };
  } catch (error) {
    console.error('Error generating power rankings:', error);
    
    // Fallback content if API fails
    return {
      id: `power-rankings-week-${weekNumber}-${new Date().getFullYear()}`,
      title: `RABKL Power Rankings: Week ${weekNumber}`,
      content: `The RABKL Power Rankings for Week ${weekNumber} are being compiled. Check back soon for the latest standings in the Roth Annual Basketball Keeper League!\n\nWith 32 teams competing at the highest level, every week brings new storylines and shifts in the standings. Stay tuned for the complete rankings update.`,
      author: 'RABKL Newsroom',
      timestamp: timestamp,
      category: 'power-rankings',
      tags: ['power-rankings', 'rankings', `week${weekNumber}`],
      published: true,
    };
  }
}

export function generatePowerRankingsGraphicData() {
  return teams.map(team => ({
    rank: team.currentRank,
    previousRank: team.previousRank,
    movement: getMovementIndicator(team.previousRank, team.currentRank),
    tier: getTier(team.currentRank),
  }));
}
