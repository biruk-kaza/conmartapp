import { describe, expect, it } from "vitest";

import { roundCurrency } from "@/lib/money";

describe("roundCurrency", () => {
  it("leaves an amount that is already exact alone", () => {
    expect(roundCurrency(1234.56)).toBe(1234.56);
  });

  it("rounds a half cent up rather than down", () => {
    // 1.005 is stored as 1.00499999999999989, so a naive
    // Math.round(value * 100) / 100 yields 1.00 here.
    expect(roundCurrency(1.005)).toBe(1.01);
    expect(roundCurrency(2.675)).toBe(2.68);
  });

  it("removes accumulated floating point error", () => {
    expect(roundCurrency(0.1 + 0.2)).toBe(0.3);
  });

  it("rounds below a half cent down", () => {
    expect(roundCurrency(1.004)).toBe(1.0);
  });

  it("preserves zero and negative amounts", () => {
    expect(roundCurrency(0)).toBe(0);
    expect(roundCurrency(-1.005)).toBe(-1.01);
  });

  it("refuses non-finite input instead of returning NaN downstream", () => {
    expect(() => roundCurrency(Number.NaN)).toThrow(RangeError);
    expect(() => roundCurrency(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});
