import AsyncStorage from "@react-native-async-storage/async-storage";

const PET_NAME_STORAGE_KEY = "petName";

export async function loadPetName() {
  return AsyncStorage.getItem(PET_NAME_STORAGE_KEY);
}

export async function savePetName(petName: string) {
  await AsyncStorage.setItem(PET_NAME_STORAGE_KEY, petName.trim());
}

export async function clearPetProfile() {
  await AsyncStorage.removeItem(PET_NAME_STORAGE_KEY);
}
