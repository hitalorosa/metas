"use client";

import { useState } from "react";
import { PlayerCard } from "@/components/player/PlayerCard";
import { HabitList } from "@/components/habits/HabitList";
import { MissionBoard } from "@/components/missions/MissionBoard";
import { GoalList } from "@/components/goals/GoalList";
import { ProgressChart } from "@/components/progress/ProgressChart";
import { RewardShop } from "@/components/rewards/RewardShop";

type Tab = "habitos" | "missoes" | "metas" | "progresso" | "recompensas";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "habitos", label: "Hábitos", icon: "✅" },
  { id: "missoes", label: "Missões", icon: "⚔️" },
  { id: "metas", label: "Metas", icon: "🎯" },
  { id: "progresso", label: "Progresso", icon: "📈" },
  { id: "recompensas", label: "Recompensas", icon: "🎁" },
];

export function AppShell() {
  const [tab, setTab] = useState<Tab>("habitos");

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen border-r border-white/10 bg-card px-3 py-6 gap-1 fixed left-0 top-0">
        <div className="px-3 mb-4">
          <h1 className="text-base font-bold text-violet-400">Sistema MPA</h1>
          <p className="text-[10px] text-muted-foreground">Metas → Progresso → Ação</p>
        </div>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left ${
              tab === t.id
                ? "bg-violet-500/20 text-violet-300"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-56 pb-24 md:pb-6">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="md:hidden flex items-center gap-2 mb-2">
            <h1 className="text-base font-bold text-violet-400">Sistema MPA</h1>
            <span className="text-[10px] text-muted-foreground">Metas → Progresso → Ação</span>
          </div>

          <PlayerCard />

          {tab === "habitos" && <HabitList />}
          {tab === "missoes" && <MissionBoard />}
          {tab === "metas" && <GoalList />}
          {tab === "progresso" && <ProgressChart />}
          {tab === "recompensas" && <RewardShop />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-card/95 backdrop-blur flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
              tab === t.id ? "text-violet-400" : "text-muted-foreground"
            }`}
          >
            <span className="text-base">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
