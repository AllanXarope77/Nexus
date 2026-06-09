// constants/Colors.ts

const tintColorLight = "#6200EE";
const tintColorDark = "#00FFD1"; // Ciano neon para o "HUD" do sistema

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    // Fundo preto profundo para o estilo Dark Mode solicitado
    text: "#ECEDEE",
    background: "#050505",

    // Cor de destaque (Primária)
    //tint: tintColorDark,

    // Cores de superfícies (Cards, Modais)
    surface: "#121212",
    border: "#2A2A2A",

    // Ícones e estados
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    // Cores de status (Level Up / Alerta)
    success: "#00FFD1",
    error: "#FF4C4C",
    rankS: "#FFD700", // Dourado para elementos especiais

    tint: "#00FFD1", // Ciano
    tintLight: "#6200EE", // Adicione esta linha (Roxo Solo Leveling)
  },
};
