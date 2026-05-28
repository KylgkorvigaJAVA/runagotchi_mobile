import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

type BottomNavigationProps = {
  onPressStats?: () => void;
  onPressShop?: () => void;
};

export default function BottomNavigation({ onPressStats, onPressShop }: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity testID="stats-button" style={styles.statsBtn} onPress={onPressStats}>
        <Image source={require("@/assets/images/btn/stats_btn.png")} style={{ width: 80, height: 80 }} />
      </TouchableOpacity>
      <TouchableOpacity testID="activity-button" style={styles.startActivityBtn}>
        <Image source={require("@/assets/images/btn/start_activity_btn.png")} style={{ width: 120, height: 120 }} />
      </TouchableOpacity>
      <TouchableOpacity testID="shop-button" style={styles.shopBtn} onPress={onPressShop}>
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
});
