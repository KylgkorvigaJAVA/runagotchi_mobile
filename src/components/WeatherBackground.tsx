import { ImageBackground, ImageSourcePropType, StyleSheet } from "react-native";

import type { WeatherType } from "@/lib/weather";

interface WeatherBackgroundProps {
  weather?: WeatherType | string | null;
}

const weatherImages: Record<WeatherType, ImageSourcePropType> = {
  sunny: require("@/assets/images/bg/bg_sunny_day.png"),
  rainy: require("@/assets/images/bg/bg_rainy_day.png"),
  cloudy: require("@/assets/images/bg/bg_cloudy_day.png"),
  partly_cloudy: require("@/assets/images/bg/bg_partly_cloudy_day.png"),
  night_clear: require("@/assets/images/bg/bg_clear_night.png"),
  night_rainy: require("@/assets/images/bg/bg_rainy_night.png"),
};

const fallbackWeatherImage = require("@/assets/images/bg/bg_partly_cloudy_day.png");

function getWeatherImage(weather?: WeatherBackgroundProps["weather"]) {
  if (weather && Object.prototype.hasOwnProperty.call(weatherImages, weather)) {
    return weatherImages[weather as WeatherType];
  }

  return fallbackWeatherImage;
}

export default function WeatherBackground({
  weather = "sunny",
}: WeatherBackgroundProps) {
  return (
    <ImageBackground
      source={getWeatherImage(weather)}
      style={styles.container}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
