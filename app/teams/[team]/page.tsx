import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';

export default function TeamPage({ params }: { params: { team: string }}) {
  const team = decodeURIComponent(params.team);
  const base = path.join(process.cwd(), 'content');
  const posts: any[] = [];
  function collect(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) collect(p);
      if (e.isFile() && e.name.endsWith(".json")) {
        try {
          const data = JSON.parse(fs.readFileSync(p, "utf8"));
          if ((data.tags ?? []).includes(team)) posts.push(data);
        } catch {}
      }
    }
  }
  collect(base);
  posts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{team}</h1>
      {posts.length ? (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((p, i) => (
            <li key={i} className="rounded-2xl bg-white ring-1 ring-black/5 p-4">
              <Link href={`/${p.slug ?? ""}`} className="font-semibold hover:underline">{p.title}</Link>
              {p?.date && <p className="text-xs text-black/60">{new Date(p.date).toLocaleDateString()}</p>}
            </li>
          ))}
        </ul>
      ) : <p>No posts yet for this team.</p>}
    </div>
  );
}
