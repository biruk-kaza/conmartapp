// =============================================================================
// ConMart — Error Boundaries Between Domain and Infrastructure Failures
// =============================================================================
// Domain rules ("insufficient balance", "enquiry already accepted") are safe to
// show a user. Infrastructure failures are not: driver and query errors leak
// table names, column names, and connection details.
//
// Throw `DomainError` for the former; everything else is reported generically.
// =============================================================================

/** A rule violation whose message is safe to display to the caller. */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

/**
 * Converts a caught value into a message safe to return over the wire.
 * Unexpected errors are logged with `context` and replaced with `fallback`.
 */
export function toSafeErrorMessage(
  error: unknown,
  context: string,
  fallback = "Something went wrong. Please try again."
): string {
  if (error instanceof DomainError) {
    return error.message;
  }

  console.error(`[${context}]`, error);
  return fallback;
}
