"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Goal } from "@/types";
import { ChevronDown, ChevronUp, Archive, Trash2 } from "lucide-react";

const FREQ_LABELS: Record<string, string> = {
  daily: "Diário",
  weekly: "Semanal",
  "as-needed": "Quando precisar",
};

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const { dispatch } = useGame();
  const [expanded, setExpanded] = useState(false);

  const daysLeft = goal.targetDate
    ? Math.ceil((new Date(goal.targetDate + "T12:00:00").getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm">{goal.title}</h3>
              {daysLeft !== null && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  daysLeft < 7 ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                }`}>
                  {daysLeft > 0 ? `${daysLeft}d restantes` : "Prazo passado"}
                </span>
              )}
            </div>
            {goal.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button
              onClick={() => dispatch({ type: "ARCHIVE_GOAL", goalId: goal.id })}
              className="text-muted-foreground hover:text-yellow-400 p-1"
              title="Arquivar"
            >
              <Archive size={14} />
            </button>
            <button
              onClick={() => dispatch({ type: "DELETE_GOAL", goalId: goal.id })}
              className="text-muted-foreground hover:text-red-400 p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-semibold">{goal.progressPercent}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={goal.progressPercent}
            onChange={(e) =>
              dispatch({ type: "UPDATE_GOAL_PROGRESS", goalId: goal.id, percent: Number(e.target.value) })
            }
            className="w-full accent-violet-500"
          />
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all"
              style={{ width: `${goal.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {expanded && goal.system.length > 0 && (
        <div className="border-t border-white/10 px-4 py-3 space-y-2 bg-white/3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400">Sistema — ações</p>
          {goal.system.map((action) => (
            <div key={action.id} className="flex items-center justify-between text-sm">
              <span>{action.label}</span>
              <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-white/5">
                {FREQ_LABELS[action.frequency]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
