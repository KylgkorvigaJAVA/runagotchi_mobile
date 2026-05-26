import { HomeScreenData } from "./types";

export function createInitialHomeScreenData(): HomeScreenData {
  return {
    currency: 25,
    weather: "sunny",
    pet: {
      name: "Bella",
      status: "Ready for a walk!",
      level: 1,
      levelProgress: 0,
      stats: {
        happiness: 50,
        strength: 50,
      },
    },
    activityOverview: {
      totalDistanceMeters: 0,
      totalSteps: 0,
      totalActiveSeconds: 0,
      weeklyDistanceMeters: 0,
      weeklySteps: 0,
      weeklyActiveSeconds: 0,
      weeklySessions: 0,
    },
  };
}

export const mockHomeScreenData = createInitialHomeScreenData();
