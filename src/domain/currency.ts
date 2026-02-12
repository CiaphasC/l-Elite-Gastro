import currency from "currency.js";
import type { SupportedCurrencyCode } from "@/types";

interface CurrencyOption {
  code: SupportedCurrencyCode;
  label: string;
}

const CURRENCY_LOCALES: Record<SupportedCurrencyCode, string> = {
  ARS: "es-AR",
  UYU: "es-UY",
  COP: "es-CO",
  MXN: "es-MX",
  PEN: "es-PE",
  USD: "en-US",
};

// Tasas base USD para entorno de demo.
const USD_EXCHANGE_RATES: Record<SupportedCurrencyCode, number> = {
  ARS: 1060,
  UYU: 39.4,
  COP: 3980,
  MXN: 17.2,
  PEN: 3.76,
  USD: 1,
};

const formatterCache = new Map<SupportedCurrencyCode, Intl.NumberFormat>();

export const CURRENCY_OPTIONS: readonly CurrencyOption[] = [
  { code: "ARS", label: "Pesos argentinos" },
  { code: "UYU", label: "Pesos uruguayos" },
  { code: "COP", label: "Pesos colombianos" },
  { code: "MXN", label: "Pesos mexicanos" },
  { code: "PEN", label: "Soles" },
  { code: "USD", label: "Dolares" },
];

export const DEFAULT_CURRENCY_CODE: SupportedCurrencyCode = "USD";

const getFormatter = (currencyCode: SupportedCurrencyCode): Intl.NumberFormat => {
  const existingFormatter = formatterCache.get(currencyCode);
  if (existingFormatter) {
    return existingFormatter;
  }

  const formatter = new Intl.NumberFormat(CURRENCY_LOCALES[currencyCode], {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  formatterCache.set(currencyCode, formatter);
  return formatter;
};

export const convertUsdToCurrency = (
  amountInUsd: number,
  currencyCode: SupportedCurrencyCode
): number => currency(amountInUsd).multiply(USD_EXCHANGE_RATES[currencyCode]).value;

export const formatCurrencyFromUsd = (
  amountInUsd: number,
  currencyCode: SupportedCurrencyCode
): string => getFormatter(currencyCode).format(convertUsdToCurrency(amountInUsd, currencyCode));
