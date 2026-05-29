import { StyleSheet, View } from "react-native";
import { AppText } from "../AppText";

import { useGame } from "../../providers/GameContext";

export default function IdleInfo() {
  const { petName } = useGame();

  return (
    <View style={styles.container}>
      <AppText style={styles.name}>{ petName }</AppText>
      <AppText style={styles.status}>Feeling happy!</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 220,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    zIndex: 10,
  },
  name: {
    fontSize: 45,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: "#fff",
  },
  status: {
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: "#fff",
  },

});
