const SLEEPER_BASE = 'https://api.sleeper.app/v1';
export const CURRENT_RABKL_LEAGUE_ID = process.env.RABKL_CURRENT_LEAGUE_ID || '1346941554920546304';

export async function sleeper(path, init = {}) {
  const response = await fetch(`${SLEEPER_BASE}${path}`, {
    ...init,
    headers: { accept: 'application/json', ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`Sleeper ${path} returned ${response.status}`);
  return response.json();
}

export function txTime(tx) {
  return Number(tx?.status_updated || tx?.created || 0);
}

export function toIso(ms) {
  const n = Number(ms || 0);
  return n > 0 ? new Date(n).toISOString() : null;
}

export async function fetchLeagueContext() {
  const [rosters, users, players] = await Promise.all([
    sleeper(`/league/${CURRENT_RABKL_LEAGUE_ID}/rosters`, { cache: 'no-store' }),
    sleeper(`/league/${CURRENT_RABKL_LEAGUE_ID}/users`, { cache: 'no-store' }),
    sleeper('/players/nba', { next: { revalidate: 3600 } }),
  ]);
  return { rosters, users, players };
}

export async function fetchCurrentTransactions() {
  // RABKL offseason/current transactions can sit in round 1, while in-season
  // activity spreads across later rounds. Scan a bounded set and dedupe by ID.
  const rounds = Array.from({ length: 25 }, (_, i) => i + 1);
  const results = await Promise.allSettled(
    rounds.map((round) =>
      sleeper(`/league/${CURRENT_RABKL_LEAGUE_ID}/transactions/${round}`, { cache: 'no-store' })
    )
  );

  const byId = new Map();
  for (const result of results) {
    if (result.status !== 'fulfilled' || !Array.isArray(result.value)) continue;
    for (const tx of result.value) {
      if (!tx) continue;
      const key = String(tx.transaction_id || `${txTime(tx)}:${JSON.stringify(tx.roster_ids || [])}`);
      if (!byId.has(key)) byId.set(key, tx);
    }
  }

  return [...byId.values()].sort((a, b) => txTime(b) - txTime(a));
}

export function makeResolvers(rosters, users, players) {
  const userById = new Map((users || []).map((u) => [String(u.user_id), u]));
  const rosterById = new Map((rosters || []).map((r) => [Number(r.roster_id), r]));

  function team(rosterId) {
    const roster = rosterById.get(Number(rosterId));
    const owner = roster?.owner_id != null ? userById.get(String(roster.owner_id)) : null;
    return {
      team_name:
        owner?.metadata?.team_name ||
        roster?.metadata?.team_name ||
        owner?.display_name ||
        owner?.username ||
        'Unassigned franchise',
      gm: owner?.display_name || owner?.username || null,
    };
  }

  function player(playerId) {
    const p = players?.[String(playerId)];
    return (
      p?.full_name ||
      [p?.first_name, p?.last_name].filter(Boolean).join(' ') ||
      'Unresolved player'
    );
  }

  function pick(p) {
    const original = team(p.roster_id);
    const round = Number(p.round);
    const suffix = round === 1 ? '1st' : round === 2 ? '2nd' : round === 3 ? '3rd' : `${round}th`;
    return {
      label: `${p.season} ${suffix} — originally ${original.team_name}`,
      season: String(p.season),
      round,
      original_team: original.team_name,
      original_gm: original.gm,
    };
  }

  return { team, player, pick };
}

export function resolveTransaction(tx, context) {
  const { team, player, pick } = makeResolvers(context.rosters, context.users, context.players);
  const rosterIds = new Set((tx.roster_ids || []).map(Number));

  for (const value of Object.values(tx.adds || {})) rosterIds.add(Number(value));
  for (const value of Object.values(tx.drops || {})) rosterIds.add(Number(value));
  for (const p of tx.draft_picks || []) {
    if (p.owner_id != null) rosterIds.add(Number(p.owner_id));
    if (p.previous_owner_id != null) rosterIds.add(Number(p.previous_owner_id));
  }

  const sides = [...rosterIds]
    .filter(Number.isFinite)
    .map((rosterId) => {
      const identity = team(rosterId);
      return {
        team_name: identity.team_name,
        gm: identity.gm,
        received: {
          players: Object.entries(tx.adds || {})
            .filter(([, rid]) => Number(rid) === rosterId)
            .map(([pid]) => player(pid)),
          picks: (tx.draft_picks || [])
            .filter((p) => Number(p.owner_id) === rosterId)
            .map(pick),
        },
        sent: {
          players: Object.entries(tx.drops || {})
            .filter(([, rid]) => Number(rid) === rosterId)
            .map(([pid]) => player(pid)),
          picks: (tx.draft_picks || [])
            .filter((p) => Number(p.previous_owner_id) === rosterId)
            .map(pick),
        },
      };
    });

  return {
    type: tx.type,
    status: tx.status,
    completed_at: toIso(txTime(tx)),
    participant_count: sides.length,
    sides,
  };
}
