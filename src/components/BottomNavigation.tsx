import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

type ActivityNavigationState = "default" | "ready" | "tracking" | "paused" | "completed";

interface BottomNavigationProps {
  activityState: ActivityNavigationState;
  isBackDisabled?: boolean;
  onStatsPress: () => void;
  onActivityPress: () => void;
  onBackPress: () => void;
  onGoPress: () => void;
  onPausePress: () => void;
  onStopPress: () => void;
}

export default function BottomNavigation({
  activityState,
  isBackDisabled = false,
  onStatsPress,
  onActivityPress,
  onBackPress,
  onGoPress,
  onPausePress,
  onStopPress,
}: BottomNavigationProps) {
  if (activityState !== "default") {
    const isTracking = activityState === "tracking";
    const isPaused = activityState === "paused";
    const canStart = activityState !== "tracking";
    const canPause = isTracking;
    const canStop = isTracking || isPaused;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.activityActionBtn, isBackDisabled ? styles.inactiveButton : undefined]}
          disabled={isBackDisabled}
          onPress={onBackPress}
        >
          <Image source={require("@/assets/images/btn/back_btn.png")} style={styles.controlButtonImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.activityActionBtn, !canStart ? styles.inactiveButton : undefined]}
          disabled={!canStart}
          onPress={onGoPress}
        >
          <Image source={require("@/assets/images/btn/go_btn.png")} style={styles.controlButtonImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.activityActionBtn, !canPause ? styles.inactiveButton : undefined]}
          disabled={!canPause}
          onPress={onPausePress}
        >
          <Image source={require("@/assets/images/btn/pause_btn.png")} style={styles.controlButtonImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.activityActionBtn, !canStop ? styles.inactiveButton : undefined]}
          disabled={!canStop}
          onPress={onStopPress}
        >
          <Image source={require("@/assets/images/btn/stop_btn.png")} style={styles.controlButtonImage} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.statsBtn} onPress={onStatsPress}>
        <Image source={require("@/assets/images/btn/stats_btn.png")} style={{ width: 80, height: 80 }} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.startActivityBtn} onPress={onActivityPress}>
        <Image source={require("@/assets/images/btn/start_activity_btn.png")} style={{ width: 120, height: 120 }} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.shopBtn}>
        <Image source={require("@/assets/images/btn/shop_btn.png")} style={{ width: 80, height: 80 }} />
      </TouchableOpacity>
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
  statsBtn: {
    width: 100,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  startActivityBtn: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  shopBtn: {
    width: 100,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  activityActionBtn: {
    width: 76,
    height: 76,
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonImage: {
    width: 76,
    height: 76,
    resizeMode: "contain",
  },
  inactiveButton: {
    opacity: 0.5,
  },
});
