import { AppState } from "@/types";

export const initialState: AppState = {
  player: {
    name: "Hitalo",
    totalXP: 0,
    coins: 0,
  },

  habits: [
    // Positivos
    { id: "h1",  name: "Acordar até 05:30",                    type: "positive", xpValue: 30, icon: "⏰" },
    { id: "h2",  name: "Treino concluído",                      type: "positive", xpValue: 50, icon: "🏋️" },
    { id: "h3",  name: "Alimentação dentro do plano",           type: "positive", xpValue: 40, icon: "🥗" },
    { id: "h4",  name: "Estudo da faculdade (mín. 45 min)",     type: "positive", xpValue: 45, icon: "🎓" },
    { id: "h5",  name: "Inglês (mín. 20 min)",                  type: "positive", xpValue: 35, icon: "🇺🇸" },
    { id: "h6",  name: "Leitura (10+ min)",                     type: "positive", xpValue: 20, icon: "📚" },
    { id: "h7",  name: "Higiene facial completa",               type: "positive", xpValue: 15, icon: "🧴" },
    { id: "h8",  name: "Organizar mesa/quarto (10 min)",        type: "positive", xpValue: 15, icon: "🧹" },
    { id: "h9",  name: "Trabalhar no negócio (30+ min)",        type: "positive", xpValue: 60, icon: "🚀" },
    { id: "h10", name: "Dormir antes das 23:00",                type: "positive", xpValue: 40, icon: "😴" },
    // Negativos
    { id: "h11", name: "+2h de redes sociais sem propósito",    type: "negative", xpValue: 40, icon: "📱" },
    { id: "h12", name: "Pular treino sem motivo",               type: "negative", xpValue: 60, icon: "❌" },
    { id: "h13", name: "Dormir após 00:30",                     type: "negative", xpValue: 35, icon: "🌙" },
    { id: "h14", name: "Gasto impulsivo não planejado",         type: "negative", xpValue: 50, icon: "💸" },
    { id: "h15", name: "Faltar estudo planejado",               type: "negative", xpValue: 40, icon: "📉" },
  ],

  habitLog: {},

  missions: [],

  goals: [
    {
      id: "g1",
      title: "Meter o Shape",
      description: "Ganhar disposição, disciplina, autoestima e melhorar saúde.",
      targetDate: "2026-09-06",
      progressPercent: 0,
      archived: false,
      createdAt: new Date().toISOString(),
      system: [
        { id: "s1a", label: "Treino 5x por semana",                    frequency: "weekly" },
        { id: "s1b", label: "Consumir proteína em todas as refeições", frequency: "daily" },
        { id: "s1c", label: "Dormir antes das 23h",                    frequency: "daily" },
        { id: "s1d", label: "Beber 3L de água por dia",               frequency: "daily" },
        { id: "s1e", label: "Registrar peso semanalmente",            frequency: "weekly" },
      ],
    },
    {
      id: "g2",
      title: "Juntar R$ 5.000",
      description: "Criar reserva para oportunidades e futuro negócio.",
      targetDate: "2026-12-08",
      progressPercent: 0,
      archived: false,
      createdAt: new Date().toISOString(),
      system: [
        { id: "s2a", label: "Registrar gastos diariamente",     frequency: "daily" },
        { id: "s2b", label: "Revisão financeira todo domingo",  frequency: "weekly" },
        { id: "s2c", label: "Separar valor fixo semanalmente",  frequency: "weekly" },
        { id: "s2d", label: "Eliminar compras por impulso",     frequency: "daily" },
        { id: "s2e", label: "Definir teto de lazer mensal",     frequency: "as-needed" },
      ],
    },
    {
      id: "g3",
      title: "Aprender Inglês",
      description: "Melhorar oportunidades profissionais e empreendedoras.",
      targetDate: "2026-12-08",
      progressPercent: 0,
      archived: false,
      createdAt: new Date().toISOString(),
      system: [
        { id: "s3a", label: "20 minutos diários de estudo",                      frequency: "daily" },
        { id: "s3b", label: "10 palavras novas por dia",                          frequency: "daily" },
        { id: "s3c", label: "Assistir conteúdo em inglês 3x por semana",          frequency: "weekly" },
        { id: "s3d", label: "Revisão semanal de vocabulário",                     frequency: "weekly" },
        { id: "s3e", label: "Conversação ou shadowing 2x por semana",             frequency: "weekly" },
      ],
    },
    {
      id: "g4",
      title: "Construir um Negócio",
      description: "Criar uma fonte de renda própria e independência financeira.",
      targetDate: "2026-12-08",
      progressPercent: 0,
      archived: false,
      createdAt: new Date().toISOString(),
      system: [
        { id: "s4a", label: "30 minutos por dia dedicados ao negócio",  frequency: "daily" },
        { id: "s4b", label: "Validar uma ideia de mercado",             frequency: "as-needed" },
        { id: "s4c", label: "Conversar com potenciais clientes",        frequency: "weekly" },
        { id: "s4d", label: "Construir MVP simples",                    frequency: "as-needed" },
        { id: "s4e", label: "Revisão estratégica semanal",              frequency: "weekly" },
      ],
    },
    {
      id: "g5",
      title: "Evoluir na Faculdade (ADS)",
      description: "Formação sólida em ADS e aumento de valor profissional.",
      targetDate: "2026-12-08",
      progressPercent: 0,
      archived: false,
      createdAt: new Date().toISOString(),
      system: [
        { id: "s5a", label: "Estudo 5x por semana (mín. 45 min)",       frequency: "weekly" },
        { id: "s5b", label: "Revisão das aulas da semana",              frequency: "weekly" },
        { id: "s5c", label: "Entregar atividades antecipadamente",      frequency: "as-needed" },
        { id: "s5d", label: "Projeto pessoal de programação",           frequency: "weekly" },
        { id: "s5e", label: "Revisão semanal de conteúdo",              frequency: "weekly" },
      ],
    },
  ],

  xpHistory: [],

  rewards: [
    { id: "r1", title: "Café especial",          description: "Comprar algo que goste",                                         coinCost: 30,  maxPurchases: 20, purchaseCount: 0, icon: "☕" },
    { id: "r2", title: "Hambúrguer sem culpa",   description: "Refeição livre planejada",                                       coinCost: 50,  maxPurchases: 10, purchaseCount: 0, icon: "🍔" },
    { id: "r3", title: "Sessão gamer",           description: "2 horas livres para jogar",                                     coinCost: 60,  maxPurchases: 15, purchaseCount: 0, icon: "🎮" },
    { id: "r4", title: "Cinema com namorada",    description: "Programa especial",                                              coinCost: 80,  maxPurchases: 10, purchaseCount: 0, icon: "🎬" },
    { id: "r5", title: "Comprar um livro",       description: "Desenvolvimento pessoal",                                        coinCost: 90,  maxPurchases: 10, purchaseCount: 0, icon: "📚" },
    { id: "r6", title: "Comprar uma roupa",      description: "Quando atingir marcos de shape",                                 coinCost: 120, maxPurchases: 5,  purchaseCount: 0, icon: "👕" },
    { id: "r7", title: "Day off parcial",        description: "Meio período sem obrigações",                                   coinCost: 130, maxPurchases: 5,  purchaseCount: 0, icon: "🌴" },
    { id: "r8", title: "Experiência premium",    description: "Restaurante, passeio ou algo especial",                         coinCost: 150, maxPurchases: 5,  purchaseCount: 0, icon: "🏆" },
    { id: "r9", title: "Jogo novo na Steam",     description: "Desbloquear o direito de comprar aquele jogo em promoção",       coinCost: 250, maxPurchases: 5,  purchaseCount: 0, icon: "💳" },
  ],

  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDateKey: null,
    lootBoxPending: false,
  },
};
