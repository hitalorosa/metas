"use client";

import { useGame } from "@/context/GameContext";
import { HabitItem } from "./HabitItem";
import { HabitForm } from "./HabitForm";

export function HabitList() {
  const { state, todayKey } = useGame();
  const { habits, habitLog } = state;
  const doneTodayIds = habitLog[todayKey] ?? [];

  const positive = habits.filter((h) => h.type === "positive");
  const negative = habits.filter((h) => h.type === "negative");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Hábitos de Hoje</h2>
        <HabitForm />
      </div>

      {positive.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Positivos — ganhar XP</p>
          {positive.map((h) => (
            <HabitItem key={h.id} habit={h} done={doneTodayIds.includes(h.id)} />
          ))}
        </div>
      )}

      {negative.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Negativos — perder XP</p>
          {negative.map((h) => (
            <HabitItem key={h.id} habit={h} done={doneTodayIds.includes(h.id)} />
          ))}
        </div>
      )}

      {habits.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhum hábito ainda. Crie o primeiro!
        </p>
      )}
    </div>
  );
}
