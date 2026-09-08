import { describe, expect, it } from "vitest";

import { applyFeesAndVat, calculateProformaBreakdown } from "@/lib/engine/pricing";

describe("calculateProformaBreakdown", () => {
  it("applies the default 15% Ethiopian VAT with no platform fee", () => {
    expect(calculateProformaBreakdown(100, 1000)).toEqual({
      baseSubtotal: 100_000,
      platformFee: 0,
      tax: 15_000,
      grandTotal: 115_000,
    });
  });

  it("charges VAT on the platform fee as well as the goods", () => {
    const result = calculateProformaBreakdown(100, 1000, 5, 15);

    expect(result.baseSubtotal).toBe(100_000);
    expect(result.platformFee).toBe(5_000);
    expect(result.tax).toBe(15_750);
    expect(result.grandTotal).toBe(120_750);
  });

  it("supports a VAT-exempt configuration", () => {
    expect(calculateProformaBreakdown(10, 250, 0, 0)).toEqual({
      baseSubtotal: 2_500,
      platformFee: 0,
      tax: 0,
      grandTotal: 2_500,
    });
  });

  it("always produces components that sum to the total", () => {
    const awkwardCases: Array<[number, number]> = [
      [3, 333.33],
      [7, 1_234.56],
      [11, 0.07],
      [999, 19.99],
      [1, 0.01],
    ];

    for (const [qty, unitPrice] of awkwardCases) {
      const { baseSubtotal, platformFee, tax, grandTotal } =
        calculateProformaBreakdown(qty, unitPrice, 2.5, 15);

      expect(baseSubtotal + platformFee + tax).toBeCloseTo(grandTotal, 10);
    }
  });

  it("returns amounts already rounded to whole cents", () => {
    const result = calculateProformaBreakdown(3, 333.33, 2.5, 15);

    for (const amount of Object.values(result)) {
      expect(amount).toBe(Math.round(amount * 100) / 100);
    }
  });

  it("handles a zero quantity without producing NaN", () => {
    expect(calculateProformaBreakdown(0, 1000)).toEqual({
      baseSubtotal: 0,
      platformFee: 0,
      tax: 0,
      grandTotal: 0,
    });
  });

  it("is deterministic, so a repeated preview cannot drift", () => {
    const first = calculateProformaBreakdown(37, 1_234.56, 3, 15);
    const second = calculateProformaBreakdown(37, 1_234.56, 3, 15);

    expect(first).toEqual(second);
  });
});

describe("applyFeesAndVat", () => {
  it("matches the single-line calculation for an equivalent subtotal", () => {
    expect(applyFeesAndVat(100_000, 5, 15)).toEqual(
      calculateProformaBreakdown(100, 1000, 5, 15)
    );
  });

  it("rounds a multi-line subtotal before applying fees", () => {
    // A cart total accumulated from several already-rounded item subtotals can
    // carry floating point noise; it must not leak into the VAT figure.
    const result = applyFeesAndVat(0.1 + 0.2, 0, 15);

    expect(result.baseSubtotal).toBe(0.3);
    expect(result.tax).toBe(0.05);
    expect(result.grandTotal).toBe(0.35);
  });

  it("keeps the lines adding up to the total", () => {
    const { baseSubtotal, platformFee, tax, grandTotal } = applyFeesAndVat(
      48_271.37,
      2.5,
      15
    );

    expect(baseSubtotal + platformFee + tax).toBeCloseTo(grandTotal, 10);
  });
});
