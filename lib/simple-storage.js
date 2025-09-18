// Simple in-memory storage for RABKL articles
// This works within the same serverless function execution context

// Global articles array that persists during the function lifetime
let articlesCache = [];

export function getArticles() {
  return [...articlesCache].sort((a, b) => 
    new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
  );
}

export function addArticle(article) {
  try {
    // Check if article already exists (by ID or title)
    const existingIndex = articlesCache.findIndex(a => 
      a.id === article.id || a.title === article.title
    );
    
    if (existingIndex >= 0) {
      // Update existing article
      articlesCache[existingIndex] = { ...articlesCache[existingIndex], ...article };
    } else {
      // Add new article
      articlesCache.push(article);
    }
    
    console.log(`Article added: ${article.title}. Total: ${articlesCache.length}`);
    return articlesCache;
  } catch (error) {
    console.error('Error adding article:', error);
    return null;
  }
}

export function getArticleCount() {
  return articlesCache.length;
}

export function clearArticles() {
  articlesCache = [];
  return true;
}

// Initialize with some sample articles for testing
export function initializeSampleArticles() {
  if (articlesCache.length === 0) {
    const sampleArticles = [
      {
        "title": "RABKL Trade Alert: Major Roster Shakeup in Week 3",
        "content": "The RABKL trade market exploded this week with a significant multi-player deal that has fantasy managers buzzing. In a move that could reshape the playoff picture, two teams executed a strategic trade that addresses key roster needs on both sides.\n\n**Trade Details:**\nThe transaction involves multiple players and draft considerations, with both teams looking to optimize their lineups for the remainder of the season. This trade demonstrates the active and competitive nature of the RABKL, where managers are constantly seeking ways to improve their championship odds.\n\n**Impact Analysis:**\nFantasy experts are already weighing in on the potential impact of this trade. The move addresses depth concerns for one team while providing immediate starter-level talent for the other. Both managers appear to have identified value in players that fit their specific team construction and strategy.\n\n**League Reaction:**\nOther RABKL managers have taken notice of this trade, with several expressing interest in making their own moves before the trade deadline. The active trade market is a hallmark of competitive keeper leagues, where long-term planning meets short-term opportunity.\n\nThis trade serves as a reminder that in the RABKL, every week brings new opportunities for teams to improve their rosters and chase championship glory.",
        "author": "RABKL Newsroom",
        "timestamp": "2025-09-18T17:25:00Z",
        "category": "trade",
        "tags": ["trade", "roster", "strategy", "week3"],
        "id": "trade_alert_week3_2025",
        "published": true
      },
      {
        "title": "Breaking: RABKL Managers Execute Strategic Player Swap",
        "content": "In a calculated move that showcases the strategic depth of RABKL management, two teams have completed a player exchange that addresses specific roster construction needs. This trade highlights the sophisticated approach that RABKL managers take when evaluating talent and team building.\n\n**Strategic Considerations:**\nThe trade appears to be driven by positional needs and long-term planning rather than immediate impact. Both teams have demonstrated their commitment to building sustainable competitive rosters that can contend not just this season, but in future campaigns as well.\n\n**Player Evaluation:**\nRABKL managers are known for their thorough player evaluation process, and this trade reflects that attention to detail. The exchanged players bring different skill sets and upside potential, allowing each team to better align their roster with their strategic vision.\n\n**Market Implications:**\nThis transaction could signal the beginning of increased trade activity as we approach the midseason mark. Other managers are likely evaluating their own rosters and considering whether similar strategic moves could benefit their championship aspirations.\n\n**Looking Ahead:**\nWith this trade completed, both teams now have the flexibility to pursue additional moves or focus on optimizing their current lineups. The RABKL trade market remains active, with several other managers reportedly exploring potential deals.",
        "author": "RABKL Newsroom",
        "timestamp": "2025-09-18T17:26:00Z",
        "category": "trade",
        "tags": ["trade", "strategy", "management", "analysis"],
        "id": "strategic_player_swap_2025",
        "published": true
      },
      {
        "title": "RABKL Trade Wire: Teams Address Depth and Upside",
        "content": "The RABKL continues to showcase why it's considered one of the most competitive keeper leagues, with another strategic trade that demonstrates the sophisticated approach managers take to roster construction. This latest deal focuses on addressing depth concerns while maintaining long-term upside potential.\n\n**Trade Philosophy:**\nThis transaction exemplifies the RABKL philosophy of balancing immediate needs with future considerations. Both teams have identified opportunities to improve their roster construction while maintaining flexibility for future moves.\n\n**Competitive Balance:**\nThe active trade market in the RABKL ensures that competitive balance is maintained throughout the season. Teams that fall behind early have opportunities to retool, while contending teams can address specific weaknesses to strengthen their championship push.\n\n**Manager Expertise:**\nThe level of analysis and strategic thinking that goes into RABKL trades is evident in this latest transaction. Both managers have clearly identified value and opportunity that aligns with their team's specific needs and long-term goals.\n\n**League Dynamics:**\nThis trade adds another layer to the complex web of team relationships and strategic positioning within the RABKL. As teams continue to evolve their rosters, the competitive landscape becomes increasingly dynamic and unpredictable.\n\nThe RABKL trade market remains one of the most active and sophisticated in fantasy basketball, with managers consistently finding creative ways to improve their teams and pursue championship glory.",
        "author": "RABKL Newsroom",
        "timestamp": "2025-09-18T17:27:00Z",
        "category": "trade",
        "tags": ["trade", "depth", "upside", "competition"],
        "id": "trade_wire_depth_upside_2025",
        "published": true
      }
    ];
    
    sampleArticles.forEach(article => {
      articlesCache.push(article);
    });
    
    console.log(`Initialized with ${articlesCache.length} sample articles`);
  }
}
