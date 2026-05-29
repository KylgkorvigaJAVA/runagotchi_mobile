import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { ActivityProvider } from "@/providers/ActivityContext";
import { GameProvider } from "@/providers/GameContext";

void SplashScreen.preventAutoHideAsync();

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

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
   const getName = async () => {
     const name = localStorage.getItem("name");
      if (name) {
        setShowWelcome(false);
      }
    };

    void getName();
  }, []);

  return (
    <GameProvider>
      <ActivityProvider>
        <Stack>
          {showWelcome ? (
            <Stack.Screen
              name="welcome"
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen name="index" options={{ headerShown: false }} />
          )}
        </Stack>
      </ActivityProvider>
    </GameProvider>
  )
}

