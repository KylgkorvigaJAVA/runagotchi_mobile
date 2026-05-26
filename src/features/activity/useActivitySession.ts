import { distanceToSteps } from "@/features/activity/activityMath";
import { ActivitySessionSnapshot } from "@/features/activity/types";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

const ACTIVE_POLL_INTERVAL_MS = 1000;

const idleSession: ActivitySessionSnapshot = {
  status: "idle",
  distanceMeters: 0,
  steps: 0,
  activeSeconds: 0,
  errorMessage: null,
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceMeters(
  start: Location.LocationObjectCoords,
  end: Location.LocationObjectCoords
) {
  const earthRadiusMeters = 6371000;
  const latitudeDelta = toRadians(end.latitude - start.latitude);
  const longitudeDelta = toRadians(end.longitude - start.longitude);
  const startLatitude = toRadians(start.latitude);
  const endLatitude = toRadians(end.latitude);

  const haversineValue =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  const arc = 2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));

  return earthRadiusMeters * arc;
}

export function useActivitySession() {
  const [session, setSession] = useState<ActivitySessionSnapshot>(idleSession);
  const sessionRef = useRef<ActivitySessionSnapshot>(idleSession);
  const watchSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const activeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previousCoordsRef = useRef<Location.LocationObjectCoords | null>(null);

  const stopTrackingResources = useCallback(() => {
    watchSubscriptionRef.current?.remove();
    watchSubscriptionRef.current = null;

    if (activeTimerRef.current) {
      clearInterval(activeTimerRef.current);
      activeTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    return () => {
      stopTrackingResources();
    };
  }, [stopTrackingResources]);

  const stopSession = useCallback(() => {
    stopTrackingResources();
    previousCoordsRef.current = null;

    setSession((currentSession) => ({
      ...currentSession,
      status:
        currentSession.distanceMeters > 0 || currentSession.activeSeconds > 0
          ? "completed"
          : "idle",
    }));
  }, [stopTrackingResources]);

  const pauseSession = useCallback(() => {
    stopTrackingResources();
    previousCoordsRef.current = null;

    setSession((currentSession) => {
    if (currentSession.status !== "tracking") {
      return currentSession;
    }

    return {
      ...currentSession,
      status: "paused",
    };
    });
  }, [stopTrackingResources]);

  const startSession = useCallback(async () => {
    stopTrackingResources();
    const currentSession = sessionRef.current;
    const baseSession =
    currentSession.status === "paused"
      ? {
          ...currentSession,
          errorMessage: null,
        }
      : {
          ...idleSession,
        };

    const servicesEnabled = await Location.hasServicesEnabledAsync();

    if (!servicesEnabled) {
    setSession({
      ...baseSession,
      status: "permission-denied",
      errorMessage: "Enable location services to start an activity.",
    });
      return;
    }

    const permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      setSession({
        ...baseSession,
        status: "permission-denied",
        errorMessage: "Location permission was denied.",
      });
      return;
    }

    const initialLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    previousCoordsRef.current = initialLocation.coords;
    setSession({
      ...baseSession,
      status: "tracking",
    });

    activeTimerRef.current = setInterval(() => {
      setSession((currentSession) => {
        if (currentSession.status !== "tracking") {
          return currentSession;
        }

        return {
          ...currentSession,
          activeSeconds: currentSession.activeSeconds + 1,
        };
      });
    }, ACTIVE_POLL_INTERVAL_MS);

    watchSubscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 5,
        timeInterval: 4000,
        mayShowUserSettingsDialog: true,
      },
      (location) => {
        const previousCoords = previousCoordsRef.current;

        previousCoordsRef.current = location.coords;

        if (!previousCoords) {
          return;
        }

        const distanceDelta = calculateDistanceMeters(previousCoords, location.coords);

        if (!Number.isFinite(distanceDelta) || distanceDelta <= 0.5) {
          return;
        }

        setSession((currentSession) => {
          if (currentSession.status !== "tracking") {
            return currentSession;
          }

          const nextDistance = currentSession.distanceMeters + distanceDelta;

          return {
            ...currentSession,
            distanceMeters: nextDistance,
            steps: distanceToSteps(nextDistance),
          };
        });
      }
    );
  }, [stopTrackingResources]);

  const clearCompletedSession = useCallback(() => {
    if (session.status === "completed" || session.status === "permission-denied") {
      setSession(idleSession);
    }
  }, [session.status]);

  const resetSession = useCallback(() => {
    stopTrackingResources();
    previousCoordsRef.current = null;
    setSession(idleSession);
  }, [stopTrackingResources]);

  return {
    session,
    startSession,
    pauseSession,
    stopSession,
    clearCompletedSession,
    resetSession,
  };
}
