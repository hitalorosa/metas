"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { MissionCard, PasseCard } from "./MissionCard";
import { MissionForm } from "./MissionForm";
import { Mission } from "@/types";
import { Icon } from "@/components/ui/Icon";
import { glowShadow } from "@/lib/mpaStyles";

function daysBetween(a: string, b: string) {
  const ms =
    new Date(b + "T12:00:00").getTime() - new Date(a + "T12:00:00").getTime();
  return Math.round(ms / 86400000);
}

/** Weekly missions (span ≥ 5 days) → passe cards */
function isPasse(m: Mission): boolean {
  return daysBetween(m.startDate, m.endDate) >= 5;
}

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
    <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "4px 2px 12px" }}>
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

  const passeActive = state.missions.filter((m) => isPasse(m) && (isActive(m) || m.completed));
  const dailyActive = state.missions
    .filter((m) => !isPasse(m) && isActive(m))
    .sort((a, b) => a.endDate.localeCompare(b.endDate));
  const completedToday = state.missions.filter((m) => !isPasse(m) && isCompletedRecently(m));
  const expired = state.missions.filter((m) => !isPasse(m) && isExpired(m));

  // Days left for the passe (use first passe mission's endDate)
  const passeEndDate = passeActive[0]?.endDate;
  const passeDaysLeft = passeEndDate ? Math.max(0, daysBetween(todayKey, passeEndDate)) : 0;

  return (
    <div>
      {/* Header */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 23,
          color: "var(--text)",
          margin: "0 0 16px",
        }}
      >
        Missões
      </h1>

      {/* Passe de Batalha */}
      {passeActive.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionLabel
            icon="crown"
            color="var(--accent-glow)"
            right={
              passeDaysLeft > 0 ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 9px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-dim)",
                    background: "rgba(255,255,255,0.06)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  <Icon name="clock" size={13} />
                  {passeDaysLeft} dias
                </span>
              ) : undefined
            }
          >
            Passe de Batalha
          </SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
            {passeActive.map((m) => (
              <PasseCard key={m.id} mission={m} />
            ))}
          </div>
        </div>
      )}

      {/* Missões de Hoje */}
      <div>
        <SectionLabel
          icon="swords"
          color="var(--text-dim)"
          right={
            <button
              onClick={() => setFormOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 11px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                cursor: "pointer",
                border: "1px solid var(--line-2)",
                background: "transparent",
                color: "var(--text-dim)",
              }}
            >
              <Icon name="plus" size={14} strokeWidth={2.6} />
              Nova
            </button>
          }
        >
          Missões de Hoje
        </SectionLabel>

        {dailyActive.length === 0 && completedToday.length === 0 && expired.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "var(--text-mute)",
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚔️</div>
            Nenhuma missão ativa hoje.
          </div>
        )}

        {dailyActive.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {dailyActive.map((m) => (
              <MissionCard key={m.id} mission={m} />
            ))}
          </div>
        )}

        {completedToday.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--green)",
                marginBottom: 8,
                letterSpacing: 0.5,
                fontFamily: "var(--font-display)",
              }}
            >
              ✓ CONCLUÍDAS HOJE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {completedToday.map((m) => (
                <MissionCard key={m.id} mission={m} />
              ))}
            </div>
          </div>
        )}

        {expired.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--red)",
                marginBottom: 8,
                letterSpacing: 0.5,
                fontFamily: "var(--font-display)",
              }}
            >
              EXPIRADAS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {expired.map((m) => (
                <MissionCard key={m.id} mission={m} expired />
              ))}
            </div>
          </div>
        )}
      </div>

      <MissionForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
