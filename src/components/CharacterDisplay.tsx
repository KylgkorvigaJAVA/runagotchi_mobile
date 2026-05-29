import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { screenConfig } from "@/config/ScreenConfig";
import { AppText } from "./AppText";
import { useGame } from "./GameContext";

export default function CharacterDisplay() {
  const [showDogMessage, setShowDogMessage] = useState(false);

  const { screenState, health, energy } = useGame();
  const config = screenConfig[screenState];

  useEffect(() => {
    if (!showDogMessage) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setShowDogMessage(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [showDogMessage]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.characterContainer} onPress={() => setShowDogMessage(true)}>
        <Image source={config.petImage} style={styles.character} />
        {showDogMessage && (
          <Image source={require("@/assets/images/dog/woof.png")} style={styles.dogMessage} />
        )}
      </Pressable>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <AppText style={styles.statIcon}>⚡</AppText>
          <AppText style={styles.statValue}>{energy}</AppText>
        </View>
        <View style={styles.statItem}>
          <AppText style={styles.statIcon}>❤️</AppText>
          <AppText style={styles.statValue}>{health}</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 180,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  characterContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
  },
  character: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  dogMessage: {
    position: "absolute",
    // start from the character's top-right outer corner
    top: -70,
    left: 160,
    width: 120,
    height: 120,
    resizeMode: "contain",
    pointerEvents: "none",
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
