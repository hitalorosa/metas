"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Goal } from "@/types";
import { Icon } from "@/components/ui/Icon";
import { XPBar } from "@/components/player/XPBar";
import { glowShadow } from "@/lib/mpaStyles";

const FREQ_LABELS: Record<string, string> = {
  daily:      "Diário",
  weekly:     "Semanal",
  "as-needed": "Quando precisar",
};

const FREQ_COLORS: Record<string, string> = {
  daily:      "var(--green)",
  weekly:     "var(--blue)",
  "as-needed": "var(--text-mute)",
};

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const { dispatch } = useGame();
  const [expanded, setExpanded] = useState(false);

  const daysLeft = goal.targetDate
    ? Math.ceil(
        (new Date(goal.targetDate + "T12:00:00").getTime() - Date.now()) / 86400000
      )
    : null;

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: 18,
        border: "1px solid var(--line)",
        overflow: "hidden",
      }}
    >
      {/* Header (clickable) */}
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{ padding: 16, cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 13 }}>
          {/* Icon box */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-glow)",
              flexShrink: 0,
            }}
          >
            <Icon name="target" size={19} strokeWidth={2.2} />
          </div>

          {/* Title + days */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 15.5,
                color: "var(--text)",
              }}
            >
              {goal.title}
            </div>
            {daysLeft !== null && (
              <div
                style={{
                  fontSize: 11.5,
                  color: "var(--text-mute)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 2,
                }}
              >
                <Icon name="calendar" size={12} />
                {daysLeft > 0 ? `${daysLeft} dias restantes` : "Prazo vencido"}
              </div>
            )}
          </div>

          {/* Progress % + chevron */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--accent-glow)",
              }}
            >
              {goal.progressPercent}%
            </div>
            <span
              style={{
                color: "var(--text-mute)",
                display: "inline-flex",
                transform: expanded ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              <Icon name="chevronD" size={16} />
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <XPBar percent={goal.progressPercent} height={8} />
      </div>

      {/* Expanded: O Sistema */}
      {expanded && (
        <div
          style={{
            padding: "4px 16px 16px",
            borderTop: "1px solid var(--line)",
          }}
        >
          {/* Progress slider (still functional) */}
          <div style={{ marginBottom: 14, marginTop: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "var(--text-mute)",
                marginBottom: 6,
                fontFamily: "var(--font-display)",
                fontWeight: 600,
              }}
            >
              <span>Ajustar progresso</span>
              <span style={{ color: "var(--accent-glow)" }}>{goal.progressPercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={goal.progressPercent}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_GOAL_PROGRESS",
                  goalId: goal.id,
                  percent: Number(e.target.value),
                })
              }
              style={{ width: "100%", accentColor: "var(--accent)" }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Sistema label */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: "var(--text-mute)",
              fontFamily: "var(--font-display)",
              margin: "8px 0 10px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            <Icon name="repeat" size={13} />O Sistema
          </div>

          {/* Actions */}
          {goal.system.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {goal.system.map((action) => {
                const freqColor = FREQ_COLORS[action.frequency] ?? "var(--text-mute)";
                return (
                  <div
                    key={action.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 11px",
                      background: "var(--surface-2)",
                      borderRadius: 11,
                      border: "1px solid var(--line)",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: "var(--accent-glow)",
                        flexShrink: 0,
                        boxShadow: glowShadow(0.6, 6),
                      }}
                    />
                    <span style={{ flex: 1, fontSize: 13.5, color: "var(--text)" }}>
                      {action.label}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "3px 9px",
                        borderRadius: 999,
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: freqColor,
                        background: `color-mix(in oklab, ${freqColor} 16%, transparent)`,
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {FREQ_LABELS[action.frequency] ?? action.frequency}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "var(--text-mute)" }}>
              Nenhuma ação configurada.
            </p>
          )}

          {/* Archive / delete */}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "ARCHIVE_GOAL", goalId: goal.id });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                cursor: "pointer",
                border: "1px solid var(--line-2)",
                background: "transparent",
                color: "var(--text-mute)",
              }}
            >
              <Icon name="archive" size={14} />
              Arquivar
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "DELETE_GOAL", goalId: goal.id });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                cursor: "pointer",
                border: "1px solid var(--line-2)",
                background: "transparent",
                color: "var(--red)",
              }}
            >
              <Icon name="x" size={14} />
              Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
