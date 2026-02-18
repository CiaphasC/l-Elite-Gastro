import { createRestaurantStateFromSeed } from "@/domain/createInitialRestaurantState";
import { jsonRestaurantBootstrapRepository } from "@/infrastructure/repositories/jsonRestaurantBootstrapRepository";
import type { RestaurantBootstrapRepository } from "@/domain/repositories/restaurantBootstrapRepository";
import type { RestaurantState } from "@/types";

export const RESTAURANT_BOOTSTRAP_QUERY_KEY = ["restaurant", "bootstrap"] as const;

const SIMULATED_BOOT_LATENCY_MS = 900;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

export const fetchRestaurantBootstrap = async (): Promise<RestaurantState> => {
  await sleep(SIMULATED_BOOT_LATENCY_MS);
  return createRestaurantStateFromSeed(await jsonRestaurantBootstrapRepository.fetchSeed());
};

/**
 * Variante inyectable para tests y para backend futuro.
 * Permite reemplazar el origen JSON local por API/DB sin cambiar la capa de UI.
 */
export const fetchRestaurantBootstrapFromRepository = async (
  repository: RestaurantBootstrapRepository
): Promise<RestaurantState> => {
  await sleep(SIMULATED_BOOT_LATENCY_MS);
  return createRestaurantStateFromSeed(await repository.fetchSeed());
};
