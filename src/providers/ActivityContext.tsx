import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ActivityRecord = {
  id: string;
  startedAt: string;
  elapsedTime: number;
};

type ActivityContextType = {
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;
  latestFinishedActivity: ActivityRecord | null;

  startActivity: () => void;
  pauseActivity: () => void;
  resumeActivity: () => void;
  finishActivity: () => Promise<void>;
};

const ActivityContext = createContext<ActivityContextType | null>(null);

export function ActivityProvider({ children, }: PropsWithChildren) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [pauseAccumulated, setPauseAccumulated] = useState(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [latestFinishedActivity, setLatestFinishedActivity] = useState<ActivityRecord | null>(null);

  const startedAtRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const pauseAccumulatedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calculateElapsed = () => {
    if (!startedAtRef.current) return 0;

    const now = Date.now();
    const pausedTime = pauseAccumulatedRef.current;

    const currentPause = pausedAtRef.current ? now - pausedAtRef.current : 0;

    return Math.floor((now - startedAtRef.current - pausedTime - currentPause) / 1000);
  };

  const startUITimer = () => {
    stopUITimer();

    intervalRef.current = setInterval(() => {
      setElapsedTime(calculateElapsed());
    }, 1000);
  };

  const stopUITimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const saveActivityToStorage = async (activityRecord: ActivityRecord) => {
    try {
      const existing = await AsyncStorage.getItem("activities");
      const parsed: ActivityRecord[] = existing ? JSON.parse(existing) : [];

      parsed.push(activityRecord);

      await AsyncStorage.setItem("activities", JSON.stringify(parsed));
    } catch (error) {
      console.error("Failed to save activity", error);
    }
  };

  const startActivity = () => {
    const now = Date.now();

    startedAtRef.current = now;
    pausedAtRef.current = null;
    pauseAccumulatedRef.current = 0;

    setStartedAt(now);
    setPausedAt(null);
    setPauseAccumulated(0);

    setIsRunning(true);
    setIsPaused(false);
    setElapsedTime(0);

    startUITimer();
  };

  const pauseActivity = () => {
    if (!startedAtRef.current) return;

    const now = Date.now();

    pausedAtRef.current = now;

    setPausedAt(now);
    setIsPaused(true);
    setIsRunning(false);

    stopUITimer();
  };

  const resumeActivity = () => {
    if (!startedAtRef.current || !pausedAtRef.current) return;

    const now = Date.now();
    const pauseDuration = now - pausedAtRef.current;

    pauseAccumulatedRef.current += pauseDuration;

    setPauseAccumulated(pauseAccumulatedRef.current);

    pausedAtRef.current = null;

    setPausedAt(null);
    setIsPaused(false);
    setIsRunning(true);

    startUITimer();
  };

  const finishActivity = async () => {
    stopUITimer();

    if (!startedAtRef.current) return;

    const finalElapsed = calculateElapsed();

    const activityRecord: ActivityRecord = {
      id: Date.now().toString(),
      startedAt: new Date(startedAtRef.current).toISOString(),
      elapsedTime: finalElapsed,
    };

    setLatestFinishedActivity(activityRecord);

    startedAtRef.current = null;
    pausedAtRef.current = null;
    pauseAccumulatedRef.current = 0;

    setStartedAt(null);
    setPausedAt(null);
    setPauseAccumulated(0);

    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);

    await saveActivityToStorage(activityRecord);
  };

  // cleanup on app reload/unmount
  useEffect(() => {
    return () => { stopUITimer() };
  }, []);

  return (
    <ActivityContext.Provider
      value={{
        elapsedTime,
        isRunning,
        isPaused,
        latestFinishedActivity,

        startActivity,
        pauseActivity,
        resumeActivity,
        finishActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);

  if (!ctx) {
    throw new Error(
      "useActivity must be inside ActivityProvider"
    );
  }

  return ctx;
}
