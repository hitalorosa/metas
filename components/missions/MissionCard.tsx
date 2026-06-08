"use client";

import { useGame } from "@/context/GameContext";
import { Mission, MissionType } from "@/types";
import { MISSION_COINS, MISSION_LABELS, MISSION_COLORS } from "@/lib/constants";
import { Trash2, Check } from "lucide-react";

interface MissionCardProps {
  type: MissionType;
  mission?: Mission;
  onSetMission: (type: MissionType) => void;
}

export function MissionCard({ type, mission, onSetMission }: MissionCardProps) {
  const { dispatch } = useGame();
  const colorClass = MISSION_COLORS[type];

  if (!mission) {
    return (
      <button
        onClick={() => onSetMission(type)}
        className={`w-full rounded-xl border-2 border-dashed p-4 text-sm font-medium transition-colors hover:bg-white/5 ${colorClass}`}
      >
        + Definir {MISSION_LABELS[type]}
      </button>
    );
  }

  return (
    <div className={`rounded-xl border p-4 space-y-2 transition-all ${colorClass} ${mission.completed ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            {MISSION_LABELS[type]}
          </span>
          <p className={`text-sm font-medium mt-0.5 ${mission.completed ? "line-through" : ""}`}>
            {mission.title}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold">🪙 {mission.coinReward}</span>
        </div>
      </div>
      <div className="flex gap-2">
        {!mission.completed && (
          <button
            onClick={() => dispatch({ type: "COMPLETE_MISSION", missionId: mission.id })}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Check size={12} /> Concluir
          </button>
        )}
        <button
          onClick={() => dispatch({ type: "DELETE_MISSION", missionId: mission.id })}
          className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
