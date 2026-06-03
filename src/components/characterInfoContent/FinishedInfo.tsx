import { StyleSheet, View } from "react-native";

import { useActivity } from "../../providers/ActivityContext";
import { AppText } from "../AppText";

export default function FinishedInfo() {
  const { latestFinishedActivity } = useActivity();
  const elapsedTime = latestFinishedActivity?.elapsedTime ?? 0;

  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  const distanceMeters = latestFinishedActivity?.distanceMeters ?? 0;
  const averageSpeedKmh = latestFinishedActivity?.averageSpeedKmh ?? 0;

  return (
    <View style={styles.container}>
      
      <View style={styles.mapPlaceholder} />

      <AppText style={styles.info}>
        Distance: {(distanceMeters / 1000).toFixed(2)} km
      </AppText>

      <AppText style={styles.info}>
        Average speed: {averageSpeedKmh.toFixed(1)} km/h
      </AppText>

      <AppText style={styles.info}>
        Time: {hours}h {minutes}m {seconds}s
      </AppText>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 110,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    zIndex: 10,
  },
  mapPlaceholder: {
    width: 348,
    height: 200,
    backgroundColor: "#888",
    borderRadius: 16,
    marginBottom: 12,
  },
  info: {
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: "#fff",
  },

});
