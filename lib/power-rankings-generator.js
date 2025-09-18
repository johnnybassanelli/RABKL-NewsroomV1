// Power Rankings Generator for RABKL Newsroom
// Generates tiered rankings of all 32 teams with movement indicators

// Mock data for 32 teams (replace with actual data source)
const teams = Array.from({ length: 32 }, (_, i) => ({
  id: i + 1,
  name: `Team ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
  gm: `GM ${String.fromCharCode(65 + (i % 26))}`,
  previousRank: Math.floor(Math.random() * 32) + 1,
  currentRank: i + 1,
}));

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

export function generatePowerRankingsArticle() {
  const timestamp = new Date().toISOString();
  const weekNumber = Math.ceil((new Date().getDate() + new Date().getDay()) / 7);

  // Sort teams by current rank
  const sortedTeams = teams.sort((a, b) => a.currentRank - b.currentRank);

  // Generate article content
  let content = `The RABKL Power Rankings are here for Week ${weekNumber}, and there are some major shakeups in the top tiers. Let\'s dive into the rankings and see who\'s rising and who\'s falling.\n\n`;

  let currentTier = '';
  sortedTeams.forEach(team => {
    const tier = getTier(team.currentRank);
    if (tier !== currentTier) {
      content += `**${tier}**\n\n`;
      currentTier = tier;
    }
    
    const movement = getMovementIndicator(team.previousRank, team.currentRank);
    content += `${team.currentRank}. **${team.name} (${team.gm})** ${movement} (was ${team.previousRank})\n`;
  });

  content += `\nWhat do you think of the rankings? Let us know on the league message boards!`;

  return {
    id: `power-rankings-week-${weekNumber}-${new Date().getFullYear()}`,
    title: `RABKL Power Rankings: Week ${weekNumber}`,
    content: content,
    author: 'RABKL Newsroom',
    timestamp: timestamp,
    category: 'power-rankings',
    tags: ['power-rankings', 'rankings', `week${weekNumber}`],
    published: true,
  };
}

export function generatePowerRankingsGraphicData() {
  return teams.map(team => ({
    rank: team.currentRank,
    previousRank: team.previousRank,
    movement: getMovementIndicator(team.previousRank, team.currentRank),
    tier: getTier(team.currentRank),
  }));
}
