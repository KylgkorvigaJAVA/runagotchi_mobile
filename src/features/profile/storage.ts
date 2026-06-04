import AsyncStorage from "@react-native-async-storage/async-storage";

export type GpsPoint = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

export type ActivityRecord = {
  id: string;
  startedAt: string;
  elapsedTime: number;
  distanceMeters: number;
  averageSpeedKmh: number;
  route: GpsPoint[];
};

const PET_NAME_STORAGE_KEY = "petName";
const ACTIVITIES_STORAGE_KEY = "activities";

// PROFILE DATA
export async function loadPetName() {
  return AsyncStorage.getItem(PET_NAME_STORAGE_KEY);
}

export async function savePetName(petName: string) {
  await AsyncStorage.setItem(PET_NAME_STORAGE_KEY, petName.trim());
}

export async function clearPetProfile() {
  await AsyncStorage.removeItem(PET_NAME_STORAGE_KEY);
}

// ACTIVITIES HISTORY
export async function loadActivities(): Promise<ActivityRecord[]> {
  try {
    const stored = await AsyncStorage.getItem(ACTIVITIES_STORAGE_KEY);

    if (!stored) return [];

    const activities: ActivityRecord[] = JSON.parse(stored);

    return activities.sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function saveActivity(record: ActivityRecord) {
  const activities = await loadActivities();

  activities.push(record);

  await AsyncStorage.setItem(
    ACTIVITIES_STORAGE_KEY,
    JSON.stringify(activities)
  );
}

export async function clearActivities() {
  await AsyncStorage.removeItem(ACTIVITIES_STORAGE_KEY);
}
