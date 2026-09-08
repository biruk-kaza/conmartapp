"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  Loader2Icon,
  XCircleIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Application-wide transient feedback.
 *
 * Before this existed, every screen invented its own `setSuccessMsg` /
 * `setErrorMsg` string rendered somewhere in the page body. That fails in the
 * two cases that matter most here: the confirmation of an action taken inside
 * a dialog that then closes, and any message that lands above the fold while
 * the user is looking further down a long enquiry list. Toasts survive both,
 * and the primitive announces them to a screen reader.
 */
const toastManager = ToastPrimitive.createToastManager()

type ToastVariant = "success" | "error" | "warning" | "info"

interface ToastOptions {
  description?: React.ReactNode
  /** Milliseconds on screen. `0` keeps it up until dismissed. */
  timeout?: number
}

function emit(variant: ToastVariant, title: React.ReactNode, options?: ToastOptions) {
  return toastManager.add({
    title,
    description: options?.description,
    type: variant,
    // Errors stay up longer: they usually describe something the user has to
    // read and act on, not something they already know they did.
    timeout: options?.timeout ?? (variant === "error" ? 8000 : 5000),
    priority: variant === "error" ? "high" : "low",
  })
}

export const toast = {
  success: (title: React.ReactNode, options?: ToastOptions) => emit("success", title, options),
  error: (title: React.ReactNode, options?: ToastOptions) => emit("error", title, options),
  warning: (title: React.ReactNode, options?: ToastOptions) => emit("warning", title, options),
  info: (title: React.ReactNode, options?: ToastOptions) => emit("info", title, options),
  dismiss: (id?: string) => toastManager.close(id),
}

const VARIANT_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2Icon,
  error: XCircleIcon,
  warning: AlertTriangleIcon,
  info: InfoIcon,
  loading: Loader2Icon,
}

const VARIANT_ICON_CLASS: Record<string, string> = {
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
  info: "text-info",
  loading: "text-muted-foreground animate-spin",
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((item) => {
    const variant = item.type ?? "info"
    const Icon = VARIANT_ICON[variant] ?? InfoIcon

    return (
      <ToastPrimitive.Root
        key={item.id}
        toast={item}
        className={cn(
          "absolute inset-x-0 bottom-0 z-[calc(1000-var(--toast-index))]",
          "flex gap-3 rounded-xl border border-border bg-popover p-4 pr-11 text-popover-foreground shadow-lg",
          // Stacked cards fan out on hover; Base UI supplies the offset vars.
          "[transform:translateY(calc(var(--toast-offset-y)*-1))_scale(calc(1-(var(--toast-index)*0.05)))]",
          "transition-all duration-250 ease-[var(--ease-out-quint)]",
          "data-expanded:[transform:translateY(calc(var(--toast-offset-y)*-1))]",
          "data-starting-style:translate-y-full data-starting-style:opacity-0",
          "data-ending-style:translate-y-full data-ending-style:opacity-0",
          "data-limited:opacity-0"
        )}
      >
        <Icon className={cn("mt-0.5 size-5 shrink-0", VARIANT_ICON_CLASS[variant])} />

        <div className="flex min-w-0 flex-col gap-0.5">
          <ToastPrimitive.Title className="text-sm font-semibold leading-snug" />
          <ToastPrimitive.Description className="text-sm leading-snug text-muted-foreground" />
        </div>

        <ToastPrimitive.Close
          aria-label="Dismiss notification"
          className={cn(
            "absolute right-2.5 top-2.5 inline-flex size-8 items-center justify-center rounded-lg",
            "text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          )}
        >
          <XIcon className="size-4" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
    )
  })
}

/** Wraps the app so `toast.*` can be called from any client component. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider toastManager={toastManager}>
      {children}

      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          className={cn(
            "fixed z-100 flex w-[calc(100vw-2rem)] max-w-sm",
            // Bottom-centre on a phone, where the top of the screen is behind
            // the browser chrome and the thumb cannot reach a dismiss button.
            "bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2",
            "sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
          )}
        >
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  )
}
