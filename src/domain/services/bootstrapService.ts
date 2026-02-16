import { createInitialRestaurantState } from "@/domain/createInitialRestaurantState";
import type { RestaurantState } from "@/types";

export const RESTAURANT_BOOTSTRAP_QUERY_KEY = ["restaurant", "bootstrap"] as const;

const SIMULATED_BOOT_LATENCY_MS = 900;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

export const fetchRestaurantBootstrap = async (): Promise<RestaurantState> => {
  await sleep(SIMULATED_BOOT_LATENCY_MS);
  return createInitialRestaurantState();
};
