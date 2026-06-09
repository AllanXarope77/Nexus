// components/StatCard.tsx
import { Colors } from "@/constants/Colors";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

interface StatCardProps {
  label: string;
  value: number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={[styles.value, { color: Colors.dark.tint }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    width: width / 2 - 32,
  },
  label: {
    color: Colors.dark.icon,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: "900",
  },
});
