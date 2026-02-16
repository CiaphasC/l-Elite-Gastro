import type { StateCreator } from "zustand";
import type { RestaurantStore } from "@/store/restaurantStore";
import type { RestaurantActions } from "@/types";

export type RestaurantActionSlice = Partial<RestaurantActions>;
export type RestaurantSliceCreator<T extends RestaurantActionSlice = RestaurantActionSlice> =
  StateCreator<RestaurantStore, [], [], T>;
