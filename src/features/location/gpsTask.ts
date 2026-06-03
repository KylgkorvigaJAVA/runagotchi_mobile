import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK_NAME = "RUNAGOTCHI_LOCATION_TASK";

type StoredLocation = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

type LocationTaskPayload = {
  locations?: Location.LocationObject[];
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }

  const payload = data as LocationTaskPayload;

  const locations = payload.locations ?? [];

  if (!locations.length) return;

  try {
    const existing = await AsyncStorage.getItem("activity_locations");

    const parsed: StoredLocation[] = existing
      ? JSON.parse(existing)
      : [];

    const mapped: StoredLocation[] = locations.map((loc) => ({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      timestamp: loc.timestamp ?? Date.now(),
    }));

    parsed.push(...mapped);

    await AsyncStorage.setItem(
      "activity_locations",
      JSON.stringify(parsed)
    );
  } catch (err) {
    console.error("Failed to save GPS locations", err);
  }
});
