import BottomNavigation from "@/components/BottomNavigation";
import { AppText } from "@/components/AppText";
import MainContent from "@/components/MainContent";
import WeatherBackground from "@/components/WeatherBackground";
import { useGame } from "@/features/gameplay/GameProvider";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const {
    activityStatus,
    homeData,
    errorMessage,
    isActivityControlsOpen,
    isLoading,
    isTracking,
    pauseActivityTracking,
    weather,
    petStatus,
    petLevel,
    petLevelProgress,
    petHappiness,
    petStrength,
    petAppearance,
    closeActivityControls,
    openActivityControls,
    resetGame,
    startActivityTracking,
    stopActivityTracking,
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

  if (isLoading || !homeData) {
    return (
      <WeatherBackground weather="sunny">
        <View style={styles.centeredState}>
          <AppText style={styles.stateText}>
            {errorMessage ?? "Loading home data..."}
          </AppText>
        </View>
      </WeatherBackground>
    );
  }

  return (
    <WeatherBackground weather={weather}>
      <MainContent
        homeData={homeData}
        onMenuPress={() => {
          void resetGame();
        }}
        petStatus={petStatus}
        petLevel={petLevel}
        petLevelProgress={petLevelProgress}
        petHappiness={petHappiness}
        petStrength={petStrength}
        petAppearance={petAppearance}
      />
      <BottomNavigation
        activityState={activityState}
        isBackDisabled={activityState === "tracking" || activityState === "paused"}
        onBackPress={closeActivityControls}
        onGoPress={() => {
          void startActivityTracking();
        }}
        onPausePress={pauseActivityTracking}
        onStatsPress={() => router.push("/stats")}
        onActivityPress={() => {
          openActivityControls();
        }}
        onStopPress={stopActivityTracking}
      />
    </WeatherBackground>
  );
}

const styles = StyleSheet.create({
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
