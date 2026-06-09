"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { AppState, Action } from "@/types";
import { initialState, CONFIG_VERSION } from "@/lib/initialState";
import { getTodayKey, getYesterdayKey, daysBetween } from "@/lib/dateUtils";

const STORAGE_KEY = "rpg-metas-state-v1";

function allPositiveHabitsDone(state: AppState, dateKey: string): boolean {
  const positiveHabits = state.habits.filter((h) => h.type === "positive");
  if (positiveHabits.length === 0) return false;
  const done = state.habitLog[dateKey] ?? [];
  return positiveHabits.every((h) => done.includes(h.id));
}

function updateStreak(state: AppState, dateKey: string): AppState["streak"] {
  const streak = { ...state.streak };
  if (!allPositiveHabitsDone({ ...state }, dateKey)) return streak;

  const yesterday = getYesterdayKey();
  const last = streak.lastCompletedDateKey;

  if (last === dateKey) return streak;

  if (last === null || last === yesterday) {
    streak.currentStreak = streak.currentStreak + 1;
  } else if (daysBetween(last, dateKey) > 1) {
    streak.currentStreak = 1;
  }

  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.lastCompletedDateKey = dateKey;

  if (streak.currentStreak > 0 && streak.currentStreak % 3 === 0) {
    streak.lootBoxPending = true;
  }

  return streak;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "TOGGLE_HABIT": {
      const { habitId, dateKey } = action;
      const current = state.habitLog[dateKey] ?? [];
      const isDone = current.includes(habitId);
      const habit = state.habits.find((h) => h.id === habitId);
      if (!habit) return state;

      const newLog = {
        ...state.habitLog,
        [dateKey]: isDone
          ? current.filter((id) => id !== habitId)
          : [...current, habitId],
      };

      const xpDelta = habit.type === "positive"
        ? isDone ? -habit.xpValue : habit.xpValue
        : isDone ? habit.xpValue : -habit.xpValue;

      const newTotalXP = Math.max(0, state.player.totalXP + xpDelta);

      const newEntry = { dateKey, xp: newTotalXP };
      const newHistory = [...state.xpHistory.filter((e) => e.dateKey !== dateKey), newEntry]
        .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
        .slice(-21);

      const stateWithLog = {
        ...state,
        habitLog: newLog,
        player: { ...state.player, totalXP: newTotalXP },
        xpHistory: newHistory,
      };

      return { ...stateWithLog, streak: updateStreak(stateWithLog, dateKey) };
    }

    case "ADD_HABIT":
      return { ...state, habits: [...state.habits, action.habit] };

    case "DELETE_HABIT":
      return { ...state, habits: state.habits.filter((h) => h.id !== action.habitId) };

    case "SET_MISSION":
      return { ...state, missions: [...state.missions, action.mission] };

    case "COMPLETE_MISSION": {
      const mission = state.missions.find((m) => m.id === action.missionId);
      if (!mission || mission.completed) return state;
      return {
        ...state,
        missions: state.missions.map((m) =>
          m.id === action.missionId
            ? { ...m, completed: true, completedDate: action.dateKey }
            : m
        ),
        player: { ...state.player, coins: state.player.coins + mission.coinReward },
      };
    }

    case "DELETE_MISSION":
      return { ...state, missions: state.missions.filter((m) => m.id !== action.missionId) };

    case "ADD_GOAL":
      return { ...state, goals: [...state.goals, action.goal] };

    case "UPDATE_GOAL_PROGRESS":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.goalId ? { ...g, progressPercent: action.percent } : g
        ),
      };

    case "ARCHIVE_GOAL":
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.goalId ? { ...g, archived: true } : g
        ),
      };

    case "DELETE_GOAL":
      return { ...state, goals: state.goals.filter((g) => g.id !== action.goalId) };

    case "BUY_REWARD": {
      const reward = state.rewards.find((r) => r.id === action.rewardId);
      if (!reward || state.player.coins < reward.coinCost) return state;
      if (reward.purchaseCount >= reward.maxPurchases) return state;
      return {
        ...state,
        rewards: state.rewards.map((r) =>
          r.id === action.rewardId ? { ...r, purchaseCount: r.purchaseCount + 1 } : r
        ),
        player: { ...state.player, coins: state.player.coins - reward.coinCost },
      };
    }

    case "ADD_REWARD":
      return { ...state, rewards: [...state.rewards, action.reward] };

    case "DELETE_REWARD":
      return { ...state, rewards: state.rewards.filter((r) => r.id !== action.rewardId) };

    case "CLAIM_LOOT_BOX": {
      const reward = state.rewards.find((r) => r.id === action.rewardId);
      const updatedRewards = reward
        ? state.rewards.map((r) =>
            r.id === action.rewardId ? { ...r, purchaseCount: r.purchaseCount + 1 } : r
          )
        : state.rewards;
      return {
        ...state,
        rewards: updatedRewards,
        streak: { ...state.streak, lootBoxPending: false },
      };
    }

    case "UPDATE_PLAYER_NAME":
      return { ...state, player: { ...state.player, name: action.name } };

    default:
      return state;
  }
}

function loadState(): AppState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;

    const saved = JSON.parse(raw) as Partial<AppState>;

    // Versão diferente: preserva progresso do jogador, reseta configuração
    if (saved.configVersion !== CONFIG_VERSION) {
      return {
        ...initialState,
        player: saved.player ?? initialState.player,
        habitLog: saved.habitLog ?? {},
        xpHistory: saved.xpHistory ?? [],
        streak: saved.streak ?? initialState.streak,
      };
    }

    return { ...initialState, ...saved };
  } catch {
    return initialState;
  }
}

interface GameContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  todayKey: string;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const todayKey = getTodayKey();

  return (
    <GameContext.Provider value={{ state, dispatch, todayKey }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
