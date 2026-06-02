import BottomNavigation from "@/components/BottomNavigation";
import MainContent from "@/components/MainContent";
import WeatherBackground from "@/components/WeatherBackground";
import type { WeatherType } from "@/lib/weather";
import { useWeather } from "@/providers/WeatherContext";
import { useRef, useState } from "react";
import { Animated, Dimensions, Image, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";

const EDGE_GAP = 25;
const PANEL_WIDTH = Math.max(0, Dimensions.get("window").width - EDGE_GAP);
const TEST_WEATHERS: WeatherType[] = [
  "sunny",
  "rainy",
  "cloudy",
  "night_cloudy",
  "night_clear",
  "night_rainy",
];

export default function Index() {
  const { weather, isLoading, error, refreshWeather, clearSavedLocation } = useWeather();
  const [weatherOverride, setWeatherOverride] = useState<WeatherType | null>(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const statsX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const shopX = useRef(new Animated.Value(PANEL_WIDTH)).current;
  const activeWeather = weatherOverride ?? weather;

  const openStats = () => {
    if (isShopOpen) {
      Animated.timing(shopX, { toValue: PANEL_WIDTH, duration: 180, useNativeDriver: true }).start(() => setIsShopOpen(false));
    }
    setIsStatsOpen(true);
    Animated.timing(statsX, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  };

  const closeStats = () => {
    Animated.timing(statsX, { toValue: -PANEL_WIDTH, duration: 180, useNativeDriver: true }).start(() => setIsStatsOpen(false));
  };

  const openShop = () => {
    if (isStatsOpen) {
      Animated.timing(statsX, { toValue: -PANEL_WIDTH, duration: 180, useNativeDriver: true }).start(() => setIsStatsOpen(false));
    }
    setIsShopOpen(true);
    Animated.timing(shopX, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  };

  const closeShop = () => {
    Animated.timing(shopX, { toValue: PANEL_WIDTH, duration: 180, useNativeDriver: true }).start(() => setIsShopOpen(false));
  };

  const statsPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        if (g.dx < 0) {
          statsX.setValue(Math.max(-PANEL_WIDTH, g.dx));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx < -PANEL_WIDTH * 0.25) {
          closeStats();
          return;
        }
        Animated.spring(statsX, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  const shopPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        if (g.dx > 0) {
          shopX.setValue(Math.min(PANEL_WIDTH, g.dx));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > PANEL_WIDTH * 0.25) {
          closeShop();
          return;
        }
        Animated.spring(shopX, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }}>
      <WeatherBackground weather={activeWeather} />
      {__DEV__ && (
        <View style={styles.debugBox} pointerEvents="box-none">
          <View style={styles.debugPanel}>
            <Pressable style={styles.debugButton} onPress={() => void refreshWeather()}>
              <Text style={styles.debugText}>{isLoading ? "Refreshing..." : `Live: ${weather}`}</Text>
            </Pressable>
            <Pressable style={styles.debugButtonSecondary} onPress={() => setWeatherOverride(null)}>
              <Text style={styles.debugTextSecondary}>Use live weather</Text>
            </Pressable>
            <Pressable
              style={styles.debugButtonSecondary}
              onPress={async () => {
                await clearSavedLocation();
                await refreshWeather();
              }}
            >
              <Text style={styles.debugTextSecondary}>Reset saved location</Text>
            </Pressable>
            <View style={styles.debugGrid}>
              {TEST_WEATHERS.map((item) => {
                const isActive = activeWeather === item;

                return (
                  <Pressable
                    key={item}
                    style={[styles.weatherChip, isActive && styles.weatherChipActive]}
                    onPress={() => setWeatherOverride(item)}
                  >
                    <Text style={[styles.weatherChipText, isActive && styles.weatherChipTextActive]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          {error ? <Text style={styles.debugError}>{error}</Text> : null}
        </View>
      )}
      
      <MainContent />
      <BottomNavigation onPressStats={openStats} onPressShop={openShop} />

      {(isStatsOpen || isShopOpen) && <Pressable style={styles.backdrop} onPress={() => (isStatsOpen ? closeStats() : closeShop())} />}

      {isStatsOpen && (
        <Animated.View style={[styles.leftPanel, { transform: [{ translateX: statsX }] }]} {...statsPan.panHandlers}>
          <View style={[styles.swipeEdge, styles.swipeEdgeRight]} />
          <Pressable style={styles.closeButton} onPress={closeStats}>
            <Image source={require("@/assets/images/btn/close_btn.png")} style={styles.closeImage} />
          </Pressable>
        </Animated.View>
      )}

      {isShopOpen && (
        <Animated.View style={[styles.rightPanel, { transform: [{ translateX: shopX }] }]} {...shopPan.panHandlers}>
          <View style={[styles.swipeEdge, styles.swipeEdgeLeft]} />
          <Pressable style={[styles.closeButton, styles.closeButtonLeft]} onPress={closeShop}>
            <Image source={require("@/assets/images/btn/close_btn.png")} style={styles.closeImage} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 10,
  },
  leftPanel: {
    position: "absolute",
    left: 0,
    right: EDGE_GAP,
    top: EDGE_GAP,
    bottom: EDGE_GAP,
    backgroundColor: "#7FA37C",
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: "#486346",
    zIndex: 20,
    borderRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  rightPanel: {
    position: "absolute",
    right: 0,
    left: EDGE_GAP,
    top: EDGE_GAP,
    bottom: EDGE_GAP,
    backgroundColor: "#7FA37C",
    borderLeftWidth: 5,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: "#486346",
    zIndex: 20,
    borderRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  closeButtonLeft: {
    left: 8,
    right: undefined,
  },
  closeImage: {
    width: 70,
    height: 70,
  },
  swipeEdge: {
    position: "absolute",
    top: "50%",
    marginTop: -28,
    width: 6,
    height: 56,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  swipeEdgeRight: {
    right: 4,
  },
  swipeEdgeLeft: {
    left: 4,
  },
  debugBox: {
    position: "absolute",
    top: 160,
    left: 0,
    zIndex: 30,
    alignItems: "flex-start",
  },
  debugPanel: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 10,
    gap: 6,
    width: 132,
  },
  debugButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  debugText: {
    color: "#fff",
    fontSize: 11,
  },
  debugButtonSecondary: {
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  debugTextSecondary: {
    color: "#fff",
    fontSize: 11,
  },
  debugGrid: {
    flexDirection: "column",
    gap: 4,
  },
  weatherChip: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  weatherChipActive: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderColor: "rgba(255,255,255,0.6)",
  },
  weatherChipText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 10,
    textTransform: "capitalize",
  },
  weatherChipTextActive: {
    color: "#fff",
  },
  debugError: {
    marginTop: 6,
    color: "#ffdddd",
    backgroundColor: "rgba(255,0,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
  },
});
