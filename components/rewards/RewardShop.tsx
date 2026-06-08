"use client";

import { useGame } from "@/context/GameContext";
import { RewardCard } from "./RewardCard";
import { RewardForm } from "./RewardForm";
import { LootBox } from "./LootBox";

export function RewardShop() {
  const { state } = useGame();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recompensas</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-yellow-400">🪙 {state.player.coins}</span>
          <RewardForm />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Complete missões para ganhar coins. Cada 3 dias seguidos de hábitos = Loot Box!
      </p>

      {state.rewards.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhuma recompensa. Crie a primeira!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {state.rewards.map((r) => (
            <RewardCard key={r.id} reward={r} />
          ))}
        </div>
      )}

      <LootBox />
    </div>
  );
}
