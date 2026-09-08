"use client"

import * as React from "react"
import { AlertCircleIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FieldProps extends Omit<React.ComponentProps<"div">, "children"> {
  label?: React.ReactNode
  /** Guidance shown under the label, before the control. */
  hint?: React.ReactNode
  /** Validation message. Its presence marks the control invalid. */
  error?: React.ReactNode
  /** Appends a required marker to the label and sets `aria-required`. */
  required?: boolean
  /** Exactly one form control. */
  children: React.ReactElement<Record<string, unknown>>
}

/**
 * Wires a label, hint and validation message to a form control.
 *
 * This exists because doing it by hand was going wrong consistently: labels
 * were rendered next to inputs without `htmlFor`, and error text sat in a
 * sibling `<p>` that no assistive technology connected to the field. Someone
 * using a screen reader heard "edit, blank" and no reason for the rejection.
 *
 * Ids are generated and the control is cloned with `id`, `aria-describedby`,
 * `aria-invalid` and `aria-required`. Cloning keeps the call site to the
 * markup that actually matters, at the cost of requiring a single child that
 * forwards its props to a real form element — which is true of the `Input`,
 * `Textarea` and native `select` elements used across this app.
 */
function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
  ...props
}: FieldProps) {
  const reactId = React.useId()
  const controlId = (children.props.id as string | undefined) ?? `${reactId}-control`
  const hintId = `${reactId}-hint`
  const errorId = `${reactId}-error`

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined

  const control = React.cloneElement(children, {
    id: controlId,
    "aria-describedby":
      [children.props["aria-describedby"] as string | undefined, describedBy]
        .filter(Boolean)
        .join(" ") || undefined,
    "aria-invalid": error ? true : (children.props["aria-invalid"] as boolean | undefined),
    "aria-required": required || undefined,
  })

  return (
    <div data-slot="field" className={cn("space-y-1.5", className)} {...props}>
      {label ? (
        <Label htmlFor={controlId} className="flex items-center gap-1">
          {label}
          {required ? (
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>
      ) : null}

      {hint ? (
        <p id={hintId} className="text-xs leading-snug text-muted-foreground">
          {hint}
        </p>
      ) : null}

      {control}

      {error ? (
        // `role="alert"` so the message is announced when it appears after a
        // failed submit, rather than only being found by someone who happens
        // to navigate back to the field.
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 text-xs font-medium text-destructive"
        >
          <AlertCircleIcon className="mt-px size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}

export { Field }
