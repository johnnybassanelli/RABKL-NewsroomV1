import BreakingBadge from "./BreakingBadge";
import Link from "next/link";

export default function ArticleCard({ post, breaking = false }: { post: any; breaking?: boolean; }) {
  const href = `/${post.slug ?? post.id ?? ""}`;
  return (
    <article className="rounded-2xl bg-white shadow-card ring-1 ring-black/5 overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(210,30,43,0.15)] transition">
      {post?.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.thumbnail} alt={post.title} className="h-48 w-full object-cover" />
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(post.tags ?? []).slice(0,3).map((t: string) => (
              <span key={t} className="rounded-full bg-brand-redSoft text-brand-navy border border-brand-red/30 px-2 py-0.5 text-[11px]">{t}</span>
            ))}
          </div>
          {breaking && <BreakingBadge />}
        </div>
        <h3 className="text-lg font-semibold leading-snug">
          <Link href={href} className="hover:underline underline-offset-4 decoration-brand-red">{post.title}</Link>
        </h3>
        {post.date && <p className="text-sm text-black/60">{new Date(post.date).toLocaleString()}</p>}
      </div>
    </article>
  );
}
