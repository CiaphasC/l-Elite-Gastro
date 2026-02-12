import { DEFAULT_CURRENCY_CODE, formatCurrencyFromUsd } from "@/domain/currency";
import type { SupportedCurrencyCode } from "@/types";

export const formatCurrency = (
  valueInUsd: number,
  currencyCode: SupportedCurrencyCode = DEFAULT_CURRENCY_CODE
): string => formatCurrencyFromUsd(valueInUsd, currencyCode);

