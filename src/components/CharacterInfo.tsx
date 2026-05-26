import { StyleSheet, View } from "react-native";
import { AppText } from "./AppText";

interface CharacterInfoProps {
  name: string;
  status: string;
  level: number;
  levelProgress: number;
}

export default function CharacterInfo({
  name,
  status,
  level,
  levelProgress,
}: CharacterInfoProps) {
  return (
    <View style={styles.container}>
      <AppText style={styles.name}>{name}</AppText>
      <AppText style={styles.status}>{status}</AppText>
      
      <View style={styles.levelContainer}>
        <View style={styles.levelHeader}>
          <AppText style={styles.levelLabel}>Level {level}</AppText>
        </View>
        <View style={styles.levelBar}>
          <View style={[styles.levelProgress, { width: `${Math.max(0, Math.min(levelProgress, 100))}%` }]} />
        </View>
      </View>
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
  levelContainer: {
    width: "60%",
    gap: 8,
  },
  levelHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  levelLabel: {
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    color: "#fff",
  },
  levelBar: {
    width: "100%",
    height: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    overflow: "hidden",
  },
  levelProgress: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
});
