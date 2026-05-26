import { PetAppearanceState } from "@/features/activity/types";
import { StyleSheet, View } from "react-native";
import { HomeScreenData } from "@/features/home/types";
import CharacterDisplay from "./CharacterDisplay";
import CharacterInfo from "./CharacterInfo";
import Header from "./Header";

interface MainContentProps {
  homeData: HomeScreenData;
  onMenuPress: () => void;
  petStatus: string;
  petLevel: number;
  petLevelProgress: number;
  petHappiness: number;
  petStrength: number;
  petAppearance: PetAppearanceState;
}

export default function MainContent({
  homeData,
  onMenuPress,
  petStatus,
  petLevel,
  petLevelProgress,
  petHappiness,
  petStrength,
  petAppearance,
}: MainContentProps) {
  return (
    <View style={styles.container}>
      <Header currency={homeData.currency} onMenuPress={onMenuPress} />
      <CharacterInfo
        name={homeData.pet.name}
        status={petStatus}
        level={petLevel}
        levelProgress={petLevelProgress}
      />
      <CharacterDisplay
        happiness={petHappiness}
        strength={petStrength}
        level={petLevel}
        appearance={petAppearance}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});