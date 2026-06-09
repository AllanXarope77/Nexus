import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// ⚠️ SUBSTITUA O IP ABAIXO PELO IP DO SEU PC (Descubra abrindo outro terminal e digitando: ipconfig)
// Exemplo se seu IP for 192.168.1.50, coloque: 'http://192.168.1.50:5000/v1/quests'
const MONGODB_API_URL = "http://192.168.1.XX:5000/v1/quests";

export default function LobbyScreen() {
  const [currentScreen, setCurrentScreen] = useState("LOBBY");
  const [quests, setQuests] = useState([]);
  const [systemError, setSystemError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Perfil de Operador baseado na sua imagem HUD do Solo Leveling
  const [player, setPlayer] = useState({
    name: "PIYUSH",
    rank: "E",
    level: 3,
    class: "ASSASSIN",
    title: "BEGINNER",
    xp: 65,
    attributes: {
      strength: 10,
      intelligence: 10.25,
      discipline: 10.25,
      spirit: 10,
    },
  });

  useEffect(() => {
    fetchQuests();
  }, []);

  // --- OPERAÇÃO READ (GET) ---
  const fetchQuests = async () => {
    setLoading(true);
    try {
      console.log(`[SISTEMA]: Tentando conectar na API em: ${MONGODB_API_URL}`);
      const response = await fetch(MONGODB_API_URL, { method: "GET" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setQuests(data);
      setSystemError(null);
    } catch (error) {
      console.error(`[FETCH ERROR]: ${error.message}`);
      setSystemError(
        "Falha de Handshake com a API. Ativando contingência interna.",
      );
      injectFallbackQuests();
    } finally {
      setLoading(false);
    }
  };

  const injectFallbackQuests = () => {
    setQuests([
      {
        _id: "mock_33",
        title: "NR-33: Espaços Confinados",
        type: "TREINAMENTO TÉCNICO",
        reward: "Certificação Nível 1",
        status: "PENDENTE",
      },
      {
        _id: "mock_35",
        title: "NR-35: Trabalho em Altura",
        type: "SEGURANÇA ATIVA",
        reward: "Certificação Nível 1",
        status: "PENDENTE",
      },
    ]);
  };

  // --- OPERAÇÃO CREATE (POST) ---
  const addMission = async (newQuest) => {
    try {
      const response = await fetch(MONGODB_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuest),
      });
      if (!response.ok) throw new Error("Erro na gravação.");
      const savedDoc = await response.json();
      setQuests([...quests, savedDoc]);
      setSystemError(null);
      setCurrentScreen("LOBBY");
    } catch (error) {
      console.error(`[POST ERROR]: ${error.message}`);
      const mockId = Math.random().toString(16).substring(2, 26);
      setQuests([...quests, { ...newQuest, _id: mockId, status: "PENDENTE" }]);
      setCurrentScreen("LOBBY");
    }
  };

  // --- OPERAÇÃO UPDATE (PATCH) ---
  const completeQuest = async (id) => {
    try {
      await fetch(`${MONGODB_API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONCLUÍDO" }),
      });
      setSystemError(null);
    } catch (error) {
      console.warn(`[PATCH ERROR]: ${error.message}`);
    } finally {
      setQuests((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: "CONCLUÍDO" } : q)),
      );
      setPlayer((prev) => ({ ...prev, xp: Math.min(prev.xp + 15, 100) }));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {systemError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            [SISTEMA EM OVERRIDE]: {systemError}
          </Text>
        </View>
      )}

      {currentScreen === "LOBBY" ? (
        <LobbyView
          player={player}
          quests={quests}
          loading={loading}
          onComplete={completeQuest}
          onAddPress={() => setCurrentScreen("ADD_MISSION")}
        />
      ) : (
        <AddMissionView
          onSave={addMission}
          onCancel={() => setCurrentScreen("LOBBY")}
        />
      )}
    </View>
  );
}

function LobbyView({ player, quests, loading, onComplete, onAddPress }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#05070a", "#0a0e17", "#121a2b"]}
        style={styles.background}
      />
      <View style={styles.header}>
        <View>
          <Text style={styles.infoText}>NAME: {player.name}</Text>
          <Text style={styles.infoText}>CLASS: {player.class}</Text>
          <Text style={styles.infoText}>TITLE: {player.title}</Text>
          <Text style={styles.attrText}>
            STR: {player.attributes.strength} | INT:{" "}
            {player.attributes.intelligence}
          </Text>
        </View>
        <View style={styles.rankContainer}>
          <Text style={styles.rankLabel}>RANK</Text>
          <Text style={styles.rankValue}>{player.rank}</Text>
        </View>
      </View>

      <View style={styles.xpSection}>
        <Text style={styles.levelText}>LVL : {player.level}</Text>
        <View style={styles.xpBarBackground}>
          <View style={[styles.xpBarProgress, { width: `${player.xp}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>
          {loading
            ? "[ ESCANEANDO PORTA 5000... ]"
            : "[ ACTIVE SECTOR COORTES ]"}
        </Text>
        {quests.map((quest) => (
          <TouchableOpacity
            key={quest._id}
            style={styles.questCard}
            onPress={() => quest.status === "PENDENTE" && onComplete(quest._id)}
            disabled={quest.status !== "PENDENTE"}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.questType}>{quest.type}</Text>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <Text style={styles.questReward}>
                {quest.reward} | ID:{" "}
                {quest._id ? quest._id.substring(0, 8) : "local"}
              </Text>
            </View>
            <Text
              style={[
                styles.statusTag,
                { color: quest.status === "CONCLUÍDO" ? "#00ff00" : "#ff4444" },
              ]}
            >
              {quest.status}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.fab} onPress={onAddPress}>
          <Text style={styles.fabText}>+ INJETAR DOCUMENTO (POST)</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.navTextActive}>STATUS</Text>
        <Text style={styles.navText}>COLLECTIONS</Text>
        <Text style={styles.navText}>CONFIG</Text>
      </View>
    </SafeAreaView>
  );
}

function AddMissionView({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [reward, setReward] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#0a0e17", "#1a2436"]}
        style={styles.background}
      />
      <SafeAreaView style={{ flex: 1, padding: 30 }}>
        <Text style={styles.screenTitle}>[ DB.COLLECTION.INSERT_ONE ]</Text>
        <View style={styles.form}>
          <Text style={styles.inputLabel}>TITLE FIELD</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: NR-33 Treinamento Inicial"
            placeholderTextColor="#444"
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.inputLabel}>TYPE FIELD (STRING)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: TREINAMENTO TÉCNICO"
            placeholderTextColor="#444"
            value={type}
            onChangeText={setType}
          />
          <Text style={styles.inputLabel}>REWARD FIELD</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Certificação Premium"
            placeholderTextColor="#444"
            value={reward}
            onChangeText={setReward}
          />
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => onSave({ title, type, reward })}
          >
            <Text style={styles.saveBtnText}>CONFIRMAR TRANSACTION</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>ABORTAR OPERAÇÃO</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070a" },
  background: { ...StyleSheet.absoluteFillObject },
  errorBanner: {
    backgroundColor: "#ffa500",
    padding: 10,
    zIndex: 999,
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 40 : 10,
  },
  errorBannerText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#00d4ff22",
    paddingTop: 40,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 1,
    fontFamily: "monospace",
  },
  attrText: {
    color: "#00d4ff",
    fontSize: 11,
    marginTop: 5,
    fontFamily: "monospace",
  },
  rankContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#00d4ff44",
    padding: 10,
    borderRadius: 4,
  },
  rankLabel: { color: "#00d4ff", fontSize: 10, fontWeight: "bold" },
  rankValue: { color: "#00d4ff", fontSize: 36, fontWeight: "900" },
  xpSection: { paddingHorizontal: 25, marginVertical: 15 },
  levelText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  xpBarBackground: {
    height: 6,
    backgroundColor: "#ffffff11",
    marginTop: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  xpBarProgress: { height: "100%", backgroundColor: "#00d4ff" },
  sectionTitle: {
    color: "#fff",
    textAlign: "center",
    marginVertical: 15,
    letterSpacing: 1,
    fontSize: 12,
    fontFamily: "monospace",
    opacity: 0.7,
  },
  questCard: {
    backgroundColor: "#00d4ff08",
    borderLeftWidth: 4,
    borderLeftColor: "#00d4ff",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  questType: { color: "#00d4ff", fontSize: 10, fontWeight: "bold" },
  questTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 2,
  },
  questReward: { color: "#ffffff33", fontSize: 10, fontFamily: "monospace" },
  statusTag: { fontSize: 11, fontWeight: "bold", marginLeft: 10 },
  fab: {
    backgroundColor: "#00d4ff11",
    borderWidth: 1,
    borderColor: "#00d4ff",
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 15,
  },
  fabText: {
    color: "#00d4ff",
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "monospace",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 18,
    backgroundColor: "#05070a",
    borderTopWidth: 1,
    borderTopColor: "#ffffff11",
  },
  navText: { color: "#ffffff33", fontSize: 10, fontWeight: "bold" },
  navTextActive: { color: "#00d4ff", fontSize: 10, fontWeight: "bold" },
  screenTitle: {
    color: "#00d4ff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    fontFamily: "monospace",
  },
  form: { marginTop: 30 },
  inputLabel: {
    color: "#ffffff55",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    fontFamily: "monospace",
  },
  input: {
    backgroundColor: "#ffffff06",
    borderWidth: 1,
    borderColor: "#ffffff11",
    padding: 14,
    color: "#fff",
    borderRadius: 4,
    marginBottom: 20,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: "#00d4ff",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 13,
    fontFamily: "monospace",
  },
  cancelBtn: { padding: 16, alignItems: "center" },
  cancelBtnText: { color: "#ffffff33", fontSize: 12 },
});
