import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Hide navigation bar with immersive mode (shows on swipe-up)
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
