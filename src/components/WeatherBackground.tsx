import { PropsWithChildren } from "react";
import { ImageBackground, ImageSourcePropType, StyleSheet } from "react-native";
import { WeatherType } from "@/features/home/types";

interface WeatherBackgroundProps extends PropsWithChildren {
  weather?: WeatherType;
}

const weatherImages: Record<WeatherType, ImageSourcePropType> = {
  sunny: require("@/assets/images/bg/bg_sunny_day.png"),
  rainy: require("@/assets/images/bg/bg_rainy_day.png"),
};

export default function WeatherBackground({
  weather = "sunny",
  children,
}: WeatherBackgroundProps) {
  return (
    <ImageBackground
      source={weatherImages[weather]}
      style={styles.container}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
