import { StyleSheet, View } from "react-native";
import { AppText } from "./AppText";

export default function CharacterInfo() {
  return (
    <View style={styles.container}>
      <AppText style={styles.name}>Bella</AppText>
      <AppText style={styles.status}>Ready for a walk!</AppText>
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
