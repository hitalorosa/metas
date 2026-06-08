import { AppState } from "@/types";

export const initialState: AppState = {
  player: {
    name: "Jogador",
    totalXP: 0,
    coins: 0,
  },
  habits: [
    { id: "h1", name: "Beber 2L de água", type: "positive", xpValue: 10, icon: "💧" },
    { id: "h2", name: "Treinar", type: "positive", xpValue: 30, icon: "🏋️" },
    { id: "h3", name: "Ler 10 páginas", type: "positive", xpValue: 20, icon: "📚" },
    { id: "h4", name: "Ficar no celular 2h+", type: "negative", xpValue: 20, icon: "📱" },
  ],
  habitLog: {},
  missions: [],
  goals: [],
  xpHistory: [],
  rewards: [
    { id: "r1", title: "Sessão de jogo", description: "1 hora de jogo sem culpa", coinCost: 50, maxPurchases: 10, purchaseCount: 0, icon: "🎮" },
    { id: "r2", title: "Série favorita", description: "2 episódios da sua série", coinCost: 30, maxPurchases: 10, purchaseCount: 0, icon: "📺" },
    { id: "r3", title: "Rolê leve", description: "Sair para tomar um café", coinCost: 40, maxPurchases: 5, purchaseCount: 0, icon: "☕" },
  ],
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDateKey: null,
    lootBoxPending: false,
  },
};
