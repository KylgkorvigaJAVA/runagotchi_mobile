import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useGame } from "../providers/GameContext";
import { AppText } from "./AppText";
import MenuOptions from "./MenuOptions";

const MENU_HEIGHT = 300;
const MENU_SCALE_START = 0.82;

export default function Header() {
  const { money } = useGame();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuScale = useRef(new Animated.Value(MENU_SCALE_START)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuBackdropOpacity = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    menuScale.setValue(MENU_SCALE_START);
    menuOpacity.setValue(0);
    menuBackdropOpacity.setValue(0);
    setMenuVisible(true);
  };

  const animateMenuIn = () => {
    Animated.parallel([
      Animated.spring(menuScale, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(menuBackdropOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(menuScale, {
        toValue: MENU_SCALE_START,
        duration: 150,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(menuBackdropOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setMenuVisible(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.currencyContainer}>
        <Image
          source={require("@/assets/images/icons/coin_small.png")}
          style={styles.coinIcon} />
        <AppText style={styles.currency}>{money}</AppText>
      </View>
      <TouchableOpacity
        style={styles.menuBtn}
        onPress={openMenu}>
        <Image
          source={require("@/assets/images/btn/menu_btn.png")}
          style={styles.menuBtn} />
      </TouchableOpacity>
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onShow={animateMenuIn}
        onRequestClose={closeMenu}
      >
        <View style={styles.modalRoot}>
          <Animated.View style={[styles.backdrop, { opacity: menuBackdropOpacity }]}> 
            <Pressable style={StyleSheet.absoluteFill} onPress={closeMenu} />
          </Animated.View>

          <Animated.View
            style={[
              styles.menuWrapper,
              {
                opacity: menuOpacity,
                transform: [{ scale: menuScale }],
              },
            ]}
          >
            <MenuOptions closeMenu={closeMenu} />
          </Animated.View>
        </View>
      </Modal>
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
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  menuWrapper: {
    position: "absolute",
    left: 24,
    right: 24,
    alignItems: "center",
  },
  coinIcon: {
    width: 120,
    height: 60,
  },
});
