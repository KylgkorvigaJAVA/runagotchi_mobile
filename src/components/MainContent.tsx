import { StyleSheet, View } from "react-native";
import Header from "./Header";
import CharacterInfo from "./CharacterInfo";
import CharacterDisplay from "./CharacterDisplay";

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
