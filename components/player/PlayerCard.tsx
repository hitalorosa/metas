"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { getXPProgress } from "@/lib/levelSystem";
import { XPBar } from "./XPBar";
import { Pencil, Check, Flame, Coins } from "lucide-react";

export function PlayerCard() {
  const { state, dispatch } = useGame();
  const { player, streak } = state;
  const { level, current, needed, percent } = getXPProgress(player.totalXP);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(player.name);

  function saveName() {
    dispatch({ type: "UPDATE_PLAYER_NAME", name: name.trim() || "Jogador" });
    setEditing(false);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center text-2xl font-bold select-none">
          {level}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                className="bg-white/10 rounded px-2 py-1 text-sm font-semibold w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                autoFocus
              />
              <button onClick={saveName} className="text-green-400 hover:text-green-300">
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base truncate">{player.name}</span>
              <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground">
                <Pencil size={12} />
              </button>
            </div>
          )}
          <span className="text-xs text-violet-400 font-medium">Nível {level}</span>
        </div>
        <div className="flex flex-col items-end gap-1 text-sm">
          <div className="flex items-center gap-1 text-yellow-400 font-semibold">
            <span className="text-base">🪙</span>
            <span>{player.coins}</span>
          </div>
          <div className="flex items-center gap-1 text-orange-400 font-semibold">
            <Flame size={14} />
            <span>{streak.currentStreak}d</span>
          </div>
        </div>
      </div>
      <XPBar percent={percent} current={current} needed={needed} />
      <div className="flex gap-3 text-xs text-muted-foreground">
        <span>XP Total: <strong className="text-foreground">{player.totalXP}</strong></span>
        <span>•</span>
        <span>Maior sequência: <strong className="text-orange-400">{streak.longestStreak}d</strong></span>
      </div>
    </div>
  );
}
