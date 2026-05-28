import { ImageBackground, ImageSourcePropType, StyleSheet } from "react-native";

type WeatherType = "sunny" | "rainy";

interface WeatherBackgroundProps { weather?: WeatherType; }

const weatherImages: Record<WeatherType, ImageSourcePropType> = {
  sunny: require("@/assets/images/bg/bg_sunny_day.png"),
  rainy: require("@/assets/images/bg/bg_rainy_day.png"),
};

export default function WeatherBackground({
  weather = "sunny",
}: WeatherBackgroundProps) {
  return (
    <ImageBackground
      source={weatherImages[weather]}
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
