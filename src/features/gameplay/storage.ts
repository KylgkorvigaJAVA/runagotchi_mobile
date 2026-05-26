import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityTotals } from "@/features/activity/types";
import { HomeScreenData } from "@/features/home/types";

const GAME_STATE_STORAGE_KEY = "runagotchi_mobile.game_state";

export interface StoredGameState {
  homeData: HomeScreenData;
  activityTotals: ActivityTotals;
}

export async function loadStoredGameState() {
  const rawState = await AsyncStorage.getItem(GAME_STATE_STORAGE_KEY);

  if (!rawState) {
    return null;
  }

  return JSON.parse(rawState) as StoredGameState;
}

export async function saveStoredGameState(state: StoredGameState) {
  await AsyncStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(state));
}

export async function clearStoredGameState() {
  await AsyncStorage.removeItem(GAME_STATE_STORAGE_KEY);
}
