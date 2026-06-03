import { StyleSheet, Text, TextProps } from "react-native";

export const APP_FONT_FAMILY = "Changa One Regular";

export function AppText(props: TextProps) {
  const { style, children, ...rest } = props;

  return (
    <Text
      {...rest}
      style={[style, styles.text]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: APP_FONT_FAMILY,
  },
});