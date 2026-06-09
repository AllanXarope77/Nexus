import { Colors } from "@/constants/Colors";
import { useGame } from "@/context/GameContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function Profile() {
  const { level, achievements } = useGame();
  const [username, setUsername] = useState("USER_007");
  const router = useRouter();

  useEffect(() => {
    const getUsername = async () => {
      const name = await AsyncStorage.getItem("@nexus_active_username");
      if (name) setUsername(name);
    };
    getUsername();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@nexus_user_logged");
    router.replace("/Login");
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Card de Identidade */}
      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {username.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.rankText}>
          CLASSIFICAÇÃO:{" "}
          <Text style={{ color: Colors.dark.tint }}>S-RANK (LVL {level})</Text>
        </Text>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>DESCONECTAR SISTEMA</Text>
        </TouchableOpacity>
      </View>

      {/* Secção de Conquistas */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
        <Text style={styles.sectionCounter}>
          {unlockedCount}/{achievements.length}
        </Text>
      </View>

      <View style={styles.list}>
        {achievements.map((ach) => (
          <View
            key={ach.id}
            style={[styles.achCard, !ach.unlocked && styles.achLocked]}
          >
            <View style={styles.badgeIcon}>
              <Text style={styles.emojiText}>{ach.unlocked ? "🔱" : "🔒"}</Text>
            </View>
            <View style={styles.achInfo}>
              <Text
                style={[styles.achTitle, !ach.unlocked && { color: "#444" }]}
              >
                {ach.title}
              </Text>
              <Text style={styles.achDesc}>{ach.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  content: { padding: 24, paddingTop: 60, gap: 24 },
  profileCard: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: Colors.dark.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },
  username: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },
  rankText: {
    color: "#9BA1A6",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 1,
  },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: "#160d0d",
    borderWidth: 1,
    borderColor: "#3a1a1a",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  logoutText: {
    color: "#ff4d4d",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  sectionCounter: { color: Colors.dark.tint, fontWeight: "700", fontSize: 14 },
  list: { gap: 14 },
  achCard: {
    flexDirection: "row",
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 16,
  },
  achLocked: { opacity: 0.3, borderColor: "#111" },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  emojiText: { fontSize: 18, textAlign: "center" },
  achInfo: { flex: 1 },
  achTitle: {
    color: Colors.dark.tint,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  achDesc: { color: "#9BA1A6", fontSize: 12, marginTop: 2, lineHeight: 16 },
});
