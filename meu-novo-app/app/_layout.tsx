import { Colors } from "@/constants/Colors";
import { GameProvider } from "@/context/GameContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [userLogged, setUserLogged] = useState(false);

  const segments = useSegments();
  const router = useRouter();

  const checkLoginStatus = async () => {
    try {
      const status = await AsyncStorage.getItem("@nexus_user_logged");
      setUserLogged(status === "true");
    } catch (e) {
      console.error("Erro no layout:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [segments]);

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (!userLogged && inTabsGroup) {
      router.replace("/Login");
    } else if (userLogged && !inTabsGroup) {
      router.replace("/(tabs)");
    }
  }, [userLogged, isLoading, segments]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#050505",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.dark.tint || "#00FFD1"} />
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <GameProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#050505" },
          }}
        >
          <Stack.Screen name="login" options={{ gestureEnabled: false }} />
          <Stack.Screen name="register" />
          <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        </Stack>
      </GameProvider>
    </ThemeProvider>
  );
}
