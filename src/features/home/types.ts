export type WeatherType = "sunny" | "rainy";

export interface PetStats {
  happiness: number;
  strength: number;
}

export interface ActivityOverview {
  totalDistanceMeters: number;
  totalSteps: number;
  totalActiveSeconds: number;
  weeklyDistanceMeters: number;
  weeklySteps: number;
  weeklyActiveSeconds: number;
  weeklySessions: number;
}

export interface PetSummary {
  name: string;
  status: string;
  level: number;
  levelProgress: number;
  stats: PetStats;
}

export interface HomeScreenData {
  currency: number;
  weather: WeatherType;
  pet: PetSummary;
  activityOverview: ActivityOverview;
}
