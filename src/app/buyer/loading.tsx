export default function BuyerLoading() {
  return (
    <div className="space-y-8 sm:space-y-10 w-full max-w-full overflow-hidden animate-pulse">
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-8 h-48 sm:h-56" />

      {/* Categories header skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 rounded bg-muted/70" />
          <div className="h-4 w-28 rounded bg-muted/50" />
        </div>

        {/* 12 categories 3-column grid skeleton */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/50 bg-card/60 p-2 sm:p-3.5 min-h-[100px] sm:min-h-[130px] flex flex-col items-center justify-between"
            >
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-muted/60" />
              <div className="h-3 w-16 rounded bg-muted/50 mt-2" />
              <div className="h-2.5 w-10 rounded-full bg-muted/40 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
