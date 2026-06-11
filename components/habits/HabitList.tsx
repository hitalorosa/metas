"use client";

import { useGame } from "@/context/GameContext";
import { HabitItem } from "./HabitItem";
import { HabitForm } from "./HabitForm";
import { Icon } from "@/components/ui/Icon";

function SectionLabel({
  icon,
  color,
  children,
  right,
}: {
  icon?: string;
  color: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        margin: "4px 2px 12px",
      }}
    >
      {icon && (
        <span style={{ color, display: "flex" }}>
          <Icon name={icon} size={17} strokeWidth={2.4} />
        </span>
      )}
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
      {right}
    </div>
  );
}

export function HabitList() {
  const { state, todayKey } = useGame();
  const { habits, habitLog } = state;
  const doneTodayIds = habitLog[todayKey] ?? [];

  const positive = habits.filter((h) => h.type === "positive");
  const negative = habits.filter((h) => h.type === "negative");
  const doneCount = doneTodayIds.filter((id) => habits.some((h) => h.id === id)).length;
  const total = habits.length;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 23,
            color: "var(--text)",
            margin: 0,
          }}
        >
          Hábitos
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 12.5,
              color: "var(--text-mute)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
          >
            {doneCount}/{total} hoje
          </span>
          <HabitForm />
        </div>
      </div>

      {/* Positivos */}
      {positive.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <SectionLabel icon="sparkles" color="var(--green)">
            Positivos
          </SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {positive.map((h) => (
              <HabitItem key={h.id} habit={h} done={doneTodayIds.includes(h.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Negativos */}
      {negative.length > 0 && (
        <div>
          <SectionLabel icon="alert" color="var(--red)">
            Negativos
          </SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {negative.map((h) => (
              <HabitItem key={h.id} habit={h} done={doneTodayIds.includes(h.id)} />
            ))}
          </div>
        </div>
      )}

      {habits.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 0",
            color: "var(--text-mute)",
            fontSize: 14,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
          Nenhum hábito ainda. Crie o primeiro!
        </div>
      )}
    </div>
  );
}
