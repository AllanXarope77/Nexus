import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import LobbyScreen from "./features/home/LobbyScreen"; // Importando a tela da estrutura modular

export default function App() {
  return (
    <View style={styles.container}>
      {/* Força a barra de status do celular (bateria, hora) a ficar clara no fundo escuro */}
      <StatusBar style="light" />

      {/* Renderiza o HUD e o Sistema Solo Leveling */}
      <LobbyScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070a", // Fundo padrão do NEXUS OS
  },
});
