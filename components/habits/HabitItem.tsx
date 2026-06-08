"use client";

import { useGame } from "@/context/GameContext";
import { Habit } from "@/types";
import { Trash2 } from "lucide-react";

interface HabitItemProps {
  habit: Habit;
  done: boolean;
}

export function HabitItem({ habit, done }: HabitItemProps) {
  const { dispatch, todayKey } = useGame();

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all cursor-pointer group ${
        done
          ? "border-violet-500/40 bg-violet-500/10"
          : "border-white/10 bg-white/5 hover:bg-white/8"
      }`}
      onClick={() => dispatch({ type: "TOGGLE_HABIT", habitId: habit.id, dateKey: todayKey })}
    >
      <span className="text-xl select-none">{habit.icon}</span>
      <span className={`flex-1 text-sm font-medium ${done ? "line-through text-muted-foreground" : ""}`}>
        {habit.name}
      </span>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        habit.type === "positive"
          ? "text-green-400 bg-green-400/15"
          : "text-red-400 bg-red-400/15"
      }`}>
        {habit.type === "positive" ? "+" : "-"}{habit.xpValue} XP
      </span>
      <button
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "DELETE_HABIT", habitId: habit.id });
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
