"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Panel that slides in from an edge, built on the same Dialog primitive as
 * {@link ./dialog.tsx} and therefore inheriting the same focus trap, Escape
 * handling and scroll lock. Used for the cart and for navigation on phones,
 * where a centred dialog would waste most of the screen.
 */
const Sheet = DialogPrimitive.Root
const SheetTrigger = DialogPrimitive.Trigger
const SheetClose = DialogPrimitive.Close

const SIDE_CLASSES = {
  right:
    "inset-y-0 right-0 h-full w-[min(26rem,calc(100vw-2rem))] border-l data-starting-style:translate-x-full data-ending-style:translate-x-full",
  left: "inset-y-0 left-0 h-full w-[min(26rem,calc(100vw-2rem))] border-r data-starting-style:-translate-x-full data-ending-style:-translate-x-full",
  bottom:
    "inset-x-0 bottom-0 max-h-[85svh] w-full rounded-t-2xl border-t data-starting-style:translate-y-full data-ending-style:translate-y-full",
  top: "inset-x-0 top-0 max-h-[85svh] w-full rounded-b-2xl border-b data-starting-style:-translate-y-full data-ending-style:-translate-y-full",
} as const

interface SheetContentProps extends DialogPrimitive.Popup.Props {
  side?: keyof typeof SIDE_CLASSES
  hideClose?: boolean
  closeLabel?: string
}

function SheetContent({
  className,
  children,
  side = "right",
  hideClose = false,
  closeLabel = "Close panel",
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px]",
          "transition-opacity duration-200 ease-[var(--ease-out-quint)]",
          "data-starting-style:opacity-0 data-ending-style:opacity-0"
        )}
      />
      <DialogPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col bg-card text-card-foreground shadow-xl outline-none",
          "transition-transform duration-250 ease-[var(--ease-out-quint)]",
          SIDE_CLASSES[side],
          className
        )}
        {...props}
      >
        {children}

        {!hideClose && (
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className={cn(
              "absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-lg",
              "text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            )}
          >
            <XIcon className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "flex shrink-0 flex-col gap-1 border-b border-border px-5 py-4 pr-14",
        className
      )}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "shrink-0 border-t border-border px-5 py-4",
        // Keeps the checkout button above the iOS home indicator.
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-base font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
