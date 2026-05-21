import { StyleSheet, Text, View } from "react-native";

export default function CharacterInfo() {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Bella</Text>
      <Text style={styles.status}>(STATUS)Ready for a walk!</Text>
      
      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelLabel}>Level</Text>
          <Text style={styles.levelNumber}>5</Text>
        </View>
        <View style={styles.levelBar}>
          <View style={[styles.levelProgress, { width: "65%" }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  status: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  levelContainer: {
    gap: 8,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  levelNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  levelBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  levelProgress: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
});
