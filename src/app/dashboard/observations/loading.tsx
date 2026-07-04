export default function LoadingObservations() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-56 animate-pulse rounded-2xl bg-emerald-950/50" />
      <div className="h-14 w-full animate-pulse rounded-2xl bg-emerald-950/50" />
      <div className="overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#08140e]/90">
        <div className="h-12 animate-pulse bg-emerald-950/50" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse border-t border-emerald-900/60 bg-[#0d1d14]" />
        ))}
      </div>
    </div>
  );
}
