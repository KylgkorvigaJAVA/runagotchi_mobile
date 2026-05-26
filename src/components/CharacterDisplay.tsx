import { useEffect, useState } from "react";
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from "react-native";
import { PetAppearanceState } from "@/features/activity/types";
import { AppText } from "./AppText";

interface CharacterDisplayProps {
  happiness: number;
  strength: number;
  level: number;
  appearance: PetAppearanceState;
}

const activityAppearanceImages = {
  ready: require("@/assets/images/dog/gif/dog_activity_ready.gif"),
  pause: require("@/assets/images/dog/gif/dog_activity_pause.gif"),
  done: require("@/assets/images/dog/gif/dog_activity_done.gif"),
} as const;

interface HomeAppearanceStage {
  minimumLevel: number;
  alt: string;
  image?: ImageSourcePropType;
}

const homeAppearanceStages: HomeAppearanceStage[] = [
  {
    minimumLevel: 1,
    alt: "Home pet art for level 1",
  },
  {
    minimumLevel: 5,
    alt: "Home pet art for level 5",
    image: require("@/assets/images/dog/health/dog_state_home.png"),
  },
  {
    minimumLevel: 10,
    alt: "Home pet art for level 10",
  },
  {
    minimumLevel: 15,
    alt: "Home pet art for level 15",
  },
  {
    minimumLevel: 20,
    alt: "Home pet art for level 20",
  },
  {
    minimumLevel: 25,
    alt: "Home pet art for level 25",
  },
];

function getHomeAppearance(level: number) {
  return (
    [...homeAppearanceStages]
      .reverse()
      .find((entry) => level >= entry.minimumLevel) ?? homeAppearanceStages[0]
  );
}

export default function CharacterDisplay({
  happiness,
  strength,
  level,
  appearance,
}: CharacterDisplayProps) {
  const [showDogMessage, setShowDogMessage] = useState(false);
  const homeAppearance = getHomeAppearance(level);
  const characterImage = appearance === "home" ? homeAppearance.image : activityAppearanceImages[appearance];

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
        {characterImage ? (
          <Image
            accessibilityLabel={appearance === "home" ? homeAppearance.alt : `Dog ${appearance} state`}
            source={characterImage}
            style={styles.character}
          />
        ) : (
          <View
            accessibilityLabel={homeAppearance.alt}
            accessible
            style={[styles.character, styles.placeholderCharacter]}
          >
            <AppText style={styles.placeholderText}>{homeAppearance.alt}</AppText>
          </View>
        )}
        {showDogMessage && (
          <Image source={require("@/assets/images/dog/woof.png")} style={styles.dogMessage} />
        )}
      </Pressable>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <AppText style={styles.statIcon}>⚡</AppText>
          <AppText style={styles.statValue}>{happiness}</AppText>
        </View>
        <View style={styles.statItem}>
          <AppText style={styles.statIcon}>❤️</AppText>
          <AppText style={styles.statValue}>{strength}</AppText>
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
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
  },
  character: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  placeholderCharacter: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 3,
    borderColor: "#ffffff",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  placeholderText: {
    fontSize: 18,
    lineHeight: 26,
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
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
