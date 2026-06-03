import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { router, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";

import { ActivityProvider } from "@/providers/ActivityContext";
import { GameProvider, useGame } from "@/providers/GameContext";

void SplashScreen.preventAutoHideAsync();

function AppStack() {
  // We need to get the game state to determine which screen to show
  const { isHydrated, hasPetName } = useGame();
  const pathname = usePathname();

  useEffect(() => {
    if (isHydrated) {
      void SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const targetPath = hasPetName ? "/" : "/welcome";

    if (pathname !== targetPath) {
      router.replace(targetPath);
    }
  }, [hasPetName, isHydrated, pathname]);

  // If the game state is not yet hydrated, we don't want to render anything
  // This prevents a flash of the welcome screen before the game state is loaded
  if (!isHydrated) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        animation: "fade",
        headerShown: false,
        contentStyle: {
          backgroundColor: "#7FA37C",
        },
      }}
    >
      <Stack.Screen
        name="index"
      />
      <Stack.Screen
        name="welcome"
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // "Rubik Mono One": require("../../assets/font/RubikMonoOne-Regular.ttf"),
    "Changa One Regular": require("../../assets/font/ChangaOne-Regular.ttf"),
  });

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync("#7FA37C");
    // Hide navigation bar with immersive mode (shows on swipe-up)
    void NavigationBar.setVisibilityAsync("hidden");
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GameProvider>
      <ActivityProvider>
        <AppStack />
      </ActivityProvider>
    </GameProvider>
  )
}
