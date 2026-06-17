import { useEffect, useState } from "react";
import { Image, ImageBackground, ImageSourcePropType, StyleSheet, View } from "react-native";

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
  const nextImage = getWeatherImage(weather);
  const [displayedImage, setDisplayedImage] = useState(nextImage);
  const [pendingImage, setPendingImage] = useState<ImageSourcePropType | null>(null);

  useEffect(() => {
    if (nextImage !== displayedImage) {
      setPendingImage(nextImage);
    }
  }, [displayedImage, nextImage]);

  return (
    <View style={styles.container}>
      <ImageBackground source={displayedImage} style={styles.container} resizeMode="cover" />
      {pendingImage ? (
        <Image
          source={pendingImage}
          style={styles.preload}
          onLoadEnd={() => {
            setDisplayedImage(pendingImage);
            setPendingImage(null);
          }}
          onError={() => {
            setDisplayedImage(pendingImage);
            setPendingImage(null);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  preload: {
    height: 1,
    opacity: 0,
    position: "absolute",
    width: 1,
  },
});
