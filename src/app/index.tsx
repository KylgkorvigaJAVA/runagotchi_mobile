import BottomNavigation from "@/components/BottomNavigation";
import MainContent from "@/components/MainContent";
import WeatherBackground from "@/components/WeatherBackground";
import { useRef, useState } from "react";
import { Animated, Dimensions, Image, PanResponder, Pressable, StyleSheet, View } from "react-native";

const EDGE_GAP = 25;
const PANEL_WIDTH = Math.max(0, Dimensions.get("window").width - EDGE_GAP);

export default function Index() {
  //for weather api
  const [weather] = useState<"sunny" | "rainy">("sunny");
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const statsX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const shopX = useRef(new Animated.Value(PANEL_WIDTH)).current;

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

  const createHorizontalPanResponder = (
    animatedValue: Animated.Value,
    onClose: () => void,
    direction: 'left' | 'right'
  ) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        if (direction === 'left' && g.dx < 0) {
          animatedValue.setValue(Math.max(-PANEL_WIDTH, g.dx));
        } else if (direction === 'right' && g.dx > 0) {
          animatedValue.setValue(Math.min(PANEL_WIDTH, g.dx));
        }
      },
      onPanResponderRelease: (_, g) => {
        const threshold = direction === 'left' ? -PANEL_WIDTH * 0.25 : PANEL_WIDTH * 0.25;
        const shouldClose = direction === 'left' ? g.dx < threshold : g.dx > threshold;
        if (shouldClose) {
          onClose();
          return;
        }
        Animated.spring(animatedValue, { toValue: 0, useNativeDriver: true }).start();
      },
    });
  };

  const statsPan = useRef(createHorizontalPanResponder(statsX, closeStats, 'left')).current;
  const shopPan = useRef(createHorizontalPanResponder(shopX, closeShop, 'right')).current;

  return (
    <View style={styles.container}>
      <WeatherBackground weather={weather} />
      
      <MainContent />
      <BottomNavigation onPressStats={openStats} onPressShop={openShop} />

      {(isStatsOpen || isShopOpen) && (
        <Pressable
          testID="overlay-backdrop"
          style={styles.backdrop}
          onPress={() => (isStatsOpen ? closeStats() : closeShop())}
        />
      )}

      {isStatsOpen && (
        <Animated.View
          testID="stats-panel"
          style={[styles.leftPanel, { transform: [{ translateX: statsX }] }]}
          {...statsPan.panHandlers}
        >
          <View style={[styles.swipeEdge, styles.swipeEdgeRight]} />
          <Pressable testID="close-stats-button" style={styles.closeButton} onPress={closeStats}>
            <Image source={require("@/assets/images/btn/close_btn.png")} style={styles.closeImage} />
          </Pressable>
        </Animated.View>
      )}

      {isShopOpen && (
        <Animated.View
          testID="shop-panel"
          style={[styles.rightPanel, { transform: [{ translateX: shopX }] }]}
          {...shopPan.panHandlers}
        >
          <View style={[styles.swipeEdge, styles.swipeEdgeLeft]} />
          <Pressable testID="close-shop-button" style={[styles.closeButton, styles.closeButtonLeft]} onPress={closeShop}>
            <Image source={require("@/assets/images/btn/close_btn.png")} style={styles.closeImage} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7FA37C",
  },
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
});
