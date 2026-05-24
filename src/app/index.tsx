import BottomNavigation from "@/components/BottomNavigation";
import { AppText } from "@/components/AppText";
import MainContent from "@/components/MainContent";
import WeatherBackground from "@/components/WeatherBackground";
import { useGame } from "@/features/gameplay/GameProvider";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const {
    homeData,
    errorMessage,
    isLoading,
    isTracking,
    weather,
    petStatus,
    petLevel,
    petLevelProgress,
    petHappiness,
    petStrength,
    petAppearance,
    resetGame,
    toggleActivityTracking,
  } = useGame();

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
        onStatsPress={() => router.push("/stats")}
        onStartPress={() => {
          void toggleActivityTracking();
        }}
        isTracking={isTracking}
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
