import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function BottomNavigation() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.statsBtn}>
        <Image source={require("@/assets/images/btn/stats_btn.png")} style={{ width: 80, height: 80 }} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.startActivityBtn}>
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
});
