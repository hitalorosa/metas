"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import { getXPProgress } from "@/lib/levelSystem";
import { PlayerCard, ProfileHeader, Avatar } from "@/components/player/PlayerCard";
import { HabitList } from "@/components/habits/HabitList";
import { MissionBoard } from "@/components/missions/MissionBoard";
import { GoalList } from "@/components/goals/GoalList";
import { ProgressChart } from "@/components/progress/ProgressChart";
import { RewardShop } from "@/components/rewards/RewardShop";
import { Icon } from "@/components/ui/Icon";
import { glowShadow, ACCENT_RGB, GOLD_RGB } from "@/lib/mpaStyles";

type Tab = "habitos" | "missoes" | "metas" | "progresso" | "recompensas";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "habitos",     label: "Hábitos",     icon: "flame"   },
  { id: "missoes",     label: "Missões",     icon: "swords"  },
  { id: "metas",       label: "Metas",       icon: "target"  },
  { id: "progresso",   label: "Progresso",   icon: "trending"},
  { id: "recompensas", label: "Recompensas", icon: "gift"    },
];

// ── Float toast ────────────────────────────────────────────────
interface FloatItem {
  id: number;
  text: string;
  color: string;
  icon: string;
}

function FloatLayer({ floats }: { floats: FloatItem[] }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 70,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {floats.map((f) => (
        <div
          key={f.id}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 999,
            background: "color-mix(in oklab, var(--surface-2) 92%, black)",
            border: `1px solid ${f.color}`,
            color: f.color,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 13.5,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            animation: "mpaFloat 1.4s ease-out forwards",
          }}
        >
          <Icon name={f.icon} size={15} strokeWidth={2.5} />
          {f.text}
        </div>
      ))}
    </div>
  );
}

// ── Mobile bottom nav with glow underline ─────────────────────
function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "stretch",
        background: "color-mix(in oklab, var(--surface) 92%, black)",
        borderTop: "1px solid var(--line)",
        backdropFilter: "blur(12px)",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
      }}
    >
      {TABS.map((t) => {
        const on = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "10px 2px 9px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: on ? "var(--accent-glow)" : "var(--text-mute)",
              transition: "color 0.2s",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {/* Active glow indicator at top */}
            {on && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 26,
                  height: 3,
                  borderRadius: 3,
                  background: "var(--accent-glow)",
                  boxShadow: `0 0 10px rgba(${ACCENT_RGB}, 0.7)`,
                }}
              />
            )}
            <Icon name={t.icon} size={21} strokeWidth={on ? 2.4 : 2} />
            <span
              style={{
                fontSize: 9.5,
                fontWeight: on ? 700 : 600,
                fontFamily: "var(--font-display)",
                letterSpacing: 0.1,
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ── Desktop sidebar ────────────────────────────────────────────
function Sidebar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  const { state } = useGame();
  const { level, current, needed } = getXPProgress(state.player.totalXP);
  const progress = needed > 0 ? current / needed : 1;

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "color-mix(in oklab, var(--surface) 70%, black)",
        borderRight: "1px solid var(--line)",
        padding: "22px 14px",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 8px 22px",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(180deg, var(--accent-glow), var(--accent))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: glowShadow(0.5, 14),
            flexShrink: 0,
          }}
        >
          <Icon name="crown" size={19} />
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
              color: "var(--text)",
              letterSpacing: 0.3,
            }}
          >
            Sistema MPA
          </div>
          <div
            style={{
              fontSize: 9.5,
              color: "var(--text-mute)",
              letterSpacing: 1.2,
            }}
          >
            METAS · PROGRESSO · AÇÃO
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {TABS.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 12px",
                borderRadius: 12,
                border: on
                  ? "1px solid color-mix(in oklab, var(--accent) 30%, transparent)"
                  : "1px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                background: on
                  ? "color-mix(in oklab, var(--accent) 18%, transparent)"
                  : "transparent",
                color: on ? "var(--accent-glow)" : "var(--text-dim)",
                transition: "all 0.18s",
                fontFamily: "var(--font-display)",
                fontWeight: on ? 700 : 600,
                fontSize: 14,
              }}
            >
              <Icon name={t.icon} size={19} strokeWidth={on ? 2.4 : 2} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Avatar + player at bottom */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          padding: 10,
          borderRadius: 14,
          border: "1px solid var(--line)",
          background: "var(--surface-2)",
          marginTop: 12,
        }}
      >
        <Avatar level={level} size={38} progress={progress} glow={false} />
        <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13.5,
              color: "var(--text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {state.player.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--gold)",
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <Icon name="coin" size={12} strokeWidth={2.2} />
            {state.player.coins.toLocaleString("pt-BR")}
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Main AppShell ──────────────────────────────────────────────
export function AppShell() {
  const [tab, setTab] = useState<Tab>("habitos");
  const { state } = useGame();

  // Float toasts
  const [floats, setFloats] = useState<FloatItem[]>([]);
  const floatId = useRef(0);
  const prevTotalXP = useRef(state.player.totalXP);
  const prevCoins = useRef(state.player.coins);
  const prevMissions = useRef(state.missions);

  // Level-up flash
  const [flash, setFlash] = useState(false);
  const { level } = getXPProgress(state.player.totalXP);
  const prevLevel = useRef(level);

  const pushFloat = useCallback(
    (text: string, color: string, icon: string) => {
      const id = ++floatId.current;
      setFloats((f) => [...f, { id, text, color, icon }]);
      setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1500);
    },
    []
  );

  // XP change → float
  useEffect(() => {
    const delta = state.player.totalXP - prevTotalXP.current;
    if (delta !== 0 && prevTotalXP.current !== 0) {
      if (delta > 0) pushFloat(`+${delta} XP`, "var(--green)", "star");
      else pushFloat(`${delta} XP`, "var(--red)", "alert");
    }
    prevTotalXP.current = state.player.totalXP;
  }, [state.player.totalXP, pushFloat]);

  // Level-up → flash
  useEffect(() => {
    if (level > prevLevel.current) {
      setFlash(true);
      setTimeout(() => setFlash(false), 900);
    }
    prevLevel.current = level;
  }, [level]);

  // Mission completed → coin float
  useEffect(() => {
    const newly = state.missions.filter(
      (m) =>
        m.completed &&
        !prevMissions.current.find((pm) => pm.id === m.id)?.completed
    );
    newly.forEach((m) => pushFloat(`+${m.coinReward}`, "var(--gold)", "coin"));
    prevMissions.current = state.missions;
  }, [state.missions, pushFloat]);

  const showHeader = tab !== "progresso"; // progresso has its own h1

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Level-up flash overlay */}
      {flash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            pointerEvents: "none",
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent) 40%, transparent), transparent 70%)",
            animation: "mpaFlash .9s ease-out forwards",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 30,
              color: "#fff",
              textShadow: "0 2px 20px rgba(0,0,0,.6)",
              animation: "mpaPop .9s ease-out",
            }}
          >
            NÍVEL {level}!
          </div>
        </div>
      )}

      {/* Float toasts */}
      <FloatLayer floats={floats} />

      {/* Desktop layout */}
      <div className="hidden md:flex">
        <Sidebar active={tab} onChange={setTab} />
        <main
          style={{
            marginLeft: 220,
            flex: 1,
            minWidth: 0,
            padding: "30px 36px 40px",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {tab !== "habitos" && (
              <div style={{ marginBottom: 24 }}>
                <PlayerCard />
              </div>
            )}
            {tab === "habitos" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.55fr 1fr",
                  gap: 22,
                  alignItems: "start",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <PlayerCard />
                  <HabitList />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <ProgressChart />
                </div>
              </div>
            )}
            {tab === "missoes"     && <MissionBoard />}
            {tab === "metas"       && <GoalList />}
            {tab === "progresso"   && <ProgressChart />}
            {tab === "recompensas" && <RewardShop />}
          </div>
        </main>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <main
          style={{
            paddingBottom: 80, // room for bottom nav
          }}
        >
          <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 16px" }}>
            {/* Sticky profile header */}
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: "linear-gradient(180deg, var(--bg) 80%, transparent)",
                paddingTop: 12,
              }}
            >
              <ProfileHeader />
            </div>

            {/* Tab content */}
            <div style={{ paddingBottom: 16 }}>
              {tab === "habitos"     && <HabitList />}
              {tab === "missoes"     && <MissionBoard />}
              {tab === "metas"       && <GoalList />}
              {tab === "progresso"   && <ProgressChart />}
              {tab === "recompensas" && <RewardShop />}
            </div>
          </div>
        </main>

        <BottomNav active={tab} onChange={setTab} />
      </div>
    </div>
  );
}
