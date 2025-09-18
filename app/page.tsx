import ArticleCard from "@/components/ArticleCard";

// naive file-based content reader (placeholder). In production, you'd read markdown/MDX or CMS.
// For now, we mirror the content structure Manus expects.
import fs from 'node:fs';
import path from 'node:path';

function readPosts() {
  const base = path.join(process.cwd(), 'content');
  if (!fs.existsSync(base)) return [];
  // crawl YYYY/MM/DD folders and load .json/.md metadata from front-matter (simplified here)
  const posts: any[] = [];
  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      if (e.isFile() && e.name.endsWith(".json")) {
        try {
          const data = JSON.parse(fs.readFileSync(p, "utf8"));
          posts.push(data);
        } catch {}
      }
    }
  }
  walk(base);
  // sort newest first
  posts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export default function Home() {
  const posts = readPosts();
  const featured = posts.find(p =>
    (p.tags ?? []).includes("trade") && (String(p.title ?? "").toLowerCase().includes("blockbuster") || (p.tags ?? []).includes("Breaking"))
  ) ?? posts[0];
  const rest = posts.filter(p => p !== featured).slice(0, 20);

  return (
    <>
      {/* League Ticker */}
      <section className="mb-6 rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden">
        <div className="bg-brand-red text-white px-4 py-2 text-sm font-semibold tracking-wide">League Ticker</div>
        <div className="max-h-14 overflow-hidden whitespace-nowrap py-2">
          <div className="animate-scroll flex gap-8 px-4 text-sm">
            {posts.slice(0, 15).map((p, i) => (
              <a key={i} href={`/${p.slug ?? ""}`} className="hover:underline decoration-brand-red underline-offset-4">{p.title}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="grid md:grid-cols-2 gap-6 mb-10">
          <article className="rounded-2xl overflow-hidden bg-white shadow-card ring-1 ring-black/5">
            {featured?.hero_image && <img src={featured.hero_image} alt={featured.title} className="h-64 w-full object-cover" />}
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-brand-red px-3 py-1 text-white text-xs font-semibold shadow-[0_0_0_2px_rgba(210,30,43,0.18)]">Featured</span>
                {featured?.date && <span className="text-xs text-black/60">{new Date(featured.date).toLocaleString()}</span>}
              </div>
              <h2 className="text-2xl font-bold leading-tight"><a href={`/${featured.slug ?? ""}`} className="hover:underline">{featured.title}</a></h2>
              <div className="flex gap-2 flex-wrap">
                {(featured.tags ?? []).map((t: string) => <span key={t} className="rounded-full bg-brand-redSoft text-brand-navy border border-brand-red/30 px-2 py-0.5 text-[11px]">{t}</span>)}
              </div>
            </div>
          </article>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rest.slice(0, 4).map((p, i) => <ArticleCard key={i} post={p} breaking={(p.tags ?? []).includes("Breaking")} />)}
          </div>
        </section>
      )}

      {/* Latest grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.slice(4, 4 + 15).map((p, i) => <ArticleCard key={i} post={p} breaking={(p.tags ?? []).includes("Breaking")} />)}
      </section>
    </>
  );
}
