import { StyleSheet, View } from "react-native";

import { useGame } from "../../providers/GameContext";
import { AppText } from "../AppText";

export default function ActiveInfo() {
  const { screenState } = useGame();

  return (
    <View style={styles.container}>
      
      <AppText style={styles.info}>
        Distance: 67km
      </AppText>

      <AppText style={styles.info}>
        Avg speed: 67km/h
      </AppText>

      <AppText style={styles.info}>
        Time: 1h 2min
      </AppText>

      <AppText style={styles.activity}>
        {screenState === "paused"
          ? "PAUSED"
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
