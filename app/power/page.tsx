import fs from 'node:fs';
import path from 'node:path';

export default function Power() {
  const base = path.join(process.cwd(), 'content');
  let latest: any = null;
  // Look for a latest power rankings json (simplified)
  const candidate = path.join(base, 'latest-power.json');
  if (fs.existsSync(candidate)) {
    try { latest = JSON.parse(fs.readFileSync(candidate, 'utf8')); } catch {}
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Power Rankings</h1>
      {latest ? (
        <article className="prose max-w-none">
          <h2 className="text-xl font-semibold">{latest.title}</h2>
          {latest?.date && <p className="text-sm text-black/60">{new Date(latest.date).toLocaleString()}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-brand-red text-white">
                <tr>
                  <th className="px-3 py-2 text-left">Rank</th>
                  <th className="px-3 py-2 text-left">Team</th>
                  <th className="px-3 py-2 text-left">GM</th>
                  <th className="px-3 py-2 text-left">Trend</th>
                  <th className="px-3 py-2 text-left">Why</th>
                </tr>
              </thead>
              <tbody>
                {(latest.rows ?? []).map((r: any, i: number) => (
                  <tr key={i} className="odd:bg-white even:bg-brand-redSoft/40">
                    <td className="px-3 py-2">{r.rank}</td>
                    <td className="px-3 py-2">{r.team}</td>
                    <td className="px-3 py-2">{r.gm}</td>
                    <td className="px-3 py-2">{r.trend}</td>
                    <td className="px-3 py-2">{r.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      ) : <p>No rankings yet.</p>}
    </div>
  );
}
