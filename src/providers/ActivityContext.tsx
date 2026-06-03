import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";


type GpsPoint = {
  latitude: number;
  longitude: number;
};


type ActivityRecord = {
  id: string;
  startedAt: string;
  elapsedTime: number;

  distanceMeters: number;
  averageSpeedKmh: number;
};


type ActivityContextType = {
  elapsedTime: number;
  distanceMeters: number;
  averageSpeedKmh: number;
  currentSpeedKmh: number;

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
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [averageSpeedKmh, setAverageSpeedKmh] = useState(0);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [latestFinishedActivity, setLatestFinishedActivity] = useState<ActivityRecord | null>(null);


  const startedAtRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const pauseAccumulatedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const previousLocationRef = useRef<GpsPoint | null>(null);


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


  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.warn("Location permission denied");
      return;
    }

    locationSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy:
          Location.Accuracy.BestForNavigation,
        distanceInterval: 5,
        timeInterval: 2000,
      },
      (location) => {
        const currentPoint: GpsPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const speedMps =
          Math.max(0, location.coords.speed ?? 0);

        setCurrentSpeedKmh(speedMps * 3.6);

        if (previousLocationRef.current) {
          const segmentDistance = getDistance(
            previousLocationRef.current,
            currentPoint
          );

          // Ignore GPS jumps
          if (segmentDistance < 100) {
            setDistanceMeters(
              (prev) => prev + segmentDistance
            );
          }
        }

        previousLocationRef.current = currentPoint;
      }
    );
  };


  const stopLocationTracking = () => {
    locationSubscriptionRef.current?.remove();
    locationSubscriptionRef.current = null;
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


  const startActivity = async () => {
    const now = Date.now();

    startedAtRef.current = now;
    pausedAtRef.current = null;
    pauseAccumulatedRef.current = 0;

    previousLocationRef.current = null;

    setStartedAt(now);
    setPausedAt(null);
    setPauseAccumulated(0);

    setDistanceMeters(0);
    setAverageSpeedKmh(0);
    setCurrentSpeedKmh(0);

    setIsRunning(true);
    setIsPaused(false);
    setElapsedTime(0);

    startUITimer();

    await startLocationTracking();
  };


  const pauseActivity = () => {
    if (!startedAtRef.current) return;

    const now = Date.now();

    pausedAtRef.current = now;

    setCurrentSpeedKmh(0);

    setPausedAt(now);
    setIsPaused(true);
    setIsRunning(false);

    stopUITimer();

    stopLocationTracking();
  };


  const resumeActivity = async () => {
    if (!startedAtRef.current || !pausedAtRef.current)
      return;

    const now = Date.now();

    const pauseDuration =
      now - pausedAtRef.current;

    pauseAccumulatedRef.current += pauseDuration;

    setPauseAccumulated(
      pauseAccumulatedRef.current
    );

    pausedAtRef.current = null;

    setPausedAt(null);

    setIsPaused(false);
    setIsRunning(true);

    startUITimer();

    await startLocationTracking();
  };


  const finishActivity = async () => {
    stopUITimer();
    stopLocationTracking();

    if (!startedAtRef.current) return;

    const finalElapsed = calculateElapsed();

    const activityRecord: ActivityRecord = {
      id: Date.now().toString(),
      startedAt: new Date(startedAtRef.current).toISOString(),
      elapsedTime: finalElapsed,

      distanceMeters,
      averageSpeedKmh,
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

    previousLocationRef.current = null;

    setCurrentSpeedKmh(0);
    setDistanceMeters(0);
    setAverageSpeedKmh(0);
  };


  useEffect(() => {
    if (elapsedTime === 0) {
      setAverageSpeedKmh(0);
      return;
    }

    const hours = elapsedTime / 3600;
    const km = distanceMeters / 1000;

    setAverageSpeedKmh(km / hours);
  }, [distanceMeters, elapsedTime]);
  

  // cleanup on app reload/unmount
  useEffect(() => {
    return () => {
      stopUITimer();
      stopLocationTracking();
    };
  }, []);


  return (
    <ActivityContext.Provider
      value={{
        elapsedTime,
        distanceMeters,
        averageSpeedKmh,
        currentSpeedKmh,

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
