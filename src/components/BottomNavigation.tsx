import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface BottomNavigationProps {
  isTracking: boolean;
  onStatsPress: () => void;
  onStartPress: () => void;
}

export default function BottomNavigation({
  isTracking,
  onStatsPress,
  onStartPress,
}: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.statsBtn} onPress={onStatsPress}>
        <Image source={require("@/assets/images/btn/stats_btn.png")} style={{ width: 80, height: 80 }} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.startActivityBtn, isTracking ? styles.startActivityBtnActive : undefined]}
        onPress={onStartPress}
      >
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
  startActivityBtnActive: {
    opacity: 0.86,
  },
  shopBtn: {
    width: 100,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});
