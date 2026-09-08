import { describe, expect, it } from "vitest";

import { DomainError } from "@/lib/errors";
import {
  calculateRefundAmount,
  splitUnlockPayment,
  totalSpendable,
} from "@/lib/wallet/accounting";

describe("splitUnlockPayment", () => {
  it("spends non-withdrawable credit before withdrawable cash", () => {
    expect(splitUnlockPayment(350, 500, 1000)).toEqual({
      fromCredit: 350,
      fromCash: 0,
    });
  });

  it("falls back to cash once credit is exhausted", () => {
    expect(splitUnlockPayment(350, 100, 1000)).toEqual({
      fromCredit: 100,
      fromCash: 250,
    });
  });

  it("draws entirely from cash when there is no credit", () => {
    expect(splitUnlockPayment(350, 0, 350)).toEqual({
      fromCredit: 0,
      fromCash: 350,
    });
  });

  it("allows a fee that exactly exhausts the combined balance", () => {
    expect(splitUnlockPayment(500, 200, 300)).toEqual({
      fromCredit: 200,
      fromCash: 300,
    });
  });

  it("rejects a fee larger than the combined balance", () => {
    expect(() => splitUnlockPayment(500.01, 200, 300)).toThrow(DomainError);
  });

  it("tells the supplier what they have and what they need", () => {
    expect(() => splitUnlockPayment(500, 100, 50)).toThrow(
      /Available: 150\.00 ETB, required: 500\.00 ETB/
    );
  });

  it("rejects a negative fee, which would credit the wallet", () => {
    expect(() => splitUnlockPayment(-100, 500, 500)).toThrow(DomainError);
  });

  it("never lets the two parts drift from the fee through rounding", () => {
    const { fromCredit, fromCash } = splitUnlockPayment(0.3, 0.1, 1);
    expect(fromCredit + fromCash).toBeCloseTo(0.3, 10);
  });

  it("does not reject an affordable fee because of floating point error", () => {
    // 0.1 + 0.2 is 0.30000000000000004; a naive comparison against a 0.3 fee
    // would pass here but fail for the mirror case, so both are rounded first.
    expect(() => splitUnlockPayment(0.3, 0.1, 0.2)).not.toThrow();
  });
});

describe("calculateRefundAmount", () => {
  it("returns the configured share of the fee", () => {
    expect(calculateRefundAmount(350, 80)).toBe(280);
  });

  it("rounds a fractional share to whole cents", () => {
    expect(calculateRefundAmount(333.33, 80)).toBe(266.66);
  });

  it("supports a full refund", () => {
    expect(calculateRefundAmount(350, 100)).toBe(350);
  });

  it("supports withholding the entire fee", () => {
    expect(calculateRefundAmount(350, 0)).toBe(0);
  });

  it("rejects a percentage above 100, which would refund more than was paid", () => {
    expect(() => calculateRefundAmount(350, 101)).toThrow(DomainError);
  });

  it("rejects a negative percentage", () => {
    expect(() => calculateRefundAmount(350, -1)).toThrow(DomainError);
  });

  it("rejects a negative fee", () => {
    expect(() => calculateRefundAmount(-350, 80)).toThrow(DomainError);
  });
});

describe("totalSpendable", () => {
  it("adds both balances", () => {
    expect(totalSpendable(1000.5, 250.25)).toBe(1250.75);
  });

  it("does not accumulate floating point error", () => {
    expect(totalSpendable(0.1, 0.2)).toBe(0.3);
  });
});
