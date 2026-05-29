import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

type ActivityContextType = {
  elapsedTime: number;
  isRunning: boolean;
  isPaused: boolean;

  startActivity: () => void;
  pauseActivity: () => void;
  resumeActivity: () => void;
  finishActivity: () => void;
};

const ActivityContext =
  createContext<ActivityContextType | null>(null);

export function ActivityProvider({
  children,
}: PropsWithChildren) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startActivity = () => {
    clearCurrentInterval();
    setElapsedTime(0);
    setIsRunning(true);
    setIsPaused(false);
    startInterval();
  };

  const pauseActivity = () => {
    clearCurrentInterval();
    setIsRunning(false);
    setIsPaused(true);
  };

  const resumeActivity = () => {
    setIsRunning(true);
    setIsPaused(false);
    startInterval();
  };

  const finishActivity = () => {
    clearCurrentInterval();
    setIsRunning(false);
    setIsPaused(false);
  };

  // cleanup on app reload/unmount
  useEffect(() => {
    return () => {
      clearCurrentInterval();
    };
  }, []);

  return (
    <ActivityContext.Provider
      value={{
        elapsedTime,
        isRunning,
        isPaused,

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
