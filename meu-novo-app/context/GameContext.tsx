import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

// SE ESTIVER NO EMULADOR ANDROID: use 'http://10.0.2.2:3000/api'
// SE ESTIVER NO NAVEGADOR WEB / EMULADOR IOS: use 'http://localhost:3000/api'
// SE ESTIVER NO TELEMÓVEL FÍSICO: use o IP da sua máquina, ex: 'http://192.168.1.50:3000/api'
const API_URL = "http://localhost:3000/api";

export interface Quest {
  id: string;
  title: string;
  description: string;
  expReward: number;
  completed: boolean;
  category: "TECH" | "FITNESS" | "MINDSET";
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  reqType: "level" | "strength" | "agility";
  reqValue: number;
  area: "TECH" | "FITNESS" | "MINDSET";
  difficulty: "FÁCIL" | "MÉDIO" | "DIFÍCIL";
}

interface GameContextType {
  level: number;
  exp: number;
  maxExpForCurrentLevel: number;
  strength: number;
  agility: number;
  quests: Quest[];
  achievements: Achievement[];
  loadOnlineStats: () => Promise<void>;
  addQuest: (
    title: string,
    desc: string,
    exp: number,
    cat: any,
  ) => Promise<void>;
  completeQuest: (id: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [maxExpForCurrentLevel, setMaxExpForCurrentLevel] = useState(100);
  const [strength, setStrength] = useState(10);
  const [agility, setAgility] = useState(10);
  const [quests, setQuests] = useState<Quest[]>([]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "t1",
      title: "HELLO WORLD",
      description: "Inicie o sistema e alcance o Nível 2.",
      unlocked: false,
      reqType: "level",
      reqValue: 2,
      area: "TECH",
      difficulty: "FÁCIL",
    },
    {
      id: "t2",
      title: "COMPILADO COM SUCESSO",
      description: "Desenvolva sua agilidade técnica para 14 pontos.",
      unlocked: false,
      reqType: "agility",
      reqValue: 14,
      area: "TECH",
      difficulty: "FÁCIL",
    },
    {
      id: "t3",
      title: "FULLSTACK DEVELOPER",
      description: "Mostre consistência e chegue ao Nível 6.",
      unlocked: false,
      reqType: "level",
      reqValue: 6,
      area: "TECH",
      difficulty: "MÉDIO",
    },
    {
      id: "t4",
      title: "REFATORAÇÃO AGIL",
      description: "Alcance 22 pontos de pura destreza e Agility.",
      unlocked: false,
      reqType: "agility",
      reqValue: 22,
      area: "TECH",
      difficulty: "MÉDIO",
    },
    {
      id: "t5",
      title: "ARQUITETO DE SISTEMAS",
      description: "Domine a infraestrutura chegando ao Nível 12.",
      unlocked: false,
      reqType: "level",
      reqValue: 12,
      area: "TECH",
      difficulty: "DIFÍCIL",
    },
    {
      id: "t6",
      title: "ALGORITMO PERFEITO",
      description: "Atinja a velocidade máxima de 35 pontos de Agility.",
      unlocked: false,
      reqType: "agility",
      reqValue: 35,
      area: "TECH",
      difficulty: "DIFÍCIL",
    },
    {
      id: "f1",
      title: "PRIMEIRO SQUAT",
      description:
        "Dê o pontapé inicial na sua força física atingindo Strength 12.",
      unlocked: false,
      reqType: "strength",
      reqValue: 12,
      area: "FITNESS",
      difficulty: "FÁCIL",
    },
    {
      id: "f2",
      title: "AQUECIMENTO CONCLUÍDO",
      description: "Mostre que saiu da inércia e alcance o Nível 3.",
      unlocked: false,
      reqType: "level",
      reqValue: 3,
      area: "FITNESS",
      difficulty: "FÁCIL",
    },
    {
      id: "f3",
      title: "HIPERTROFIA DIGITAL",
      description: "Eleve sua capacidade de carga para Strength 20.",
      unlocked: false,
      reqType: "strength",
      reqValue: 20,
      area: "FITNESS",
      difficulty: "MÉDIO",
    },
    {
      id: "f4",
      title: "ATLETA HÍBRIDO",
      description: "Alcance o Nível 7 equilibrando o corpo e mente.",
      unlocked: false,
      reqType: "level",
      reqValue: 7,
      area: "FITNESS",
      difficulty: "MÉDIO",
    },
    {
      id: "f5",
      title: "MONSTRO DO SERVIDOR",
      description: "Derrube barreiras físicas alcançando Strength 38.",
      unlocked: false,
      reqType: "strength",
      reqValue: 38,
      area: "FITNESS",
      difficulty: "DIFÍCIL",
    },
    {
      id: "f6",
      title: "CORPO S-RANK",
      description: "Atinja o ápice da performance geral no Nível 15.",
      unlocked: false,
      reqType: "level",
      reqValue: 15,
      area: "FITNESS",
      difficulty: "DIFÍCIL",
    },
    {
      id: "m1",
      title: "FOCO INICIAL",
      description: "Abra sua mente para novos hábitos no Nível 4.",
      unlocked: false,
      reqType: "level",
      reqValue: 4,
      area: "MINDSET",
      difficulty: "FÁCIL",
    },
    {
      id: "m2",
      title: "DISCIPLINA LEVE",
      description: "Construa sua base mental com 13 pontos de Strength.",
      unlocked: false,
      reqType: "strength",
      reqValue: 13,
      area: "MINDSET",
      difficulty: "FÁCIL",
    },
    {
      id: "m3",
      title: "MENTALIDADE BLINDADA",
      description: "Resista à procrastinação e suba ao Nível 8.",
      unlocked: false,
      reqType: "level",
      reqValue: 8,
      area: "MINDSET",
      difficulty: "MÉDIO",
    },
    {
      id: "m4",
      title: "RESILIÊNCIA DINÂMICA",
      description: "Adapte-se rápido aos problemas com Agility 18.",
      unlocked: false,
      reqType: "agility",
      reqValue: 18,
      area: "MINDSET",
      difficulty: "MÉDIO",
    },
    {
      id: "m5",
      title: "ESTADO DE FLOW",
      description: "Mantenha o foco inabalável alcançando o Nível 14.",
      unlocked: false,
      reqType: "level",
      reqValue: 14,
      area: "MINDSET",
      difficulty: "DIFÍCIL",
    },
    {
      id: "m6",
      title: "ESTATEGISTA SUPREMO",
      description:
        "Pense várias jogadas à frente acumulando 30 pontos de Strength e foco.",
      unlocked: false,
      reqType: "strength",
      reqValue: 30,
      area: "MINDSET",
      difficulty: "DIFÍCIL",
    },
  ]);

  const loadOnlineStats = async () => {
    try {
      let activeUser = await AsyncStorage.getItem("@nexus_active_username");

      // Fallback de segurança para testes locais caso o login não tenha gravado a string
      if (!activeUser) {
        activeUser = "USER_007";
        await AsyncStorage.setItem("@nexus_active_username", "USER_007");
      }

      const response = await fetch(`${API_URL}/stats/${activeUser}`);
      if (!response.ok) throw new Error("Servidor inacessível");

      const data = await response.json();
      if (data) {
        setLevel(data.level ?? 1);
        setExp(data.exp ?? 0);
        setMaxExpForCurrentLevel(data.maxExpForCurrentLevel || 100);
        setStrength(data.strength ?? 10);
        setAgility(data.agility ?? 10);
        setQuests(data.quests || []); // Atualiza a lista reativa de missões
      }
    } catch (e) {
      console.log(
        "Erro ao sincronizar com MongoDB Atlas, verificou o seu IP?",
        e,
      );
    }
  };

  useEffect(() => {
    loadOnlineStats();
  }, []);

  // Motor de conquistas reativo
  useEffect(() => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.unlocked) return ach;
        let conditionMet = false;
        if (ach.reqType === "level" && level >= ach.reqValue)
          conditionMet = true;
        if (ach.reqType === "strength" && strength >= ach.reqValue)
          conditionMet = true;
        if (ach.reqType === "agility" && agility >= ach.reqValue)
          conditionMet = true;

        if (conditionMet) {
          const msg = `[${ach.difficulty}] CONQUISTA DESBLOQUEADA: ${ach.title}`;
          if (Platform.OS === "web") alert(msg);
          else Alert.alert("ACHIEVEMENT UNLOCKED", msg);
          return { ...ach, unlocked: true };
        }
        return ach;
      }),
    );
  }, [level, strength, agility]);

  // Função Corrigida de Injeção
  const addQuest = async (
    title: string,
    desc: string,
    expVal: number,
    cat: any,
  ) => {
    try {
      let activeUser = await AsyncStorage.getItem("@nexus_active_username");
      if (!activeUser) activeUser = "USER_007";

      const response = await fetch(`${API_URL}/quests/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: activeUser,
          title,
          description: desc,
          expReward: expVal,
          category: cat,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // CORREÇÃO: O servidor devolve a lista atualizada dentro de data.quests
        setQuests(data.quests || []);
        if (Platform.OS === "web") alert("MISSÃO GRAVADA NO MONGODB ATLAS!");
        else Alert.alert("SISTEMA", "Missão gravada com sucesso no MongoDB!");
      } else {
        Alert.alert("ERRO", data.error || "Falha ao injetar missão.");
      }
    } catch (e) {
      console.error(e);
      Alert.alert(
        "ERRO DE REDE",
        "Não foi possível alcançar o servidor backend.",
      );
    }
  };

  const completeQuest = async (questId: string) => {
    try {
      let activeUser = await AsyncStorage.getItem("@nexus_active_username");
      if (!activeUser) activeUser = "USER_007";

      const response = await fetch(`${API_URL}/quests/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: activeUser, questId }),
      });

      const data = await response.json();

      if (response.ok) {
        setLevel(data.level);
        setExp(data.exp);
        setMaxExpForCurrentLevel(data.maxExpForCurrentLevel);
        setStrength(data.strength);
        setAgility(data.agility);
        setQuests(data.quests || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <GameContext.Provider
      value={{
        level,
        exp,
        maxExpForCurrentLevel,
        strength,
        agility,
        quests,
        achievements,
        loadOnlineStats,
        addQuest,
        completeQuest,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame error");
  return context;
};
