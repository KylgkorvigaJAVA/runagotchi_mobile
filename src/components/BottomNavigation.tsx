import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from "react-native";

import { screenConfig } from "@/config/ScreenConfig";
import { useGame } from "./GameContext";

type BottomNavigationProps = {
  onPressStats?: () => void;
  onPressShop?: () => void;
};

const buttonImages: Record<string, ImageSourcePropType> = {
  stats: require("@/assets/images/btn/stats_btn.png"),

  startActivity: require("@/assets/images/btn/start_activity_btn.png"),

  shop: require("@/assets/images/btn/shop_btn.png"),

  back: require("@/assets/images/btn/back_btn.png"),

  start: require("@/assets/images/btn/go_btn.png"),

  pause: require("@/assets/images/btn/pause_btn.png"),

  continue: require("@/assets/images/btn/go_btn.png"),

  finish: require("@/assets/images/btn/stop_btn.png"),
};

export default function BottomNavigation({ onPressStats, onPressShop }: BottomNavigationProps) {
  const { screenState, setScreenState } = useGame();
  const config = screenConfig[screenState];

  const buttonActions: Record<string, () => void> = {
    stats: () => {
      onPressStats?.();
    },

    startActivity: () => {
      setScreenState("ready");
    },

    shop: () => {
      onPressShop?.();
    },

    back: () => {
      setScreenState("home");
    },

    start: () => {
      setScreenState("running");
    },

    pause: () => {
      setScreenState("paused");
    },

    continue: () => {
      setScreenState("running");
    },

    finish: () => {
      setScreenState("finished");
    },
  };

  return (
    <View style={styles.container}>
      {config.buttons.map((button) => {
        const isMainButton =
          button === "startActivity" ||
          button === "start";

        return (
          <TouchableOpacity
            key={button}
            style={
              isMainButton
                ? styles.mainButton
                : styles.sideButton
            }
            onPress={buttonActions[button]}
          >
            <Image
              source={buttonImages[button]}
              style={
                isMainButton
                  ? styles.mainButtonImage
                  : styles.sideButtonImage
              }
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 16,

    paddingBottom: 24,
    paddingHorizontal: 16,
  },

  sideButton: {
    width: 100,
    height: 80,

    justifyContent: "center",
    alignItems: "center",
  },

  mainButton: {
    width: 120,
    height: 120,

    justifyContent: "center",
    alignItems: "center",
  },

  sideButtonImage: {
    width: 80,
    height: 80,
  },

  mainButtonImage: {
    width: 120,
    height: 120,
  },
});
