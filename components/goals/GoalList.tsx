"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { GoalCard } from "./GoalCard";
import { GoalForm } from "./GoalForm";
import { Icon } from "@/components/ui/Icon";

export function GoalList() {
  const { state } = useGame();
  const [showArchived, setShowArchived] = useState(false);
  const active = state.goals.filter((g) => !g.archived);
  const archived = state.goals.filter((g) => g.archived);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
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
          Metas
        </h1>
        <GoalForm />
      </div>

      {/* Active goals */}
      {active.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "36px 0",
            color: "var(--text-mute)",
            fontSize: 14,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <div>Nenhuma meta ativa.</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            Lembre: metas definem a direção, sistemas constroem o caminho.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {active.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      {/* Archived toggle */}
      <button
        onClick={() => setShowArchived((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          marginTop: 18,
          padding: "12px 4px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-mute)",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        <Icon name="archive" size={16} />
        Metas arquivadas ({archived.length})
        <div style={{ flex: 1 }} />
        <span
          style={{
            transform: showArchived ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
            display: "inline-flex",
          }}
        >
          <Icon name="chevronD" size={15} />
        </span>
      </button>

      {showArchived && archived.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {archived.map((g) => (
            <div
              key={g.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "12px 14px",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: 13,
                opacity: 0.7,
              }}
            >
              <span style={{ color: "var(--green)", display: "flex" }}>
                <Icon name="checkCircle" size={18} />
              </span>
              <span style={{ flex: 1, fontSize: 13.5, color: "var(--text-dim)" }}>
                {g.title}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "3px 9px",
                  borderRadius: 999,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: "var(--green)",
                  background: "color-mix(in oklab, var(--green) 16%, transparent)",
                  fontFamily: "var(--font-display)",
                }}
              >
                Concluída
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
