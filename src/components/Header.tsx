import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.currencyContainer}>
        <Image source={require("@/assets/images/icons/coin_small.png")} style={styles.coinIcon} />
        <Text style={styles.currency}>25</Text>
      </View>
      <TouchableOpacity style={styles.menuBtn}>
        <Image source={require("@/assets/images/btn/menu_btn.png")} style={styles.menuBtn} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  currencyContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 60,
  },
  currency: {
    position: "absolute",
    right: 20,
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
  menuBtn: {
    width: 60,
    height: 60,
  },
  coinIcon: {
    width: 120,
    height: 60,
  },
});
