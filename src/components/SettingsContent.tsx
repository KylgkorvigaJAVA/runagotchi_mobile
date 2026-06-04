import { useState } from "react";
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";

import { APP_FONT_FAMILY, AppText } from "@/components/AppText";
import { clearActivities, clearPetProfile, savePetName } from "@/features/profile/storage";
import { useGame } from "@/providers/GameContext";

type SettingsContentProps = {
  onClose: () => void;
};

export default function SettingsContent({ onClose }: SettingsContentProps) {
  const { petName, setPetName } = useGame();
  const [draftName, setDraftName] = useState(petName);

  const trimmedName = draftName.trim();
  const canSaveName = trimmedName.length > 0 && trimmedName !== petName;

  const handleSaveName = async () => {
    if (!canSaveName) {
      return;
    }

    await savePetName(trimmedName);
    setPetName(trimmedName);
    onClose();
  };

  const handleClearProfile = async () => {
    setPetName("");
    await clearPetProfile();
    await clearActivities()
    onClose();
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.closeButton}
        onPress={onClose}
      >
        <Image
          source={require("@/assets/images/btn/close_btn.png")}
          style={styles.closeImage}
        />
      </Pressable>

      <View style={styles.card}>
        <AppText style={styles.title}>SETTINGS</AppText>

        <Image
          source={require("@/assets/images/dog/dog_state_home.png")}
          style={styles.petImage}
        />

        <AppText style={styles.sectionTitle}>PET NAME</AppText>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#DDE7D9"
          value={draftName}
          onChangeText={setDraftName}
          autoCapitalize="words"
          maxLength={18}
          returnKeyType="done"
          onSubmitEditing={() => void handleSaveName()}
        />

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            !canSaveName && styles.buttonDisabled,
            pressed && canSaveName && styles.buttonPressed,
          ]}
          disabled={!canSaveName}
          onPress={() => void handleSaveName()}
        >
          <AppText style={styles.primaryButtonText}>SAVE NAME</AppText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => void handleClearProfile()}
        >
          <AppText style={styles.secondaryButtonText}>CLEAR PROFILE</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7FA37C",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#7FA37C",
    borderWidth: 5,
    borderColor: "#486346",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: 28,
    right: 20,
    zIndex: 1,
  },
  closeImage: {
    width: 56,
    height: 56,
  },
  title: {
    fontSize: 42,
    color: "#fff",
    marginBottom: 8,
  },
  petImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 14,
  },
  input: {
    width: "100%",
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
    marginBottom: 18,
  },
  primaryButton: {
    width: "100%",
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: "#f4ead5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    paddingVertical: 12,
  },
  secondaryButton: {
    width: "100%",
    minHeight: 54,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#486346",
    backgroundColor: "#90B18D",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  primaryButtonText: {
    fontSize: 24,
    color: "#2f3f2e",
  },
  secondaryButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
