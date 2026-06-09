import { NeonButton } from "@/components/NeonButton";
import { Colors } from "@/constants/Colors";
import { Quest, useGame } from "@/context/GameContext";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type CatType = "TECH" | "FITNESS" | "MINDSET";

export default function ExploreQuests() {
  const { quests, addQuest, completeQuest, loadOnlineStats } = useGame();

  // Estados do Formulário
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [exp, setExp] = useState("");
  const [category, setCategory] = useState<CatType>("TECH");

  // Atualização reativa da lista ao focar a ecrã
  useFocusEffect(
    useCallback(() => {
      loadOnlineStats();
    }, []),
  );

  const handleCreateQuest = async () => {
    if (!title.trim() || !desc.trim() || !exp.trim()) {
      if (Platform.OS === "web") alert("Preencha todos os campos da missão!");
      else Alert.alert("AVISO", "Preencha todos os campos da missão!");
      return;
    }

    const expValue = parseInt(exp);
    if (isNaN(expValue) || expValue <= 0) {
      if (Platform.OS === "web") alert("Insira um valor de EXP válido!");
      else Alert.alert("AVISO", "Insira um valor de EXP válido!");
      return;
    }

    // Dispara a gravação em nuvem no MongoDB
    await addQuest(title, desc, expValue, category);

    // Limpa o formulário imediatamente
    setTitle("");
    setDesc("");
    setExp("");
  };

  const getCategoryColor = (cat: string) => {
    if (cat === "TECH") return "#00FFD1";
    if (cat === "FITNESS") return "#FF0055";
    return "#FFBB00";
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ================= SEÇÃO 1: FORMULÁRIO DE CRIAÇÃO ================= */}
      <View style={styles.adminCard}>
        <Text style={styles.adminTitle}>
          INJETAR NOVA <Text style={{ color: Colors.dark.tint }}>QUEST</Text>
        </Text>

        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="TÍTULO DA MISSÃO (EX: CODAR EM MVC)"
          placeholderTextColor="#444"
        />

        <TextInput
          style={[styles.input, { height: 60 }]}
          value={desc}
          onChangeText={setDesc}
          placeholder="DESCRIÇÃO DA TAREFA..."
          placeholderTextColor="#444"
          multiline
        />

        <View style={styles.rowInputs}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={exp}
            onChangeText={setExp}
            placeholder="EXP RECOMPENSA"
            placeholderTextColor="#444"
            keyboardType="numeric"
          />

          <View style={styles.catSelector}>
            {(["TECH", "FITNESS", "MINDSET"] as CatType[]).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catMiniBtn,
                  category === cat && {
                    borderColor: getCategoryColor(cat),
                    backgroundColor: "#111",
                  },
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.catMiniText,
                    {
                      color: category === cat ? getCategoryColor(cat) : "#444",
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <NeonButton title="PUBLICAR DESAFIO" onPress={handleCreateQuest} />
        </View>
      </View>

      <View style={styles.divider} />

      {/* ================= SEÇÃO 2: DIÁRIO DE MISSÕES (LISTAGEM) ================= */}
      <View style={styles.header}>
        <Text style={styles.title}>
          DIARY <Text style={styles.subtitle}>QUESTS</Text>
        </Text>
        <Text style={styles.info}>
          Lista de diretrizes ativas em tempo real no servidor sincronizado.
        </Text>
      </View>

      <View style={styles.list}>
        {!quests || quests.length === 0 ? (
          <Text style={styles.emptyText}>
            NENHUMA DIRETRIZ ENCONTRADA NA NUVEM.
          </Text>
        ) : (
          quests.map((quest: Quest) => (
            <View
              key={quest.id}
              style={[styles.card, quest.completed && styles.cardCompleted]}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.category,
                    { color: getCategoryColor(quest.category) },
                  ]}
                >
                  {quest.category}
                </Text>
                <Text
                  style={[
                    styles.reward,
                    { color: getCategoryColor(quest.category) },
                  ]}
                >
                  +{quest.expReward} EXP
                </Text>
              </View>

              <Text
                style={[
                  styles.questTitle,
                  quest.completed && styles.textThrough,
                ]}
              >
                {quest.title}
              </Text>
              <Text style={styles.description}>{quest.description}</Text>

              {!quest.completed ? (
                <TouchableOpacity
                  style={[
                    styles.button,
                    { borderColor: getCategoryColor(quest.category) },
                  ]}
                  onPress={() => completeQuest(quest.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: getCategoryColor(quest.category) },
                    ]}
                  >
                    CONCLUIR MISSÃO
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.buttonCompleted}>
                  <Text style={styles.buttonCompletedText}>
                    ✓ CRÉDITOS DE EXP COMPUTADOS
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  content: { padding: 24, paddingTop: 60 },

  adminCard: {
    backgroundColor: "#0a0a0a",
    borderWidth: 1,
    borderColor: "#151515",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginBottom: 10,
  },
  adminTitle: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#050505",
    borderWidth: 1,
    borderColor: "#1a1a1a",
    borderRadius: 10,
    padding: 12,
    color: "#FFF",
    fontSize: 13,
    marginBottom: 2,
  },
  rowInputs: { flexDirection: "row", gap: 10, alignItems: "center" },
  catSelector: {
    flexDirection: "row",
    gap: 4,
    flex: 1.2,
    justifyContent: "space-between",
  },
  catMiniBtn: {
    borderWidth: 1,
    borderColor: "#161616",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  catMiniText: { fontSize: 8, fontWeight: "900", letterSpacing: 0.5 },

  divider: { height: 1, backgroundColor: "#111", marginVertical: 25 },

  header: { marginBottom: 20 },
  title: { color: "#FFF", fontSize: 24, fontWeight: "900", letterSpacing: 2 },
  subtitle: { color: Colors.dark.tint },
  info: {
    color: "#444",
    fontSize: 11,
    marginTop: 6,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  list: { gap: 16, paddingBottom: 30 },
  card: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 16,
    padding: 20,
  },
  cardCompleted: { opacity: 0.25, borderColor: "#111" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  category: { fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  reward: { fontSize: 11, fontWeight: "900" },
  questTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  textThrough: { textDecorationLine: "line-through", color: "#555" },
  description: {
    color: "#9BA1A6",
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { fontWeight: "900", fontSize: 11, letterSpacing: 1 },
  buttonCompleted: {
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  buttonCompletedText: {
    color: "#333",
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  emptyText: {
    color: "#333",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 30,
  },
});
