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
const HEALTH_STORAGE_KEY = "health";
const ENERGY_STORAGE_KEY = "energy";
const LAST_HEALTH_DECAY_DATE_KEY = "lastHealthDecayDate";
const LAST_ENERGY_DECAY_DATE_KEY = "lastEnergyDecayDate";

// PROFILE DATA
export async function loadPetName() {
  return AsyncStorage.getItem(PET_NAME_STORAGE_KEY);
}

export async function savePetName(petName: string) {
  await AsyncStorage.setItem(PET_NAME_STORAGE_KEY, petName.trim());
  await AsyncStorage.setItem(LAST_HEALTH_DECAY_DATE_KEY, Date.now().toString());
  await AsyncStorage.setItem(LAST_ENERGY_DECAY_DATE_KEY, Date.now().toString());
}

export async function clearPetProfile() {
  await AsyncStorage.multiRemove([
    PET_NAME_STORAGE_KEY,
    HEALTH_STORAGE_KEY,
    ENERGY_STORAGE_KEY,
    LAST_HEALTH_DECAY_DATE_KEY,
    LAST_ENERGY_DECAY_DATE_KEY,
  ]);
}

export async function loadHealth() {
  const value = await AsyncStorage.getItem(HEALTH_STORAGE_KEY);
  return value ? Number(value) : 50;
}

export async function saveHealth(health: number) {
  await AsyncStorage.setItem(HEALTH_STORAGE_KEY, health.toString());
}

export async function loadLastHealthDecayDate(): Promise<number> {
  const stored = await AsyncStorage.getItem(LAST_HEALTH_DECAY_DATE_KEY);
  return stored ? Number(stored) : Date.now();
}

export async function saveLastHealthDecayDate(timestamp: number) {
  await AsyncStorage.setItem(LAST_HEALTH_DECAY_DATE_KEY, timestamp.toString());
}

export async function loadEnergy() {
  const value = await AsyncStorage.getItem(ENERGY_STORAGE_KEY);
  return value ? Number(value) : 80;
}

export async function saveEnergy(energy: number) {
  await AsyncStorage.setItem(ENERGY_STORAGE_KEY, energy.toString());
}

export async function loadLastEnergyDecayDate(): Promise<number> {
  const stored = await AsyncStorage.getItem(LAST_ENERGY_DECAY_DATE_KEY);
  return stored ? Number(stored) : Date.now();
}

export async function saveLastEnergyDecayDate(timestamp: number) {
  await AsyncStorage.setItem(LAST_ENERGY_DECAY_DATE_KEY, timestamp.toString());
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
