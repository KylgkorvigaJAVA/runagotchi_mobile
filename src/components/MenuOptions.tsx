import { Image } from 'expo-image';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';

export default function MenuOptions({ closeMenu }: { closeMenu: () => void }) {
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
                    style={styles.settingsButton}
                    onPress={() => console.log("Settings pressed")}>
                    <Image
                        source={require("@/assets/images/btn/settings_btn.png")}
                        style={styles.settingsImage} />
                </Pressable>
                <Pressable
                    style={styles.quitButton}
                    onPress={() => BackHandler.exitApp()}>
                    <Image
                        source={require("@/assets/images/btn/quit_btn.png")}
                        style={styles.quitImage} />
                </Pressable>

            </View >

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 300,
        backgroundColor: "#7FA37C",
        borderRadius: 8,
        padding: 10,
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
    quitButton: {
        marginBottom: 16,
    },
    settingsButton: {
        marginBottom: 16,
    },
    closeImage: {
        width: 56,
        height: 56,
    },
    quitImage: {
        width: 100,
        height: 50,
    },
    settingsImage: {
        width: 100,
        height: 50,
    },
});