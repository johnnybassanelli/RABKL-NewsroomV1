import { NextResponse } from 'next/server';
import {
  fetchCurrentTransactions,
  fetchLeagueContext,
  resolveTransaction,
} from '../../../../lib/rabklLive.js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checkedAt = new Date().toISOString();

  try {
    const [transactions, context] = await Promise.all([
      fetchCurrentTransactions(),
      fetchLeagueContext(),
    ]);

    const latestTrade = transactions.find(
      (tx) => tx?.type === 'trade' && tx?.status === 'complete'
    );

    return NextResponse.json({
      success: true,
      freshness: {
        status: 'fresh',
        sleeper_checked_at: checkedAt,
      },
      latest_trade: latestTrade ? resolveTransaction(latestTrade, context) : null,
    });
  } catch (error) {
    console.error('RABKL latest-trade refresh failed:', error);
    return NextResponse.json(
      {
        success: false,
        freshness: {
          status: 'unavailable',
          sleeper_checked_at: checkedAt,
        },
        error: 'Live Sleeper state could not be refreshed; stale data is not being presented as current.',
      },
      { status: 503 }
    );
  }
}
