import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from "react-native";

import { useActivity } from "../providers/ActivityContext";
import { useGame } from "../providers/GameContext";

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
  const {
    startActivity,
    pauseActivity,
    resumeActivity,
    finishActivity,
  } = useActivity();

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
      startActivity();
      setScreenState("running");
    },

    pause: () => {
      pauseActivity();
      setScreenState("paused");
    },

    continue: () => {
      resumeActivity();
      setScreenState("running");
    },

    finish: () => {
      finishActivity();
      setScreenState("finished");
    },
  };

  const wideButtons = [
    "start",
    "pause",
    "continue",
    "finish",
  ];

  const renderButton = (
    button: string,
    isMain = false
  ) => (
    <TouchableOpacity
      key={button}
      style={
        wideButtons.includes(button)
          ? styles.wideButton
          : isMain
            ? styles.mainButton
            : styles.sideButton
      }
      onPress={buttonActions[button]}
    >
      <Image
        source={buttonImages[button]}
        style={
          wideButtons.includes(button)
            ? styles.wideButtonImage
            : isMain
              ? styles.mainButtonImage
              : styles.sideButtonImage
        }
      />
    </TouchableOpacity>
  );

  // HOME
  if (screenState === "home") {
    return (
      <View style={styles.tripleContainer}>
        {renderButton("stats")}
        {renderButton("startActivity", true)}
        {renderButton("shop")}
      </View>
    );
  }

  // READY
  if (screenState === "ready") {
    return (
      <View style={styles.tripleContainer}>
        {renderButton("back")}

        {renderButton("start")}

        <View style={styles.emptySlot} />
      </View>
    );
  }

  // RUNNING / PAUSED
  if (
    screenState === "running" ||
    screenState === "paused"
  ) {
    return (
      <View style={styles.doubleContainer}>
        {screenState === "running"
          ? renderButton("pause")
          : renderButton("continue")}

        {renderButton("finish")}
      </View>
    );
  }

  // FINISHED
  return (
    <View style={styles.finishedContainer}>
      {renderButton("back")}
    </View>
  );
}

const styles = StyleSheet.create({
  tripleContainer: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "flex-end",

    paddingBottom: 24,
    paddingHorizontal: 24,
  },

  doubleContainer: {
    flexDirection: "row",

    justifyContent: "center",

    alignItems: "flex-end",

    gap: 15,

    paddingBottom: 24,
  },

  finishedContainer: {
    flexDirection: "row",

    justifyContent: "flex-start",

    paddingLeft: 24,
    paddingBottom: 24,
  },

  emptySlot: {
    width: 100,
    height: 80,
  },

  sideButton: {
    width: 100,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },

  mainButton: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },

  wideButton: {
    width: 150,
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
  
  wideButtonImage: {
    width: 180,
    height: 70,
    resizeMode: "contain",
  },
});
