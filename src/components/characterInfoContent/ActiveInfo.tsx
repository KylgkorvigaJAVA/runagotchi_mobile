import { StyleSheet, View } from "react-native";

import { useActivity } from "../../providers/ActivityContext";
import { useGame } from "../../providers/GameContext";
import { AppText } from "../AppText";

export default function ActiveInfo() {
  const { screenState } = useGame();
  const { elapsedTime, distanceMeters, averageSpeedKmh, currentSpeedKmh } = useActivity();

  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  return (
    <View style={styles.container}>
      
      <AppText style={styles.info}>
        Distance: {(distanceMeters / 1000).toFixed(2)} km
      </AppText>

      <AppText style={styles.info}>
        {screenState === "paused"
          ? `Average speed: ${averageSpeedKmh.toFixed(1)} km/h`
          : `Current speed: ${currentSpeedKmh.toFixed(1)} km/h`
        }
      </AppText>

      <AppText style={styles.info}>
        Time: {hours}h {minutes}m {seconds}s
      </AppText>

      <AppText style={styles.activity}>
        {screenState === "paused"
          ? "PAUSED"
          : currentSpeedKmh >= 6
            ? "RUNNING"
            : "WALKING"}
      </AppText>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 180,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    zIndex: 10,
  },
  activity: {
    fontSize: 45,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: "#fff",
  },
  info: {
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: "#fff",
  },

});
