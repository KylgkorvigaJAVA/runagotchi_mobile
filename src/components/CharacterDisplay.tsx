import { Image, StyleSheet, View } from "react-native";
import { AppText } from "./AppText";

export default function CharacterDisplay() {
  return (
    <View style={styles.container}>
      <View style={styles.characterContainer}>
        <Image source={require("@/assets/images/dog/gif/dog_state_home.gif")} style={styles.character} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <AppText style={styles.statIcon}>⚡</AppText>
          <AppText style={styles.statValue}>75</AppText>
        </View>
        <View style={styles.statItem}>
          <AppText style={styles.statIcon}>❤️</AppText>
          <AppText style={styles.statValue}>90</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 90,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  characterContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  character: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 40,
    justifyContent: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statIcon: {
    fontSize: 32,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statValue: {
    fontSize: 32,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: "#fff",
  },
});
