import { NextResponse } from 'next/server';
import {
  fetchCurrentTransactions,
  fetchLeagueContext,
  resolveTransaction,
  txTime,
  toIso,
} from '../../../../lib/rabklLive.js';

export const dynamic = 'force-dynamic';

const CLUSTER_WINDOW_MS = 60 * 60 * 1000;
const MAX_EVENTS = 60;

function rosterSet(tx) {
  const ids = new Set((tx?.roster_ids || []).map(Number));
  for (const rid of Object.values(tx?.adds || {})) ids.add(Number(rid));
  for (const rid of Object.values(tx?.drops || {})) ids.add(Number(rid));
  for (const pick of tx?.draft_picks || []) {
    if (pick?.owner_id != null) ids.add(Number(pick.owner_id));
    if (pick?.previous_owner_id != null) ids.add(Number(pick.previous_owner_id));
  }
  return new Set([...ids].filter(Number.isFinite));
}

function sharesRoster(a, b) {
  for (const id of a) if (b.has(id)) return true;
  return false;
}

function clusterType(events) {
  const types = new Set(events.map((e) => e.type));
  if (types.has('trade') && events.length > 1) return 'trade_followup';
  if (types.size === 1 && types.has('trade')) return 'trade';
  if (events.length >= 3) return 'transaction_burst';
  return 'related_transactions';
}

export async function GET() {
  const checkedAt = new Date().toISOString();

  try {
    const [transactions, context] = await Promise.all([
      fetchCurrentTransactions(),
      fetchLeagueContext(),
    ]);

    const completed = transactions
      .filter((tx) => tx?.status === 'complete')
      .slice(0, MAX_EVENTS)
      .map((tx) => ({ tx, time: txTime(tx), rosters: rosterSet(tx) }));

    const visited = new Set();
    const clusters = [];

    for (let i = 0; i < completed.length; i++) {
      if (visited.has(i)) continue;
      const members = [i];
      visited.add(i);

      let changed = true;
      while (changed) {
        changed = false;
        for (let j = 0; j < completed.length; j++) {
          if (visited.has(j)) continue;
          const candidate = completed[j];
          const links = members.some((idx) => {
            const member = completed[idx];
            return (
              Math.abs(member.time - candidate.time) <= CLUSTER_WINDOW_MS &&
              sharesRoster(member.rosters, candidate.rosters)
            );
          });
          if (links) {
            visited.add(j);
            members.push(j);
            changed = true;
          }
        }
      }

      const rawEvents = members
        .map((idx) => completed[idx])
        .sort((a, b) => a.time - b.time);
      const resolved = rawEvents.map(({ tx }) => resolveTransaction(tx, context));
      const first = rawEvents[0]?.time || 0;
      const last = rawEvents[rawEvents.length - 1]?.time || 0;

      clusters.push({
        cluster_type: clusterType(resolved),
        opened_at: toIso(first),
        last_event_at: toIso(last),
        event_count: resolved.length,
        events: resolved,
        source_scope: 'documented_public_sleeper_transactions',
      });
    }

    clusters.sort((a, b) => Date.parse(b.last_event_at || 0) - Date.parse(a.last_event_at || 0));

    return NextResponse.json({
      success: true,
      freshness: {
        status: 'fresh',
        sleeper_checked_at: checkedAt,
      },
      cluster_window_minutes: CLUSTER_WINDOW_MS / 60000,
      clusters: clusters.slice(0, 10),
      limitation:
        'Native Trade Block history is not included because the documented public Sleeper transaction API does not expose authoritative Trade Block events. A separate state-diff/authenticated ingestion source should feed those events into the same cluster model.',
    });
  } catch (error) {
    console.error('RABKL recent-clusters refresh failed:', error);
    return NextResponse.json(
      {
        success: false,
        freshness: { status: 'unavailable', sleeper_checked_at: checkedAt },
        error: 'Live Sleeper event state could not be refreshed.',
      },
      { status: 503 }
    );
  }
}
