import { useGame } from "@/providers/GameContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
export default function Welcome() {

    const [petName, setPetName] = useState("");
    const { setPetName: setGamePetName } = useGame();

    const addPetName = async () => {
        const name = petName.trim();
        if (!name) {
            return;
        }

        await AsyncStorage.setItem("petName", name);
        setGamePetName(name);
        router.replace("/");
    };


    return (
        <View className="flex-1 items-center justify-center bg-[#F5F5F5]">

            <Text className="text-2xl font-bold mb-4">Welcome to Runagotchi!</Text>
            <Text className="text-center text-gray-600 mb-6 px-4">
                Please enter your pet's name to get started on your adventure!
            </Text>
            <TextInput
                className="w-3/4 p-3 border border-gray-300 rounded mb-4 bg-white"
                placeholder="Enter pet name"
                value={petName}
                onChangeText={setPetName}

            />
            <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded" onPress={() => void addPetName()}>
                <Text className="text-white font-bold">Start</Text>
            </TouchableOpacity>
        </View>
    );
}   