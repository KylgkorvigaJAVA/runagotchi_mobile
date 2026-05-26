import BottomNavigation from "@/components/BottomNavigation";
import { AppText } from "@/components/AppText";
import StatsPanel from "@/components/StatsPanel";
import WeatherBackground from "@/components/WeatherBackground";
import { useGame } from "@/features/gameplay/GameProvider";
import { router } from "expo-router";
import { useMemo, useRef } from "react";
import { Animated, PanResponder, StyleSheet, View } from "react-native";

const DISMISS_DISTANCE = 120;

export default function StatsScreen() {
  const {
    activityStatus,
    errorMessage,
    homeData,
    isActivityControlsOpen,
    isLoading,
    isTracking,
    pauseActivityTracking,
    statsMetrics,
    closeActivityControls,
    openActivityControls,
    startActivityTracking,
    stopActivityTracking,
    weather,
  } = useGame();
  const activityState =
    activityStatus === "tracking"
      ? "tracking"
      : activityStatus === "paused"
        ? "paused"
        : activityStatus === "completed" && isActivityControlsOpen
          ? "completed"
          : isActivityControlsOpen
            ? "ready"
            : "default";
  const panPosition = useRef(new Animated.ValueXY()).current;
  const panelOpacity = panPosition.y.interpolate({
    inputRange: [0, DISMISS_DISTANCE * 1.5],
    outputRange: [1, 0.65],
    extrapolate: "clamp",
  });
  const statsPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 8 || Math.abs(gestureState.dx) > 8,
        onPanResponderMove: (_, gestureState) => {
          panPosition.setValue({
            x: gestureState.dx,
            y: Math.max(gestureState.dy, 0),
          });
        },
        onPanResponderRelease: (_, gestureState) => {
          const shouldDismiss =
            gestureState.dy > DISMISS_DISTANCE || Math.abs(gestureState.dx) > DISMISS_DISTANCE;

          if (shouldDismiss) {
            Animated.timing(panPosition, {
              toValue: {
                x: gestureState.dx > 0 ? 420 : gestureState.dx < 0 ? -420 : 0,
                y: gestureState.dy > 0 ? 640 : 0,
              },
              duration: 180,
              useNativeDriver: true,
            }).start(() => {
              router.replace("/");
            });
            return;
          }

          Animated.spring(panPosition, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        },
      }),
    [panPosition]
  );

  if (isLoading || !homeData) {
    return (
      <WeatherBackground weather="sunny">
        <View style={styles.centeredState}>
          <AppText style={styles.stateText}>
            {errorMessage ?? "Loading stats..."}
          </AppText>
        </View>
      </WeatherBackground>
    );
  }

  return (
    <WeatherBackground weather={weather}>
      <Animated.View
        style={[
          styles.panelContainer,
          {
            opacity: panelOpacity,
            transform: [
              { translateX: panPosition.x },
              { translateY: panPosition.y },
            ],
          },
        ]}
        {...statsPanResponder.panHandlers}
      >
        <StatsPanel metrics={statsMetrics} />
      </Animated.View>
      <BottomNavigation
        activityState={activityState}
        isBackDisabled={activityState === "tracking" || activityState === "paused"}
        onBackPress={closeActivityControls}
        onGoPress={() => {
          void startActivityTracking();
        }}
        onPausePress={pauseActivityTracking}
        onStatsPress={() => router.replace("/")}
        onActivityPress={() => {
          openActivityControls();
        }}
        onStopPress={stopActivityTracking}
      />
    </WeatherBackground>
  );
}

const styles = StyleSheet.create({
  panelContainer: {
    flex: 1,
  },
  centeredState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stateText: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
