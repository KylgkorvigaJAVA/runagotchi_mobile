import { APP_FONT_FAMILY, AppText } from "@/components/AppText";
import { useGame } from "@/providers/GameContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";

const petOptions = [
  {
    id: "dog",
    // label: "DOG",
    image: require("@/assets/images/dog/dog_state_home.png"),
  },
] as const;

export default function Welcome() {
  const [petName, setPetName] = useState("");
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const { setPetName: setGamePetName } = useGame();

  const selectedPet = petOptions[selectedPetIndex];
  const hasMultiplePets = petOptions.length > 1;

  const addPetName = async () => {
    const name = petName.trim();
    if (!name) {
      return;
    }

    await AsyncStorage.setItem("petName", name);
    setGamePetName(name);
    router.replace("/");
  };

  const selectPreviousPet = () => {
    setSelectedPetIndex((currentIndex) =>
      currentIndex === 0 ? petOptions.length - 1 : currentIndex - 1
    );
  };

  const selectNextPet = () => {
    setSelectedPetIndex((currentIndex) =>
      currentIndex === petOptions.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <View style={styles.container}>
      {/* <AppText style={styles.welcomeTitle}>Welcome to Runagotchi!</AppText> */}

      <View style={styles.petSection}>
        <AppText style={styles.sectionTitle}>SELECT YOUR PET</AppText>

        <View style={styles.petSelector}>
          <View style={styles.petPreview}>
            <Image source={selectedPet.image} style={styles.petImage} />

            <View style={styles.selectorControls}>
              <Pressable
                disabled={!hasMultiplePets}
                onPress={selectPreviousPet}
                style={({ pressed }) => [
                  styles.selectorButton,
                  !hasMultiplePets && styles.selectorButtonDisabled,
                  pressed && hasMultiplePets && styles.selectorButtonPressed,
                ]}
              >
                <Image
                  source={require("@/assets/images/btn/pet_select_left.png")}
                  style={styles.selectorImage}
                />
              </Pressable>

              <Pressable
                disabled={!hasMultiplePets}
                onPress={selectNextPet}
                style={({ pressed }) => [
                  styles.selectorButton,
                  !hasMultiplePets && styles.selectorButtonDisabled,
                  pressed && hasMultiplePets && styles.selectorButtonPressed,
                ]}
              >
                <Image
                  source={require("@/assets/images/btn/pet_select_right.png")}
                  style={styles.selectorImage}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.formSection}>
        <AppText style={styles.sectionTitle}>ENTER PET NAME</AppText>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#DDE7D9"
          value={petName}
          onChangeText={setPetName}
          autoCapitalize="words"
          maxLength={18}
          returnKeyType="done"
          onSubmitEditing={addPetName}
        />

        <Pressable onPress={addPetName} style={({ pressed }) => [styles.enterButton, pressed && styles.enterButtonPressed]}>
          <Image
            source={require("@/assets/images/btn/enter_btn.png")}
            style={styles.enterButtonImage}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7FA37C",
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
  },
  petSection: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 48,
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  petSelector: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectorButton: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorButtonDisabled: {
    opacity: 0.55,
  },
  selectorButtonPressed: {
    opacity: 0.8,
  },
  selectorImage: {
    width: 49,
    height: 61,
    resizeMode: "contain",
  },
  petPreview: {
    flex: 1,
    maxWidth: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginTop: 16,
  },
  petImage: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
  formSection: {
    width: "100%",
    alignItems: "center",
    paddingTop: 8,
  },
  input: {
    width: 262,
    height: 63,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderColor: "#486346",
    borderRadius: 12,
    backgroundColor: "#90B18D",
    color: "#fff",
    fontSize: 20,
    fontFamily: APP_FONT_FAMILY,
    textAlign: "center",
  },
  enterButton: {
    marginTop: 20,
  },
  enterButtonPressed: {
    opacity: 0.85,
  },
  enterButtonImage: {
    width: 262,
    height: 68,
    resizeMode: "contain",
    marginTop: 50,

  },
});