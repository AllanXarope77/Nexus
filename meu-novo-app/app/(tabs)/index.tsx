import { ExpBar } from "@/components/ExpBar";
import { StatCard } from "@/components/StatCard";
import { StatusHeader } from "@/components/StatusHeader";
import { useGame } from "@/context/GameContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function Index() {
  const { level, strength, agility } = useGame();
  const [user, setUser] = useState("USER_007");

  useEffect(() => {
    const getUsername = async () => {
      try {
        const name = await AsyncStorage.getItem("@nexus_active_username");
        if (name) setUser(name);
      } catch (e) {
        console.error("Erro ao carregar username", e);
      }
    };
    getUsername();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabeçalho de Identidade */}
      <StatusHeader username={user} level={level} />

      {/* Barra de Evolução de EXP baseada em Porcentagem Dinâmica */}
      <ExpBar />

      {/* Grade de Atributos */}
      <View style={styles.row}>
        <StatCard label="STRENGTH" value={strength} />
        <StatCard label="AGILITY" value={agility} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
  },
});
