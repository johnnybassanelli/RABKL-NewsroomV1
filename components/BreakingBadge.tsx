export default function BreakingBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-brand-red px-3 py-1 text-white text-xs font-semibold shadow-[0_0_0_2px_rgba(210,30,43,0.2)]">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white" aria-hidden="true"><path d="M1 21h22L12 2 1 21z"/></svg>
      Breaking
    </span>
  );
}
