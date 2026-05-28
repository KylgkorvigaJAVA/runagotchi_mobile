import { StyleSheet, View } from "react-native";

import { AppText } from "../AppText";

export default function FinishedInfo() {

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder} />
      <AppText style={styles.info}>Distance: 67km</AppText>
      <AppText style={styles.info}>Avg speed: 67km/h</AppText>
      <AppText style={styles.info}>Time: 1h 2min</AppText>
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
