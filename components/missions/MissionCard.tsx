"use client";

import { useGame } from "@/context/GameContext";
import { Mission } from "@/types";
import { MISSION_LABELS, MISSION_COLORS } from "@/lib/constants";
import { Trash2, Check, Clock } from "lucide-react";

interface MissionCardProps {
  mission: Mission;
  expired?: boolean;
}

function daysLeft(endDate: string, today: string): number {
  const e = new Date(endDate + "T12:00:00");
  const t = new Date(today + "T12:00:00");
  return Math.ceil((e.getTime() - t.getTime()) / 86400000);
}

export function MissionCard({ mission, expired = false }: MissionCardProps) {
  const { dispatch, todayKey } = useGame();
  const colorClass = MISSION_COLORS[mission.type];
  const remaining = daysLeft(mission.endDate, todayKey);

  let deadlineLabel = "";
  if (mission.completed) {
    deadlineLabel = "✅ Concluída";
  } else if (expired) {
    deadlineLabel = "⌛ Expirada";
  } else if (remaining === 0) {
    deadlineLabel = "⚠️ Vence hoje";
  } else if (remaining === 1) {
    deadlineLabel = "1 dia restante";
  } else {
    deadlineLabel = `${remaining} dias restantes`;
  }

  return (
    <div className={`rounded-xl border p-4 space-y-2 transition-all ${colorClass} ${
      mission.completed || expired ? "opacity-50" : ""
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              {MISSION_LABELS[mission.type]}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
              mission.completed
                ? "bg-green-500/20 text-green-400"
                : expired
                ? "bg-red-500/20 text-red-400"
                : remaining === 0
                ? "bg-orange-500/20 text-orange-400"
                : "bg-white/10 text-muted-foreground"
            }`}>
              <Clock size={9} className="inline mr-0.5" />{deadlineLabel}
            </span>
          </div>
          <p className={`text-sm font-medium ${mission.completed ? "line-through" : ""}`}>
            {mission.title}
          </p>
        </div>
        <span className="text-xs font-bold flex-shrink-0">🪙 {mission.coinReward}</span>
      </div>

      <div className="flex gap-2">
        {!mission.completed && !expired && (
          <button
            onClick={() => dispatch({ type: "COMPLETE_MISSION", missionId: mission.id, dateKey: todayKey })}
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
