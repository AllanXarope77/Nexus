import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text } from "react-native";

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text
    style={[styles.iconText, { color: focused ? Colors.dark.tint : "#444" }]}
  >
    {label}
  </Text>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.tint,
        tabBarInactiveTintColor: "#444",
        tabBarStyle: {
          backgroundColor: "#0A0A0A",
          borderTopWidth: 1,
          borderTopColor: "#1a1a1a",
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "STATUS",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="[SYS]" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "QUESTS",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="[QST]" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="[PRF]" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconText: {
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 1,
    textAlign: "center",
  },
});
