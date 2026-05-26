import { buildStatsMetrics, derivePetProgression, formatDistance, formatDuration, mergeActivityTotals } from "@/features/activity/activityMath";
import {
  ActivityMetric,
  ActivitySessionSnapshot,
  ActivitySessionStatus,
  ActivityTotals,
  PetAppearanceState,
} from "@/features/activity/types";
import { useActivitySession } from "@/features/activity/useActivitySession";
import { homeScreenRepository } from "@/features/home/homeScreenRepository";
import { createInitialHomeScreenData } from "@/features/home/mockHomeScreenData";
import { HomeScreenData } from "@/features/home/types";
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { clearStoredGameState, loadStoredGameState, saveStoredGameState } from "./storage";

interface GameContextValue {
  activityStatus: ActivitySessionStatus;
  homeData: HomeScreenData | null;
  errorMessage: string | null;
  isActivityControlsOpen: boolean;
  isLoading: boolean;
  isTracking: boolean;
  weather: HomeScreenData["weather"];
  petStatus: string;
  petLevel: number;
  petLevelProgress: number;
  petHappiness: number;
  petStrength: number;
  petAppearance: PetAppearanceState;
  sessionDistance: string;
  sessionActiveTime: string;
  sessionSteps: number;
  statsMetrics: ActivityMetric[];
  closeActivityControls: () => void;
  openActivityControls: () => void;
  pauseActivityTracking: () => void;
  resetGame: () => Promise<void>;
  startActivityTracking: () => Promise<void>;
  stopActivityTracking: () => void;
}

const emptySession: ActivitySessionSnapshot = {
  status: "idle",
  distanceMeters: 0,
  steps: 0,
  activeSeconds: 0,
  errorMessage: null,
};

const defaultGameContext: GameContextValue = {
  activityStatus: "idle",
  homeData: null,
  errorMessage: null,
  isActivityControlsOpen: false,
  isLoading: true,
  isTracking: false,
  weather: "sunny",
  petStatus: "Loading home data...",
  petLevel: 0,
  petLevelProgress: 0,
  petHappiness: 0,
  petStrength: 0,
  petAppearance: "home",
  sessionDistance: formatDistance(0),
  sessionActiveTime: formatDuration(0),
  sessionSteps: 0,
  statsMetrics: [],
  closeActivityControls: () => undefined,
  openActivityControls: () => undefined,
  pauseActivityTracking: () => undefined,
  resetGame: async () => undefined,
  startActivityTracking: async () => undefined,
  stopActivityTracking: () => undefined,
};

const GameContext = createContext<GameContextValue>(defaultGameContext);

function normalizeHomeData(data: HomeScreenData): HomeScreenData {
  if (data.pet.level >= 5) {
    return data;
  }

  return {
    ...data,
    pet: {
      ...data.pet,
      level: 5,
    },
  };
}

export function GameProvider({ children }: PropsWithChildren) {
  const [homeData, setHomeData] = useState<HomeScreenData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isActivityControlsOpen, setIsActivityControlsOpen] = useState(false);
  const [activityTotals, setActivityTotals] = useState<ActivityTotals | null>(null);
  const [lastCompletedSession, setLastCompletedSession] = useState<ActivitySessionSnapshot | null>(null);
  const { session, startSession, pauseSession, stopSession, clearCompletedSession, resetSession } =
    useActivitySession();
  const lastCommittedSessionRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        const storedState = await loadStoredGameState();
        const data = normalizeHomeData(
          storedState?.homeData ?? (await homeScreenRepository.getHomeScreenData())
        );
        const totals = storedState?.activityTotals ?? data.activityOverview;

        if (isMounted) {
          setHomeData(data);
          setActivityTotals(totals);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load home data.");
        }
      }
    };

    void loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!homeData || !activityTotals) {
      return;
    }

    void saveStoredGameState({
      homeData,
      activityTotals,
    });
  }, [activityTotals, homeData]);

  useEffect(() => {
    if (!activityTotals) {
      return;
    }

    if (session.status !== "completed") {
      if (session.status === "tracking") {
        lastCommittedSessionRef.current = null;
      }

      return;
    }

    const sessionFingerprint = `${session.distanceMeters}-${session.steps}-${session.activeSeconds}`;

    if (lastCommittedSessionRef.current === sessionFingerprint) {
      return;
    }

    setActivityTotals((currentTotals) =>
      currentTotals ? mergeActivityTotals(currentTotals, session) : currentTotals
    );
    setLastCompletedSession(session);
    lastCommittedSessionRef.current = sessionFingerprint;
  }, [activityTotals, session]);

  const totals = activityTotals ?? homeData?.activityOverview ?? {
    totalDistanceMeters: 0,
    totalSteps: 0,
    totalActiveSeconds: 0,
    weeklyDistanceMeters: 0,
    weeklySteps: 0,
    weeklyActiveSeconds: 0,
    weeklySessions: 0,
  };
  const sessionFingerprint = `${session.distanceMeters}-${session.steps}-${session.activeSeconds}`;
  const sessionAlreadyCommitted =
    session.status === "completed" && lastCommittedSessionRef.current === sessionFingerprint;
  const liveSession = sessionAlreadyCommitted ? emptySession : session;
  const displaySession =
    session.status === "tracking" ? session : lastCompletedSession ?? liveSession;
  const petProgression = derivePetProgression(homeData?.pet.level ?? 0, totals, liveSession);
  const statsMetrics = buildStatsMetrics(totals, liveSession);
  const hasCompletedSession = session.status === "completed" || Boolean(lastCompletedSession);
  const petAppearance =
    session.status === "tracking"
      ? "ready"
      : session.status === "paused"
        ? "pause"
        : hasCompletedSession
            ? "done"
            : isActivityControlsOpen
              ? "ready"
              : petProgression.appearance;

  const openActivityControls = () => {
    setIsActivityControlsOpen(true);
    setLastCompletedSession(null);
    clearCompletedSession();
  };

  const closeActivityControls = () => {
    if (session.status === "tracking" || session.status === "paused") {
      return;
    }

    setIsActivityControlsOpen(false);
  };

  const startActivityTracking = async () => {
    setIsActivityControlsOpen(true);
    setLastCompletedSession(null);
    clearCompletedSession();
    await startSession();
  };

  const pauseActivityTracking = () => {
    pauseSession();
  };

  const stopActivityTracking = () => {
    stopSession();
  };

  const resetGame = async () => {
    resetSession();
    setIsActivityControlsOpen(false);
    lastCommittedSessionRef.current = null;
    setLastCompletedSession(null);

    const initialData = createInitialHomeScreenData();

    setHomeData(initialData);
    setActivityTotals(initialData.activityOverview);
    setErrorMessage(null);
    await clearStoredGameState();
    await saveStoredGameState({
      homeData: initialData,
      activityTotals: initialData.activityOverview,
    });
  };

  const value: GameContextValue = {
    activityStatus: session.status,
    homeData,
    errorMessage,
    isActivityControlsOpen,
    isLoading: !homeData && !errorMessage,
    isTracking: session.status === "tracking",
    weather: homeData?.weather ?? "sunny",
    petStatus:
      session.errorMessage ??
      (isActivityControlsOpen && session.status === "idle"
        ? "Ready to start an activity."
        : undefined) ??
      (lastCompletedSession
        ? `Great walk! ${lastCompletedSession.steps} steps made the pet stronger.`
        : petProgression.status),
    petLevel: petProgression.level,
    petLevelProgress: petProgression.levelProgress,
    petHappiness: petProgression.happiness,
    petStrength: petProgression.strength,
    petAppearance,
    sessionDistance: formatDistance(displaySession.distanceMeters),
    sessionActiveTime: formatDuration(displaySession.activeSeconds),
    sessionSteps: displaySession.steps,
    statsMetrics,
    closeActivityControls,
    openActivityControls,
    pauseActivityTracking,
    resetGame,
    startActivityTracking,
    stopActivityTracking,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}
