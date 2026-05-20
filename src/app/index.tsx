import BottomNavigation from "@/components/BottomNavigation";
import WeatherBackground from "@/components/WeatherBackground";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  //for weather api
  const [weather] = useState<"sunny" | "rainy">("sunny");

  return (
    <WeatherBackground weather={weather}>
      <View style={styles.content}>
        <Text>Your app content here</Text>
      </View>
      <BottomNavigation />
    </WeatherBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
