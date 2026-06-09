export type HabitType = "positive" | "negative";
export type MissionType = "main" | "secondary" | "bonus";

export interface Player {
  name: string;
  totalXP: number;
  coins: number;
}

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  xpValue: number;
  icon: string;
}

export type HabitLog = Record<string, string[]>;

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  completed: boolean;
  coinReward: number;
  startDate: string;      // YYYY-MM-DD — quando aparece
  endDate: string;        // YYYY-MM-DD — prazo limite
  completedDate?: string; // YYYY-MM-DD — quando foi concluída
}

export interface SystemAction {
  id: string;
  label: string;
  frequency: "daily" | "weekly" | "as-needed";
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progressPercent: number;
  system: SystemAction[];
  createdAt: string;
  archived: boolean;
}

export interface XPEntry {
  dateKey: string;
  xp: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  coinCost: number;
  maxPurchases: number;
  purchaseCount: number;
  icon: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDateKey: string | null;
  lootBoxPending: boolean;
}

export interface AppState {
  configVersion: string;
  player: Player;
  habits: Habit[];
  habitLog: HabitLog;
  missions: Mission[];
  goals: Goal[];
  xpHistory: XPEntry[];
  rewards: Reward[];
  streak: StreakData;
}

export type Action =
  | { type: "TOGGLE_HABIT"; habitId: string; dateKey: string }
  | { type: "ADD_HABIT"; habit: Habit }
  | { type: "DELETE_HABIT"; habitId: string }
  | { type: "SET_MISSION"; mission: Mission }
  | { type: "COMPLETE_MISSION"; missionId: string; dateKey: string }
  | { type: "DELETE_MISSION"; missionId: string }
  | { type: "ADD_GOAL"; goal: Goal }
  | { type: "UPDATE_GOAL_PROGRESS"; goalId: string; percent: number }
  | { type: "ARCHIVE_GOAL"; goalId: string }
  | { type: "DELETE_GOAL"; goalId: string }
  | { type: "BUY_REWARD"; rewardId: string }
  | { type: "ADD_REWARD"; reward: Reward }
  | { type: "DELETE_REWARD"; rewardId: string }
  | { type: "CLAIM_LOOT_BOX"; rewardId: string }
  | { type: "UPDATE_PLAYER_NAME"; name: string };
