import { StyleSheet, View } from "react-native";
import CharacterDisplay from "./CharacterDisplay";
import CharacterInfo from "./CharacterInfo";
import Header from "./Header";

export default function MainContent() {
  return (
    <View style={styles.container}>
      <Header />
      <CharacterInfo />
      <CharacterDisplay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});