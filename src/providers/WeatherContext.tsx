import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { resolveWeatherType, type WeatherType } from "@/lib/weather";

type WeatherContextType = {
  weather: WeatherType;
  isLoading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
  clearSavedLocation: () => Promise<void>;
};

type SavedLocation = {
  latitude: number;
  longitude: number;
};

const WeatherContext = createContext<WeatherContextType | null>(null);

const SAVED_LOCATION_KEY = "weatherLocation";

async function fetchCurrentWeather(latitude: number, longitude: number) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code,is_day&timezone=auto`
  );

  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }

  return response.json() as Promise<{
    current?: {
      weather_code?: number;
      is_day?: number;
    };
  }>;
}

async function readSavedLocation(): Promise<SavedLocation | null> {
  const storedLocation = await AsyncStorage.getItem(SAVED_LOCATION_KEY);

  if (!storedLocation) {
    return null;
  }

  try {
    const parsedLocation = JSON.parse(storedLocation) as Partial<SavedLocation>;

    if (
      typeof parsedLocation.latitude !== "number" ||
      typeof parsedLocation.longitude !== "number"
    ) {
      return null;
    }

    return {
      latitude: parsedLocation.latitude,
      longitude: parsedLocation.longitude,
    };
  } catch {
    return null;
  }
}

async function saveLocation(location: SavedLocation) {
  await AsyncStorage.setItem(SAVED_LOCATION_KEY, JSON.stringify(location));
}

async function loadWeatherForLocation(location: SavedLocation) {
  const result = await fetchCurrentWeather(
    location.latitude,
    location.longitude
  );

  const current = result.current;

  return resolveWeatherType(current?.weather_code, current?.is_day === 1);
}

export function WeatherProvider({
  children,
}: PropsWithChildren) {
  const [weather, setWeather] = useState<WeatherType>("sunny");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshWeather = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const savedLocation = await readSavedLocation();

      if (savedLocation) {
        setWeather(await loadWeatherForLocation(savedLocation));
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setWeather("sunny");
        setError("Location permission was denied.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const nextSavedLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      await saveLocation(nextSavedLocation);
      setWeather(await loadWeatherForLocation(nextSavedLocation));
    } catch (fetchError) {
      setWeather("sunny");
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load weather."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearSavedLocation = async () => {
    await AsyncStorage.removeItem(SAVED_LOCATION_KEY);
  };

  useEffect(() => {
    void refreshWeather();
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        weather,
        isLoading,
        error,
        refreshWeather,
        clearSavedLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);

  if (!ctx) {
    throw new Error("useWeather must be inside WeatherProvider");
  }

  return ctx;
}