import { Image, StyleSheet, Text, View } from "react-native";

export default function CharacterDisplay() {
  return (
    <View style={styles.container}>
      <View style={styles.characterContainer}>
        <Image source={require("@/assets/images/dog/gif/dog_state_home.gif")} style={styles.character} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.energyIcon}>⚡</Text>
          <Text style={styles.statValue}>75</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.healthIcon}>❤️</Text>
          <Text style={styles.statValue}>90</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  energyIcon: {
    fontSize: 32,
  },
  healthIcon: {
    fontSize: 32,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
