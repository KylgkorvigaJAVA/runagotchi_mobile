require("react-native-gesture-handler/jestSetup");

const { Animated } = require("react-native");

jest.mock("react-native/src/private/animated/NativeAnimatedHelper");
jest.mock("expo-font", () => ({
  useFonts: () => [true],
}));
jest.mock("expo-navigation-bar", () => ({
  setVisibilityAsync: jest.fn(),
}));
jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

const finishAnimationImmediately = (value, config) => ({
  start: (callback) => {
    if (typeof config?.toValue === "number" && typeof value?.setValue === "function") {
      value.setValue(config.toValue);
    }

    callback && callback({ finished: true });
  },
  stop: jest.fn(),
  reset: jest.fn(),
});

jest.spyOn(Animated, "timing").mockImplementation((value, config) => finishAnimationImmediately(value, config));
jest.spyOn(Animated, "spring").mockImplementation((value, config) => finishAnimationImmediately(value, config));
