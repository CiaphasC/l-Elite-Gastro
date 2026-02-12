import { describe, expect, it } from "vitest";
import { convertUsdToCurrency, formatCurrencyFromUsd } from "@/domain/currency";

describe("currency helpers", () => {
  it("converts from USD to selected currencies", () => {
    expect(convertUsdToCurrency(10, "USD")).toBe(10);
    expect(convertUsdToCurrency(10, "MXN")).toBeGreaterThan(100);
    expect(convertUsdToCurrency(10, "ARS")).toBeGreaterThan(1000);
  });

  it("formats values with the selected currency", () => {
    const mxnFormatted = formatCurrencyFromUsd(25, "MXN");
    const usdFormatted = formatCurrencyFromUsd(25, "USD");

    expect(typeof mxnFormatted).toBe("string");
    expect(mxnFormatted.length).toBeGreaterThan(0);
    expect(mxnFormatted).not.toBe(usdFormatted);
  });
});
