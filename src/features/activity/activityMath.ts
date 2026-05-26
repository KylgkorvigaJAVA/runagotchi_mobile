import { ActivityMetric, ActivitySessionSnapshot, ActivityTotals, PetAppearanceState, PetProgression } from "./types";

const AVERAGE_STEP_LENGTH_METERS = 0.78;
const LEVEL_STEP_BUCKET = 1500;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function distanceToSteps(distanceMeters: number) {
  return Math.round(distanceMeters / AVERAGE_STEP_LENGTH_METERS);
}

export function formatDistance(distanceMeters: number) {
  return `${(distanceMeters / 1000).toFixed(2)} km`;
}

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export function mergeActivityTotals(
  totals: ActivityTotals,
  session: Pick<ActivitySessionSnapshot, "distanceMeters" | "steps" | "activeSeconds">
): ActivityTotals {
  return {
    totalDistanceMeters: totals.totalDistanceMeters + session.distanceMeters,
    totalSteps: totals.totalSteps + session.steps,
    totalActiveSeconds: totals.totalActiveSeconds + session.activeSeconds,
    weeklyDistanceMeters: totals.weeklyDistanceMeters + session.distanceMeters,
    weeklySteps: totals.weeklySteps + session.steps,
    weeklyActiveSeconds: totals.weeklyActiveSeconds + session.activeSeconds,
    weeklySessions: totals.weeklySessions + 1,
  };
}

function getAppearanceState(
  _weeklySteps: number,
  session: ActivitySessionSnapshot
): PetAppearanceState {
  if (session.status === "tracking") {
    return "ready";
  }

  if (session.status === "paused") {
    return "pause";
  }

  if (session.status === "completed" && session.steps > 0) {
    return "done";
  }

  return "home";
}

export function derivePetProgression(
  baseLevel: number,
  totals: ActivityTotals,
  session: ActivitySessionSnapshot
): PetProgression {
  const cumulativeSteps = totals.totalSteps + session.steps;
  const weeklySteps = totals.weeklySteps + session.steps;
  const activeMinutes = (totals.totalActiveSeconds + session.activeSeconds) / 60;
  const weeklyActiveMinutes = (totals.weeklyActiveSeconds + session.activeSeconds) / 60;
  const lowActivityPenalty = weeklySteps < 1500 ? 18 : weeklySteps < 4000 ? 8 : 0;
  const currentActivityBoost = session.status === "tracking" ? 10 : session.status === "paused" ? 4 : 0;

  const happiness = clamp(
    52 + Math.round(weeklySteps / 180) - lowActivityPenalty + currentActivityBoost,
    0,
    100
  );

  const strength = clamp(
    38 + Math.round(activeMinutes / 4) + Math.round(cumulativeSteps / 900) - Math.floor(lowActivityPenalty / 2),
    0,
    100
  );

  const levelIncrease = Math.floor(cumulativeSteps / LEVEL_STEP_BUCKET);
  const levelProgress = clamp(((cumulativeSteps % LEVEL_STEP_BUCKET) / LEVEL_STEP_BUCKET) * 100, 0, 100);

  let status = "Ready for a walk!";

  if (session.status === "tracking") {
    status = `${session.steps} steps so far - ${formatDistance(session.distanceMeters)} tracked.`;
  } else if (session.status === "paused") {
    status = `Activity paused at ${session.steps} steps - tap Go to continue.`;
  } else if (session.status === "completed" && session.steps > 0) {
    status = `Great walk! ${session.steps} steps made the pet stronger.`;
  } else if (session.status === "permission-denied") {
    status = "Location permission is needed to track walks.";
  } else if (weeklyActiveMinutes < 20) {
    status = "No activity lately - the pet needs a walk.";
  } else if (weeklySteps > 7000) {
    status = "Feeling happy, strong, and ready for more!";
  }

  return {
    status,
    level: baseLevel + levelIncrease,
    levelProgress,
    happiness,
    strength,
    appearance: getAppearanceState(weeklySteps, session),
  };
}

export function buildStatsMetrics(
  totals: ActivityTotals,
  currentSession: ActivitySessionSnapshot
): ActivityMetric[] {
  const combinedDistance = totals.totalDistanceMeters + currentSession.distanceMeters;
  const combinedActiveSeconds = totals.totalActiveSeconds + currentSession.activeSeconds;
  const combinedWeeklyDistance = totals.weeklyDistanceMeters + currentSession.distanceMeters;
  const combinedWeeklyActiveSeconds = totals.weeklyActiveSeconds + currentSession.activeSeconds;
  const combinedWeeklySteps = totals.weeklySteps + currentSession.steps;

  return [
    {
      key: "total-distance",
      label: "Total distance",
      value: formatDistance(combinedDistance),
    },
    {
      key: "total-active-time",
      label: "Total active time",
      value: formatDuration(combinedActiveSeconds),
    },
    {
      key: "weekly-activity",
      label: "Weekly activity",
      value: `${formatDistance(combinedWeeklyDistance)} / ${formatDuration(combinedWeeklyActiveSeconds)}`,
    },
    {
      key: "weekly-steps",
      label: "Weekly steps",
      value: `${combinedWeeklySteps}`,
    },
  ];
}
