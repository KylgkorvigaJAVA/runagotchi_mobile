import BottomNavigation from "@/components/BottomNavigation";
import MainContent from "@/components/MainContent";
import WeatherBackground from "@/components/WeatherBackground";
import { useState } from "react";

export default function Index() {
  //for weather api
  const [weather] = useState<"sunny" | "rainy">("sunny");

  return (
    <WeatherBackground weather={weather}>
      <MainContent />
      <BottomNavigation />
    </WeatherBackground>
  );
}
