"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { MissionCard } from "./MissionCard";
import { MissionForm } from "./MissionForm";
import { MissionType } from "@/types";

const TYPES: MissionType[] = ["main", "secondary", "bonus"];

export function MissionBoard() {
  const { state, todayKey } = useGame();
  const [settingType, setSettingType] = useState<MissionType | null>(null);

  const todayMissions = state.missions.filter((m) => m.dateKey === todayKey);

  function getMission(type: MissionType) {
    return todayMissions.find((m) => m.type === type);
  }

  const coinsToday = todayMissions
    .filter((m) => m.completed)
    .reduce((acc, m) => acc + m.coinReward, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Missões de Hoje</h2>
        {coinsToday > 0 && (
          <span className="text-sm text-yellow-400 font-semibold">🪙 +{coinsToday} hoje</span>
        )}
      </div>

      <div className="space-y-3">
        {TYPES.map((type) => (
          <MissionCard
            key={type}
            type={type}
            mission={getMission(type)}
            onSetMission={setSettingType}
          />
        ))}
      </div>

      <MissionForm type={settingType} onClose={() => setSettingType(null)} />
    </div>
  );
}
