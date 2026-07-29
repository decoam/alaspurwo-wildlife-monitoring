export default function LoadingObservations() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-56 animate-pulse rounded-2xl bg-brand-primary/50" />
      <div className="h-14 w-full animate-pulse rounded-2xl bg-brand-primary/50" />
      <div className="overflow-hidden rounded-2xl border border-brand-primary/60 bg-surface-card/90">
        <div className="h-12 animate-pulse bg-brand-primary/50" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse border-t border-brand-primary/60 bg-hover-bg" />
        ))}
      </div>
    </div>
  );
}
