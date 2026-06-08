"use client";

import { useGame } from "@/context/GameContext";
import { GoalCard } from "./GoalCard";
import { GoalForm } from "./GoalForm";

export function GoalList() {
  const { state } = useGame();
  const active = state.goals.filter((g) => !g.archived);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Metas & Sistemas</h2>
        <GoalForm />
      </div>

      {active.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm space-y-2">
          <p className="text-3xl">🎯</p>
          <p>Nenhuma meta ainda.</p>
          <p className="text-xs">Lembre: metas definem a direção, sistemas constroem o caminho.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
}
