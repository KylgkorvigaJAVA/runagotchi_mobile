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

import { saveActivity } from '@/features/profile/storage';


type GpsPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

type ActivityRecord = {
  id: string;
  startedAt: string;
  elapsedTime: number;
  distanceMeters: number;
  averageSpeedKmh: number;
  route: GpsPoint[];
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
  const routeRef = useRef<GpsPoint[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationForegroundSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // AVG SPEED derived
  const averageSpeedKmh = elapsedTime > 0 ? (distanceMeters * 3600) / (elapsedTime * 1000) : 0;

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
  const requestForegroundPermission = async (): Promise<boolean> => {
      const fg = await Location.requestForegroundPermissionsAsync();

      if (fg.status !== "granted") {
        console.warn("Foreground location permission denied");
        return false;
      }

      return true;
    };

  const requestBackgroundPermission = async (): Promise<boolean> => {
    const bg = await Location.requestBackgroundPermissionsAsync();

    if (bg.status !== "granted") {
      return false;
    }

    return true;
  };

  const startLocationTracking = async () => {
    const fgGranted = await requestForegroundPermission();
    if (!fgGranted) return;

    await stopLocationTracking();

    locationForegroundSubscriptionRef.current =
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 5,
          timeInterval: 2000,
        },
        (location) => {
          const point: GpsPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
          };

          const speedMps = Math.max(0, location.coords.speed ?? 0);
          const kmh = speedMps * 3.6;

          setCurrentSpeedKmh((prev) => prev === 0 ? kmh : prev * 0.7 + kmh * 0.3);

          if (!previousLocationRef.current) {
            routeRef.current.push(point);
            previousLocationRef.current = point;
            return;
          }

          const dist = getDistance(previousLocationRef.current, point);

          if (dist > 3 && dist < 100) {
            routeRef.current.push(point);
            setDistanceMeters((prevDistance) => prevDistance + dist);
          }

          previousLocationRef.current = point;
        }
      );

    const bgGranted = await requestBackgroundPermission();

    if (bgGranted) {
      const alreadyRunning =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

      if (!alreadyRunning) {
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
      }
    }
  };

  const loadBackgroundRoute = async (): Promise<GpsPoint[]> => {
    try {
      const stored = await AsyncStorage.getItem("activity_locations");

      if (!stored) return [];

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const stopLocationTracking = async () => {
    locationForegroundSubscriptionRef.current?.remove();
    locationForegroundSubscriptionRef.current = null;

    const backgroundRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

    if (backgroundRunning) await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  };


  // ACTIVITY ACTIONS
  const startActivity = async () => {
    if (startedAtRef.current !== null) return;

    const fgGranted = await requestForegroundPermission();
    if (!fgGranted) return;

    const now = Date.now();

    startedAtRef.current = now;
    pausedAtRef.current = null;
    pauseAccumulatedRef.current = 0;

    routeRef.current = [];
    previousLocationRef.current = null;

    setDistanceMeters(0);
    setCurrentSpeedKmh(0);

    setIsRunning(true);
    setIsPaused(false);
    setElapsedTime(0);

    await AsyncStorage.removeItem("activity_locations");
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

    const fgGranted = await requestForegroundPermission();
    if (!fgGranted) return;

    pauseAccumulatedRef.current += Date.now() - pausedAtRef.current;
    pausedAtRef.current = null;

    previousLocationRef.current = previousLocationRef.current = null;

    setIsPaused(false);
    setIsRunning(true);

    startUITimer();
    await startLocationTracking();
  };


  const finishActivity = async () => {
    stopUITimer();
    await stopLocationTracking();

    if (!startedAtRef.current) return;

    const backgroundRoute = await loadBackgroundRoute();
    const unique = new Map<string, GpsPoint>();

    [...routeRef.current, ...backgroundRoute].forEach((point) => {
      const key = `${point.latitude}:${point.longitude}:${point.timestamp}`;
      unique.set(key, point);
    });

    const route = [...unique.values()].sort((a, b) => a.timestamp - b.timestamp);

    const record: ActivityRecord = {
      id: Date.now().toString(),
      startedAt: new Date(startedAtRef.current ?? Date.now()).toISOString(),
      elapsedTime,
      distanceMeters,
      averageSpeedKmh,
      route,
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
    routeRef.current = [];
    await AsyncStorage.removeItem("activity_locations");

    await saveActivity(record);
  };

  // cleanup on app reload/unmount
  useEffect(() => {
    return () => {
      stopUITimer();
      void stopLocationTracking();
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
