import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// `title` is omitted from the div props because it would otherwise collide
// with the HTML tooltip attribute, which takes a string rather than a node.
interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
  icon?: LucideIcon
  title: React.ReactNode
  description?: React.ReactNode
  /** Primary next step. An empty screen without one is a dead end. */
  action?: React.ReactNode
}

/**
 * Shown in place of an empty list or table.
 *
 * Screens across the app previously either rendered nothing at all — leaving a
 * blank panel that is indistinguishable from a failed load — or a bare line of
 * text with no way forward. Every empty state now says what belongs here and
 * offers the action that fills it.
 */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className
      )}
      {...props}
    >
      {Icon ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Icon className="size-6 text-muted-foreground" aria-hidden="true" />
        </div>
      ) : null}

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  )
}

export { EmptyState }
