import { NeonButton } from "@/components/NeonButton";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") alert(`${title}\n\n${message}`);
    else Alert.alert(title, message);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert("ACESSO NEGADO", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const savedCredentials = await AsyncStorage.getItem(
        "@nexus_user_credentials",
      );

      if (savedCredentials !== null) {
        const user = JSON.parse(savedCredentials);
        const inputEmail = email.trim().toLowerCase();
        const inputPassword = password.trim();

        if (inputEmail === user.email && inputPassword === user.password) {
          await AsyncStorage.setItem("@nexus_user_logged", "true");
          await AsyncStorage.setItem("@nexus_active_username", user.username);

          router.replace("/(tabs)");
        } else {
          showAlert("FALHA NA AUTENTICAÇÃO", "E-mail ou senha incorretos.");
        }
      } else {
        showAlert(
          "SISTEMA VAZIO",
          "Nenhum usuário registrado. Vá para o cadastro.",
        );
      }
    } catch (e) {
      showAlert("NEXUS ERROR", "Erro ao acessar a base de dados local.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          NEXUS <Text style={styles.subtitle}>SYSTEM</Text>
        </Text>
        <Text style={styles.instruction}>
          Identifique-se para ligar ao servidor de elite.
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="EMAIL DE ACESSO"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="CHAVE DE ACESSO (SENHA)"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <NeonButton title="INICIAR SESSÃO" onPress={handleLogin} />

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace("/register")}
        activeOpacity={0.7}
      >
        <Text style={styles.linkText}>SOLICITAR NOVO ACESSO (CADASTRAR)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    padding: 30,
    justifyContent: "center",
  },
  header: { marginBottom: 45 },
  title: { color: "#FFF", fontSize: 34, fontWeight: "900", letterSpacing: 2.5 },
  subtitle: { color: Colors.dark.tint },
  instruction: {
    color: Colors.dark.icon,
    marginTop: 12,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  inputGroup: { marginBottom: 35, gap: 16 },
  input: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 14,
    padding: 18,
    color: "#FFF",
    fontSize: 16,
  },
  linkButton: { marginTop: 25, alignItems: "center" },
  linkText: {
    color: "#444",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
