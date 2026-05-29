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
import { AppText } from "./AppText";
import { useGame } from "./GameContext";
import MenuOptions from "./MenuOptions";

const MENU_HEIGHT = 300;
const MENU_TOP = 12;
const MENU_SIDE = 16;
const MENU_HIDDEN_Y = -(MENU_HEIGHT + MENU_TOP + 24);

export default function Header() {
  const { money } = useGame();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuTranslateY = useRef(new Animated.Value(MENU_HIDDEN_Y)).current;
  const menuBackdropOpacity = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    menuTranslateY.setValue(MENU_HIDDEN_Y);
    menuBackdropOpacity.setValue(0);
    setMenuVisible(true);
  };

  const animateMenuIn = () => {
    Animated.parallel([
      Animated.timing(menuTranslateY, {
        toValue: 0,
        duration: 220,
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
      Animated.timing(menuTranslateY, {
        toValue: MENU_HIDDEN_Y,
        duration: 180,
        easing: Easing.in(Easing.cubic),
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
              { transform: [{ translateY: menuTranslateY }] },
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
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  menuWrapper: {
    position: "absolute",
    top: MENU_TOP,
    left: MENU_SIDE,
    right: MENU_SIDE,
  },
  coinIcon: {
    width: 120,
    height: 60,
  },
});
