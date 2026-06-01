import { useGame } from "@/providers/GameContext";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from 'expo-image';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';

export default function MenuOptions({ closeMenu }: { closeMenu: () => void }) {
    const { setPetName } = useGame();

    const clearProfile = async () => {
        await AsyncStorage.removeItem("petName");
        setPetName("");
        closeMenu();
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.closeButton}
                onPress={closeMenu}>
                <Image
                    source={require("@/assets/images/btn/close_btn.png")}
                    style={styles.closeImage} />
            </Pressable>
            <View style={styles.menuButtonsContainer}>
                <Pressable
                    style={styles.actionButton}
                    onPress={() => console.log("Settings pressed")}
                >
                    <MaterialIcons name="settings" size={40} color="#fff" style={styles.actionIcon} />
                    <AppText style={styles.actionText}>SETTINGS</AppText>
                </Pressable>
                <Pressable
                    style={styles.clearProfileButton}
                    onPress={() => void clearProfile()}>
                    <AppText style={styles.clearProfileText}>Clear Profile</AppText>
                </Pressable>
                <Pressable
                    style={styles.actionButton}
                    onPress={() => BackHandler.exitApp()}
                >
                    <MaterialIcons name="exit-to-app" size={40} color="#fff" style={styles.actionIcon} />
                    <AppText style={styles.actionText}>QUIT</AppText>
                </Pressable>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 360,
        height: 300,
        backgroundColor: "#7FA37C",
        borderWidth: 5,
        borderColor: "#486346",
        borderRadius: 18,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    closeButton: {
        position: "absolute",
        top: 8,
        right: 8,
    },
    menuButtonsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: "transparent",
    },
    actionText: {
        fontSize: 30,
        color: "#fff",
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    actionIcon: {
        marginRight: 6,
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    quitButton: {
        marginBottom: 16,
    },
    settingsButton: {
        marginBottom: 16,
    },
    clearProfileButton: {
        width: 150,
        height: 44,
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: "#f4ead5",
        alignItems: "center",
        justifyContent: "center",
    },
    closeImage: {
        width: 56,
        height: 56,
    },
    
    clearProfileText: {
        fontSize: 20,
        color: "#2f3f2e",
    },
});