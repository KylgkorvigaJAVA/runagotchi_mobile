import { LOCATION_TASK_NAME } from "@/features/location/gpsTask";
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

  startActivity: () => Promise<void>;
  pauseActivity: () => Promise<void>;
  resumeActivity: () => Promise<void>;
  finishActivity: () => Promise<void>;
};


const ActivityContext = createContext<ActivityContextType | null>(null);


export function ActivityProvider({ children, }: PropsWithChildren) {
  // STATES
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [latestFinishedActivity, setLatestFinishedActivity] = useState<ActivityRecord | null>(null);

  // REFS
  const startedAtRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const pauseAccumulatedRef = useRef(0);

  const previousLocationRef = useRef<GpsPoint | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationForegroundSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // AVG SPEED derived
  const averageSpeedKmh =
  elapsedTime > 0
    ? (distanceMeters * 3600) / (elapsedTime * 1000)
    : 0;

  // TIMER
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

  // GPS
  const startLocationTracking = async () => {
    const fg = await Location.requestForegroundPermissionsAsync();
    const bg = await Location.requestBackgroundPermissionsAsync();

    if (fg.status !== "granted" || bg.status !== "granted") return;

    // FOREGROUND TRACKING
    locationForegroundSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5,
        timeInterval: 2000,
      },
      (location) => {
        const point: GpsPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        const speedMps = Math.max(0, location.coords.speed ?? 0);
        const kmh = Math.max(0, speedMps * 3.6);
        setCurrentSpeedKmh((prev) => prev * 0.7 + kmh * 0.3);

        if (previousLocationRef.current) {
          const dist = getDistance(previousLocationRef.current, point);

          if (dist > 3 && dist < 50) {
            setDistanceMeters((p) => p + dist);
          }
        }

        previousLocationRef.current = point;
      }
    );

    // BACKGROUND TRACKING
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 5,
      timeInterval: 2000,
      foregroundService: {
        notificationTitle: "Run tracking active",
        notificationBody: "Runagotchi is tracking your activity",
      },
      pausesUpdatesAutomatically: false,
    });
  };

  const stopLocationTracking = async () => {
    locationForegroundSubscriptionRef.current?.remove();
    locationForegroundSubscriptionRef.current = null;

    const hasTask = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (hasTask) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  };

  // STORAGE
  const saveActivityToStorage = async (record: ActivityRecord) => {
    const existing = await AsyncStorage.getItem("activities");
    const parsed: ActivityRecord[] = existing ? JSON.parse(existing) : [];

    parsed.push(record);

    await AsyncStorage.setItem("activities", JSON.stringify(parsed));
  };


  // ACTIVITY ACTIONS
  const startActivity = async () => {
    const now = Date.now();

    startedAtRef.current = now;
    pausedAtRef.current = null;
    pauseAccumulatedRef.current = 0;

    previousLocationRef.current = null;

    setDistanceMeters(0);
    setCurrentSpeedKmh(0);

    setIsRunning(true);
    setIsPaused(false);
    setElapsedTime(0);

    startUITimer();
    await startLocationTracking();
  };


  const pauseActivity = async () => {
    const now = Date.now();

    pausedAtRef.current = now;

    setIsPaused(true);
    setIsRunning(false);
    setCurrentSpeedKmh(0);

    stopUITimer();
    await stopLocationTracking();
  };


  const resumeActivity = async () => {
    if (!pausedAtRef.current) return;

    pauseAccumulatedRef.current += Date.now() - pausedAtRef.current;
    pausedAtRef.current = null;

    setIsPaused(false);
    setIsRunning(true);

    startUITimer();
    await startLocationTracking();
  };


  const finishActivity = async () => {
    stopUITimer();
    stopLocationTracking();

    if (!startedAtRef.current) return;

    const record: ActivityRecord = {
      id: Date.now().toString(),
      startedAt: new Date(startedAtRef.current ?? Date.now()).toISOString(),
      elapsedTime,
      distanceMeters,
      averageSpeedKmh,
    };

    setLatestFinishedActivity(record);

    setIsRunning(false);
    setIsPaused(false);

    setElapsedTime(0);
    setDistanceMeters(0);
    setCurrentSpeedKmh(0);

    startedAtRef.current = null;
    pausedAtRef.current = null;
    pauseAccumulatedRef.current = 0;

    previousLocationRef.current = null;

    await saveActivityToStorage(record);
  };

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
    throw new Error("useActivity must be inside ActivityProvider");
  }

  return ctx;
}
