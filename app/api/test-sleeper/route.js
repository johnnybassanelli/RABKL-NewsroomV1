// Test endpoint to verify Sleeper API integration on Vercel
import { NextResponse } from 'next/server';

const LEAGUE_ID = '1228186433580171264';
const BASE_URL = 'https://api.sleeper.app/v1';

export async function GET() {
  try {
    // Test basic Sleeper API call
    const response = await fetch(`${BASE_URL}/league/${LEAGUE_ID}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const leagueData = await response.json();
    
    // Test users call
    const usersResponse = await fetch(`${BASE_URL}/league/${LEAGUE_ID}/users`);
    const users = usersResponse.ok ? await usersResponse.json() : [];
    
    return NextResponse.json({
      success: true,
      message: 'Sleeper API integration working',
      league_name: leagueData.name,
      sport: leagueData.sport,
      season: leagueData.season,
      total_rosters: leagueData.total_rosters,
      user_count: users.length,
      sample_teams: users.slice(0, 3).map(u => ({
        username: u.username,
        display_name: u.display_name,
        team_name: u.metadata?.team_name || `Team ${u.username}`
      })),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Sleeper API test error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Sleeper API test failed', 
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
