import { Colors } from "@/constants/Colors";
import { useGame } from "@/context/GameContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const ExpBar = () => {
  // Consumimos o EXP numérico e o teto máximo calculado exponencialmente
  const { exp, maxExpForCurrentLevel } = useGame();

  // Cálculo rigoroso da porcentagem matemática real
  const percentage = Math.min(
    Math.floor((exp / maxExpForCurrentLevel) * 100),
    100,
  );

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.labelText}>S-RANK EXPERIENCE</Text>
        <Text style={styles.percentText}>{percentage}%</Text>
      </View>

      {/* Trilho de fundo da barra */}
      <View style={styles.barTrack}>
        {/* Preenchimento dinâmico calibrado em porcentagem pura */}
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.dataText}>
        {exp} / {maxExpForCurrentLevel} EXP REQUERIDO
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 25,
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  labelText: {
    color: "#666",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  percentText: {
    color: Colors.dark.tint || "#00FFD1",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  barTrack: {
    height: 6,
    backgroundColor: "#111",
    borderRadius: 3,
    width: "100%",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  barFill: {
    height: "100%",
    backgroundColor: Colors.dark.tint || "#00FFD1",
    borderRadius: 3,
    // Efeito sutil de brilho simulado por cor sólida no tema neon
  },
  dataText: {
    color: "#444",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 6,
    letterSpacing: 0.5,
    textAlign: "right",
  },
});
