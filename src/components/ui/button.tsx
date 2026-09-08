import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Sizing note: the previous scale topped out at 32px for the default button
 * and went down to 24px, which is below every published touch guideline and
 * unusable for the people this app is built for — contractors and yard staff
 * tapping a phone outdoors, often with dusty hands. The floor is now 32px for
 * the densest table affordances, 40px for ordinary buttons, and 44px for the
 * primary action on a page.
 */
const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding",
    "font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-[var(--ease-out-quint)]",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "active:not-aria-[haspopup]:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:bg-input/25 dark:hover:bg-input/40",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted",
        // Tinted: used for reversible destructive actions sitting in a list.
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:outline-destructive",
        // Solid: reserved for the confirming button of a destructive dialog,
        // where the weight should match the consequence.
        danger:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:outline-destructive",
        success: "bg-success text-success-foreground shadow-xs hover:bg-success/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-8 gap-1.5 rounded-md px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-9 gap-1.5 px-3 text-sm",
        default: "h-10 gap-2 px-4 text-sm",
        lg: "h-11 gap-2 px-5 text-base",
        icon: "size-10",
        "icon-xs": "size-8 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
      /**
       * Extends the tappable area beyond the painted box without changing
       * layout, for icon buttons that must stay visually small inside a dense
       * table row but still be hittable with a thumb.
       */
      tapTarget: {
        true: "after:absolute after:left-1/2 after:top-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      tapTarget: false,
    },
  }
)

interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  /** Shows a spinner, hides the label from view, and blocks further clicks. */
  loading?: boolean
  /** Announced while `loading` is true. */
  loadingLabel?: string
}

function Button({
  className,
  variant = "default",
  size = "default",
  tapTarget = false,
  loading = false,
  loadingLabel = "Working…",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, tapTarget, className }))}
      {...props}
    >
      {loading ? (
        <>
          <Loader2Icon className="animate-spin" aria-hidden="true" />
          <span className="sr-only">{loadingLabel}</span>
          {/* The label keeps its space so the button does not resize and shift
              whatever sits next to it while the request is in flight. */}
          <span aria-hidden="true" className="contents">
            {children}
          </span>
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
