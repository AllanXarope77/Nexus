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

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const showAlert = (title: string, message: string, action?: () => void) => {
    if (Platform.OS === "web") {
      alert(`${title}\n\n${message}`);
      if (action) action();
    } else {
      Alert.alert(
        title,
        message,
        action ? [{ text: "OK", onPress: action }] : undefined,
      );
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      showAlert("ERRO NO CADASTRO", "Todos os campos são obrigatórios.");
      return;
    }

    try {
      const userCredentials = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      await AsyncStorage.setItem(
        "@nexus_user_credentials",
        JSON.stringify(userCredentials),
      );

      showAlert(
        "SISTEMA SINCRONIZADO",
        "Sua conta de elite foi criada com sucesso!",
        () => router.replace("/Login"),
      );
    } catch (e) {
      showAlert("NEXUS ERROR", "Falha ao gravar credenciais.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          CREATE <Text style={styles.subtitle}>ACCOUNT</Text>
        </Text>
        <Text style={styles.instruction}>
          Inicie sua jornada e registre-se no Nexus System.
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="CÓDIGO DE USUÁRIO"
          placeholderTextColor="#555"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="characters"
        />
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
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

      <NeonButton title="FINALIZAR REGISTRO" onPress={handleRegister} />

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace("/Login")}
        activeOpacity={0.7}
      >
        <Text style={styles.linkText}>JÁ POSSUO UMA CONTA</Text>
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
