// components/NeonButton.tsx
import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface NeonButtonProps {
  title: string;
  onPress: () => void;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.tintLight, // Supondo que adicionamos um Roxo aqui
    // Se não tivermos o roxo definido ainda, use Colors.dark.tint por enquanto
    // mas na imagem é Roxo: #6200EE
    // backgroundColor: '#6200EE',

    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",

    // Efeito de Brilho Neon (Shadow)
    shadowColor: "#6200EE", // Cor do brilho
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
