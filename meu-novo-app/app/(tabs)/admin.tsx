import { NeonButton } from "@/components/NeonButton";
import { Colors } from "@/constants/Colors";
import { useGame } from "@/context/GameContext";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function AdminQuests() {
  const { addQuest } = useGame();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [exp, setExp] = useState("");
  const [category, setCategory] = useState<"TECH" | "FITNESS" | "MINDSET">(
    "TECH",
  );

  const handleCreate = () => {
    if (!title || !desc || !exp) return;
    addQuest(title, desc, parseInt(exp), category);
    setTitle("");
    setDesc("");
    setExp("");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>
          CREATE <Text style={styles.subtitle}>MISSION</Text>
        </Text>
        <Text style={styles.info}>
          Defina novos desafios e a recompensa de EXP para os usuários.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>TÍTULO DA MISSÃO</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Master React Native"
          placeholderTextColor="#444"
        />

        <Text style={styles.label}>DESCRIÇÃO DETALHADA</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={desc}
          onChangeText={setDesc}
          placeholder="O que deve ser feito..."
          placeholderTextColor="#444"
          multiline
        />

        <Text style={styles.label}>RECOMPENSA DE EXP</Text>
        <TextInput
          style={styles.input}
          value={exp}
          onChangeText={setExp}
          placeholder="Ex: 50"
          placeholderTextColor="#444"
          keyboardType="numeric"
        />

        <Text style={styles.label}>CATEGORIA</Text>
        <View style={styles.catRow}>
          {["TECH", "FITNESS", "MINDSET"].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, category === cat && styles.catBtnActive]}
              onPress={() => setCategory(cat as any)}
            >
              <Text
                style={[styles.catText, category === cat && { color: "#000" }]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <NeonButton title="INJETAR MISSÃO" onPress={handleCreate} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  content: { padding: 24, paddingTop: 60 },
  header: { marginBottom: 30 },
  title: { color: "#FFF", fontSize: 28, fontWeight: "900", letterSpacing: 2 },
  subtitle: { color: Colors.dark.tint },
  info: { color: "#9BA1A6", fontSize: 13, marginTop: 8 },
  form: { gap: 15 },
  label: {
    color: Colors.dark.tint,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 12,
    padding: 15,
    color: "#FFF",
  },
  catRow: { flexDirection: "row", gap: 10 },
  catBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
  },
  catBtnActive: {
    backgroundColor: Colors.dark.tint,
    borderColor: Colors.dark.tint,
  },
  catText: { color: "#FFF", fontSize: 10, fontWeight: "800" },
});
