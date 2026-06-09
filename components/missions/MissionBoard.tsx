"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { MissionCard } from "./MissionCard";
import { MissionForm } from "./MissionForm";
import { Mission } from "@/types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MissionBoard() {
  const { state, todayKey } = useGame();
  const [formOpen, setFormOpen] = useState(false);

  function isActive(m: Mission): boolean {
    return m.startDate <= todayKey && m.endDate >= todayKey && !m.completed;
  }

  function isExpired(m: Mission): boolean {
    return m.endDate < todayKey && !m.completed;
  }

  function isCompletedRecently(m: Mission): boolean {
    return m.completed && (m.completedDate ?? "") >= todayKey;
  }

  const active = state.missions.filter(isActive);
  const completedToday = state.missions.filter(isCompletedRecently);
  const expired = state.missions.filter(isExpired);

  const coinsToday = completedToday.reduce((acc, m) => acc + m.coinReward, 0);

  // ordena ativas por prazo (mais urgentes primeiro)
  const sortedActive = [...active].sort((a, b) => a.endDate.localeCompare(b.endDate));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Missões Ativas</h2>
          {coinsToday > 0 && (
            <p className="text-xs text-yellow-400">🪙 +{coinsToday} coins ganhos hoje</p>
          )}
        </div>
        <Button size="sm" variant="outline" className="gap-1" onClick={() => setFormOpen(true)}>
          <Plus size={14} /> Nova missão
        </Button>
      </div>

      {sortedActive.length === 0 && completedToday.length === 0 && (
        <div className="text-center py-10 text-muted-foreground text-sm space-y-1">
          <p className="text-2xl">⚔️</p>
          <p>Nenhuma missão ativa.</p>
          <p className="text-xs">Crie uma nova missão para começar.</p>
        </div>
      )}

      {sortedActive.length > 0 && (
        <div className="space-y-2">
          {sortedActive.map((m) => (
            <MissionCard key={m.id} mission={m} />
          ))}
        </div>
      )}

      {completedToday.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Concluídas</p>
          {completedToday.map((m) => (
            <MissionCard key={m.id} mission={m} />
          ))}
        </div>
      )}

      {expired.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Expiradas</p>
          {expired.map((m) => (
            <MissionCard key={m.id} mission={m} expired />
          ))}
        </div>
      )}

      <MissionForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
