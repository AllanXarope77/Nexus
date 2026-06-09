import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const StatusHeader = ({
  username,
  level,
}: {
  username: string;
  level: number;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.username}>
        {username.toUpperCase()}: <Text style={styles.statusLabel}>STATUS</Text>
      </Text>
      <View style={styles.levelRow}>
        <Text style={styles.levelLabel}>LEVEL: </Text>
        <Text style={styles.levelValue}>{level}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  username: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    opacity: 0.9,
    letterSpacing: 1,
  },
  statusLabel: { color: Colors.dark.icon },
  levelRow: { flexDirection: "row", alignItems: "baseline", marginTop: 5 },
  levelLabel: { color: "#FFF", fontSize: 32, fontWeight: "800" },
  levelValue: { color: Colors.dark.tint, fontSize: 48, fontWeight: "900" }, // Ciano Neon
});
