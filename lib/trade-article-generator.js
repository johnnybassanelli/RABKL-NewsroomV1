// Trade Article Generator for RABKL Newsroom
// Generates trade articles from live Sleeper API transaction data

import SleeperAPI from './sleeper-api.js';

// ESPN/Woj style intro phrases
const introVariations = [
  "League sources confirm",
  "According to multiple reports",
  "The RABKL Newsroom has learned",
  "Sources tell the RABKL Newsroom",
  "Multiple league insiders report",
  "According to league sources",
  "The RABKL front office confirms",
  "Breaking from the RABKL wire"
];

function getRandomIntro() {
  return introVariations[Math.floor(Math.random() * introVariations.length)];
}

// Generate parody quotes for flavor
function generateParodyQuote(managerName, tradeType = 'general') {
  const quotes = {
    general: [
      `"We're always looking to improve our roster and this move gives us more flexibility going forward," ${managerName} said.`,
      `"This trade aligns with our long-term vision for the franchise," commented ${managerName}.`,
      `"We believe this move puts us in a better position to compete," ${managerName} stated.`,
      `"It's all about finding the right fit for our system," ${managerName} explained.`
    ],
    rebuild: [
      `"We're building for the future and this trade gives us valuable assets," ${managerName} noted.`,
      `"Sometimes you have to take a step back to take two steps forward," said ${managerName}.`,
      `"We're focused on sustainable success," ${managerName} commented.`
    ],
    contender: [
      `"This move puts us over the top for a championship run," ${managerName} declared.`,
      `"We're going all-in this season," stated ${managerName}.`,
      `"This is the piece we needed to complete our puzzle," ${managerName} said.`
    ]
  };
  
  const categoryQuotes = quotes[tradeType] || quotes.general;
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
}

export async function generateTradeArticle(transaction) {
  try {
    const timestamp = new Date().toISOString();
    const weekNumber = SleeperAPI.getCurrentWeek();
    
    // Get involved teams
    const rosterIds = Object.keys(transaction.roster_ids || {});
    const teams = await Promise.all(
      rosterIds.map(id => SleeperAPI.getTeamByRosterId(parseInt(id)))
    );
    
    if (teams.length < 2) {
      throw new Error('Invalid trade data - need at least 2 teams');
    }
    
    const team1 = teams[0];
    const team2 = teams[1];
    
    // Get player names for the trade
    const adds = transaction.adds || {};
    const drops = transaction.drops || {};
    
    const team1Gets = [];
    const team2Gets = [];
    
    for (const [playerId, rosterId] of Object.entries(adds)) {
      const playerName = await SleeperAPI.getPlayerName(playerId);
      if (parseInt(rosterId) === team1.roster_id) {
        team1Gets.push(playerName);
      } else if (parseInt(rosterId) === team2.roster_id) {
        team2Gets.push(playerName);
      }
    }
    
    // Generate article content
    const intro = getRandomIntro();
    let content = `${intro} that the ${team1.team_name} and ${team2.team_name} have completed a trade that addresses roster needs for both franchises.\n\n`;
    
    content += `**Trade Details:**\n`;
    content += `• **${team1.team_name} (${team1.display_name})** receives: ${team1Gets.join(', ') || 'Future considerations'}\n`;
    content += `• **${team2.team_name} (${team2.display_name})** receives: ${team2Gets.join(', ') || 'Future considerations'}\n\n`;
    
    content += `**Analysis:**\n`;
    content += `This transaction showcases the strategic depth that makes the RABKL one of the premier keeper leagues in fantasy basketball. Both managers have identified opportunities to improve their roster construction while maintaining competitive balance.\n\n`;
    
    // Add parody quotes
    content += generateParodyQuote(team1.display_name) + '\n\n';
    content += generateParodyQuote(team2.display_name) + '\n\n';
    
    content += `**League Impact:**\n`;
    content += `The trade market in the RABKL continues to be active as managers look to position their teams for both immediate success and long-term sustainability. This move could have ripple effects throughout the league as other managers evaluate their own roster needs.\n\n`;
    
    content += `With the trade deadline approaching, expect more activity as teams finalize their championship pushes or begin building for future seasons.`;
    
    // Determine if this is a major trade for headline
    const isMajorTrade = team1Gets.length + team2Gets.length >= 4;
    const headline = isMajorTrade 
      ? `Breaking: Major Multi-Player Trade Shakes Up RABKL`
      : `RABKL Trade Alert: ${team1.team_name} and ${team2.team_name} Complete Deal`;
    
    return {
      id: `trade-${transaction.transaction_id || Date.now()}`,
      title: headline,
      content: content,
      author: 'RABKL Newsroom',
      timestamp: timestamp,
      category: 'trade',
      tags: ['trade', 'transaction', `week${weekNumber}`, team1.team_name.toLowerCase().replace(/\s+/g, '-'), team2.team_name.toLowerCase().replace(/\s+/g, '-')],
      published: true,
    };
    
  } catch (error) {
    console.error('Error generating trade article:', error);
    return null;
  }
}

export async function generateRecentTradeArticles(limit = 5) {
  try {
    const transactions = await SleeperAPI.getRecentTransactions();
    
    if (!transactions || transactions.length === 0) {
      return [];
    }
    
    const articles = [];
    for (const transaction of transactions.slice(0, limit)) {
      const article = await generateTradeArticle(transaction);
      if (article) {
        articles.push(article);
      }
    }
    
    return articles;
    
  } catch (error) {
    console.error('Error generating recent trade articles:', error);
    return [];
  }
}

export default {
  generateTradeArticle,
  generateRecentTradeArticles
};
