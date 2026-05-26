export type ActivitySessionStatus =
  | "idle"
  | "tracking"
  | "paused"
  | "completed"
  | "permission-denied";

export type PetAppearanceState = "home" | "ready" | "pause" | "done";

export interface ActivitySessionSnapshot {
  status: ActivitySessionStatus;
  distanceMeters: number;
  steps: number;
  activeSeconds: number;
  errorMessage: string | null;
}

export interface ActivityTotals {
  totalDistanceMeters: number;
  totalSteps: number;
  totalActiveSeconds: number;
  weeklyDistanceMeters: number;
  weeklySteps: number;
  weeklyActiveSeconds: number;
  weeklySessions: number;
}

export interface ActivityMetric {
  key: string;
  label: string;
  value: string;
}

export interface PetProgression {
  status: string;
  level: number;
  levelProgress: number;
  happiness: number;
  strength: number;
  appearance: PetAppearanceState;
}
