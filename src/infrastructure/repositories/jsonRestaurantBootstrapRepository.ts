import { RESTAURANT_SEED_DATA } from "@/domain/mockData";
import type { RestaurantBootstrapRepository } from "@/domain/repositories/restaurantBootstrapRepository";
import type { RestaurantSeedData } from "@/domain/contracts/restaurantSeed";

const cloneSeed = (seed: RestaurantSeedData): RestaurantSeedData => {
  if (typeof structuredClone === "function") {
    return structuredClone(seed);
  }

  return JSON.parse(JSON.stringify(seed)) as RestaurantSeedData;
};

export const jsonRestaurantBootstrapRepository: RestaurantBootstrapRepository = {
  fetchSeed: async () => cloneSeed(RESTAURANT_SEED_DATA),
};
