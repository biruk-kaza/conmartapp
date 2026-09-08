import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Busy indicator for buttons and inline regions.
 *
 * Decorative by default: a button that swaps its label to "Submitting…" has
 * already said so in text, and a second announcement is redundant. Pass a
 * `label` where the spinner is the only signal.
 */
function Spinner({
  className,
  label,
  ...props
}: React.ComponentProps<"svg"> & { label?: string }) {
  return (
    <>
      <Loader2Icon
        data-slot="spinner"
        aria-hidden="true"
        className={cn("size-4 animate-spin", className)}
        {...props}
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </>
  )
}

export { Spinner }
