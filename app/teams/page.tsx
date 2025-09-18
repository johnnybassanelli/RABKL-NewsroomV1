import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';

export default function Teams() {
  const base = path.join(process.cwd(), 'content');
  const teams = new Set<string>();
  function collect(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) collect(p);
      if (e.isFile() && e.name.endsWith(".json")) {
        try {
          const data = JSON.parse(fs.readFileSync(p, "utf8"));
          for (const t of (data.tags ?? [])) {
            if (!["trade","RABKL","power-rankings","roundup","wrap"].includes(t)) teams.add(t);
          }
        } catch {}
      }
    }
  }
  collect(base);
  const list = Array.from(teams).sort();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teams</h1>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((team) => (
          <li key={team} className="rounded-2xl bg-white ring-1 ring-black/5 p-4 hover:-translate-y-0.5 transition">
            <Link href={`/teams/${encodeURIComponent(team)}`} className="font-semibold">{team}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
