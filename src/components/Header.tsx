import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
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
import SettingsContent from "./SettingsContent";

const MENU_SCALE_START = 0.82;
const SETTINGS_PANEL_OFFSET = Dimensions.get("window").width;

export default function Header() {
  const { money } = useGame();
  const [menuVisible, setMenuVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const menuScale = useRef(new Animated.Value(MENU_SCALE_START)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuBackdropOpacity = useRef(new Animated.Value(0)).current;
  const settingsTranslateX = useRef(new Animated.Value(SETTINGS_PANEL_OFFSET)).current;
  const settingsBackdropOpacity = useRef(new Animated.Value(0)).current;

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

  const closeMenu = (afterClose?: () => void) => {
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
        afterClose?.();
      }
    });
  };

  const openSettings = () => {
    settingsTranslateX.setValue(SETTINGS_PANEL_OFFSET);
    settingsBackdropOpacity.setValue(0);
    setSettingsVisible(true);
  };

  const animateSettingsIn = () => {
    Animated.parallel([
      Animated.timing(settingsTranslateX, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(settingsBackdropOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSettings = () => {
    Animated.parallel([
      Animated.timing(settingsTranslateX, {
        toValue: SETTINGS_PANEL_OFFSET,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(settingsBackdropOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setSettingsVisible(false);
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
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => closeMenu()}
            />
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
            <MenuOptions
              closeMenu={closeMenu}
              openSettings={openSettings}
            />
          </Animated.View>
        </View>
      </Modal>
      <Modal
        visible={settingsVisible}
        transparent={true}
        animationType="none"
        onShow={animateSettingsIn}
        onRequestClose={closeSettings}
      >
        <View style={styles.settingsModalRoot}>
          <Animated.View
            style={[styles.backdrop, { opacity: settingsBackdropOpacity }]}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeSettings}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.settingsWrapper,
              {
                transform: [{ translateX: settingsTranslateX }],
              },
            ]}
          >
            <SettingsContent onClose={closeSettings} />
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
  settingsModalRoot: {
    flex: 1,
    justifyContent: "center",
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
  settingsWrapper: {
    flex: 1,
  },
  coinIcon: {
    width: 120,
    height: 60,
  },
});
