import * as React from "react"

import { cn } from "@/lib/utils"

// `ComponentProps` rather than `TextareaHTMLAttributes` so `ref` is included:
// React 19 passes it as an ordinary prop, no `forwardRef` wrapper needed.
export type TextareaProps = React.ComponentProps<"textarea">

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full rounded-lg border border-input bg-transparent px-3 py-2",
        // Matches Input: 16px on mobile to stop iOS zooming on focus.
        "text-[1rem] md:text-sm",
        "transition-colors outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40",
        "disabled:cursor-not-allowed disabled:bg-muted/60 disabled:opacity-60",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:bg-input/25",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
