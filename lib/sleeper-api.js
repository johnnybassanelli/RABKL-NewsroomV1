// Sleeper API Integration for RABKL League
// Fetches live data from Sleeper.com for league 1228186433580171264

const LEAGUE_ID = '1228186433580171264';
const BASE_URL = 'https://api.sleeper.app/v1';

// Cache for API responses to avoid rate limiting
let cache = {
  league: null,
  users: null,
  rosters: null,
  lastUpdated: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache(url, cacheKey) {
  const now = Date.now();
  
  if (cache[cacheKey] && cache.lastUpdated && (now - cache.lastUpdated) < CACHE_DURATION) {
    return cache[cacheKey];
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    cache[cacheKey] = data;
    cache.lastUpdated = now;
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return cache[cacheKey] || null; // Return cached data if available
  }
}

export async function getLeagueInfo() {
  return await fetchWithCache(`${BASE_URL}/league/${LEAGUE_ID}`, 'league');
}

export async function getLeagueUsers() {
  return await fetchWithCache(`${BASE_URL}/league/${LEAGUE_ID}/users`, 'users');
}

export async function getLeagueRosters() {
  return await fetchWithCache(`${BASE_URL}/league/${LEAGUE_ID}/rosters`, 'rosters');
}

export async function getMatchups(week) {
  const url = `${BASE_URL}/league/${LEAGUE_ID}/matchups/${week}`;
  return await fetchWithCache(url, `matchups_${week}`);
}

export async function getTransactions(week) {
  const url = `${BASE_URL}/league/${LEAGUE_ID}/transactions/${week}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error(`Error fetching transactions for week ${week}:`, error);
    return [];
  }
}

export async function getAllPlayers() {
  const url = `${BASE_URL}/players/nba`;
  return await fetchWithCache(url, 'players');
}

// Get current week number
export function getCurrentWeek() {
  const now = new Date();
  const seasonStart = new Date('2024-10-01'); // Approximate NBA season start
  const diffTime = Math.abs(now - seasonStart);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(Math.ceil(diffDays / 7), 24); // Max 24 weeks
}

// Combine users and rosters for complete team info
export async function getTeamsWithManagers() {
  const [users, rosters] = await Promise.all([
    getLeagueUsers(),
    getLeagueRosters()
  ]);
  
  if (!users || !rosters) return [];
  
  return rosters.map(roster => {
    const user = users.find(u => u.user_id === roster.owner_id);
    return {
      roster_id: roster.roster_id,
      owner_id: roster.owner_id,
      username: user?.username || 'Unknown',
      display_name: user?.display_name || user?.username || 'Unknown Manager',
      team_name: user?.metadata?.team_name || `Team ${roster.roster_id}`,
      avatar: user?.avatar,
      wins: roster.settings?.wins || 0,
      losses: roster.settings?.losses || 0,
      ties: roster.settings?.ties || 0,
      points_for: roster.settings?.fpts || 0,
      points_against: roster.settings?.fpts_against || 0,
      waiver_position: roster.settings?.waiver_position || 0,
      players: roster.players || [],
      starters: roster.starters || []
    };
  });
}

// Generate power rankings based on current standings
export async function generatePowerRankings() {
  const teams = await getTeamsWithManagers();
  if (!teams || teams.length === 0) return null;
  
  // Sort teams by wins, then by points for
  const sortedTeams = teams.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.points_for - a.points_for;
  });
  
  return sortedTeams.map((team, index) => ({
    rank: index + 1,
    team_name: team.team_name,
    manager: team.display_name,
    record: `${team.wins}-${team.losses}${team.ties > 0 ? `-${team.ties}` : ''}`,
    points_for: team.points_for,
    points_against: team.points_against,
    movement: '▬' // TODO: Calculate movement from previous week
  }));
}

// Get recent transactions for trade articles
export async function getRecentTransactions(weeks = 3) {
  const currentWeek = getCurrentWeek();
  const transactions = [];
  
  for (let week = Math.max(1, currentWeek - weeks); week <= currentWeek; week++) {
    const weekTransactions = await getTransactions(week);
    if (weekTransactions && weekTransactions.length > 0) {
      transactions.push(...weekTransactions);
    }
  }
  
  return transactions.filter(t => t.type === 'trade').slice(0, 10); // Last 10 trades
}

// Format player names from player IDs
export async function getPlayerName(playerId) {
  const players = await getAllPlayers();
  if (!players || !players[playerId]) return `Player ${playerId}`;
  
  const player = players[playerId];
  return `${player.first_name} ${player.last_name}`;
}

// Get team info by roster ID
export async function getTeamByRosterId(rosterId) {
  const teams = await getTeamsWithManagers();
  return teams.find(team => team.roster_id === rosterId);
}

export default {
  getLeagueInfo,
  getLeagueUsers,
  getLeagueRosters,
  getMatchups,
  getTransactions,
  getAllPlayers,
  getCurrentWeek,
  getTeamsWithManagers,
  generatePowerRankings,
  getRecentTransactions,
  getPlayerName,
  getTeamByRosterId
};
