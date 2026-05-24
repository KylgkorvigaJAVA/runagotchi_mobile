import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "./AppText";

interface HeaderProps {
  currency: number;
  onMenuPress: () => void;
}

export default function Header({ currency, onMenuPress }: HeaderProps) {
  const handleMenuPress = () => {
    Alert.alert("Character", "Start a new character? Your local progress will be replaced.", [
      { text: "Cancel", style: "cancel" },
      { text: "New character", style: "destructive", onPress: onMenuPress },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.currencyContainer}>
        <Image source={require("@/assets/images/icons/coin_small.png")} style={styles.coinIcon} />
        <AppText style={styles.currency}>{currency}</AppText>
      </View>
      <TouchableOpacity style={styles.menuBtn} onPress={handleMenuPress}>
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
