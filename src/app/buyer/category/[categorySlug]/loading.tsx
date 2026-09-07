export default function CategoryLoading() {
  return (
    <div className="space-y-6 animate-pulse w-full max-w-full overflow-hidden">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 rounded bg-muted/60" />
        <div className="h-4 w-4 rounded bg-muted/40" />
        <div className="h-4 w-32 rounded bg-muted/70" />
      </div>

      {/* Category switcher tabs skeleton */}
      <div className="flex gap-2 overflow-hidden py-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-7 w-24 shrink-0 rounded-full bg-muted/50" />
        ))}
      </div>

      {/* Header skeleton */}
      <div className="space-y-2 border-b border-border/40 pb-4">
        <div className="h-8 w-60 rounded bg-muted/70" />
        <div className="h-4 w-96 max-w-full rounded bg-muted/40" />
      </div>

      {/* Toolbar skeleton */}
      <div className="h-14 rounded-2xl border border-border/60 bg-card/60" />

      {/* Product cards grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-2xl border border-border/50 bg-card/60 p-4 space-y-3"
          >
            <div className="h-32 rounded-xl bg-muted/40" />
            <div className="h-4 w-3/4 rounded bg-muted/60" />
            <div className="h-3 w-1/2 rounded bg-muted/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
