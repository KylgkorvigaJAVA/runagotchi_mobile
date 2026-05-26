import { GameProvider } from "@/features/gameplay/GameProvider";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

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

  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider>
  );
}
