import { cn } from "@/lib/utils"

/**
 * Placeholder block shown while server data is in flight.
 *
 * A sweeping highlight rather than `animate-pulse`: a pulse on a dark surface
 * reads as a rendering glitch, whereas a sweep reads as progress. The element
 * is hidden from assistive technology because the surrounding region already
 * announces its busy state, and a screen reader listing a dozen empty boxes is
 * noise.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer",
        "after:bg-gradient-to-r after:from-transparent after:via-foreground/[0.06] after:to-transparent",
        className
      )}
      {...props}
    />
  )
}

/** Placeholder matching the proportions of a listing or enquiry card. */
function SkeletonCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("space-y-3 rounded-xl border border-border bg-card p-4", className)}
      {...props}
    >
      <Skeleton className="aspect-4/3 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

/** Placeholder rows sized to the app's table density. */
function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-9 w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <Skeleton
              key={columnIndex}
              className="h-11 flex-1"
              // Trailing columns are narrower so the block reads as a table
              // rather than as a grid of identical bars.
              style={{ maxWidth: columnIndex === 0 ? undefined : `${90 - columnIndex * 12}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonTable }
