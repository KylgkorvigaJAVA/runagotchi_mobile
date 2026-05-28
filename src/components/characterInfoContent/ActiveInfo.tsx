import { StyleSheet, View } from "react-native";

import { AppText } from "../AppText";

export default function ActiveInfo() {

  return (
    <View style={styles.container}>
      <AppText style={styles.info}>Distance: 67km</AppText>
      <AppText style={styles.info}>Avg speed: 67km/h</AppText>
      <AppText style={styles.info}>Time: 1h 2min</AppText>
      <AppText style={styles.activity}>WALKING</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 100,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
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
