import type { RestaurantSeedData } from "@/domain/contracts/restaurantSeed";

export interface RestaurantBootstrapRepository {
  fetchSeed: () => Promise<RestaurantSeedData>;
}
