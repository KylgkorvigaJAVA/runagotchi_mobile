import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { ActivityProvider } from "@/providers/ActivityContext";
import { GameProvider, useGame } from "@/providers/GameContext";
import { WeatherProvider } from "@/providers/WeatherContext";

void SplashScreen.preventAutoHideAsync();

function AppStack() {
  const { isHydrated, hasPetName } = useGame();

  if (!isHydrated) {
    return null;
  }

  return (
    <Stack>
      {hasPetName ? (
        <Stack.Screen
          name="index"
          options={{ headerShown: false }} />
      ) : (
        <Stack.Screen
          name="welcome"
          options={{ headerShown: false }}
        />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // "Rubik Mono One": require("../../assets/font/RubikMonoOne-Regular.ttf"),
    "Changa One Regular": require("../../assets/font/ChangaOne-Regular.ttf"),
  });

  useEffect(() => {
    // Hide navigation bar with immersive mode (shows on swipe-up)
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GameProvider>
      <WeatherProvider>
        <ActivityProvider>
          <AppStack />
        </ActivityProvider>
      </WeatherProvider>
    </GameProvider>
  )
}

