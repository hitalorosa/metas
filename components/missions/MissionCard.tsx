"use client";

import { useGame } from "@/context/GameContext";
import { Mission } from "@/types";
import { Icon } from "@/components/ui/Icon";
import { glowShadow } from "@/lib/mpaStyles";

// ── mission kind meta ──────────────────────────────────────────
const KIND_META: Record<string, { color: string; icon: string; label: string }> = {
  main:      { color: "var(--gold)",  icon: "swords", label: "Principal"  },
  secondary: { color: "var(--blue)",  icon: "flag",   label: "Secundária" },
  bonus:     { color: "var(--green)", icon: "star",   label: "Bônus"      },
};

function daysBetween(a: string, b: string) {
  const ms =
    new Date(b + "T12:00:00").getTime() - new Date(a + "T12:00:00").getTime();
  return Math.round(ms / 86400000);
}

// ── Segment bars (passe progress) ─────────────────────────────
export function Segments({ done, total }: { done: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 4, flex: 1 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 7,
            borderRadius: 3,
            background: i < done ? "var(--accent-glow)" : "rgba(255,255,255,0.08)",
            boxShadow: i < done ? glowShadow(0.3, 7) : "none",
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ── Passe de Batalha card (weekly, shown 2×2) ─────────────────
export function PasseCard({ mission }: { mission: Mission }) {
  const { todayKey } = useGame();
  const meta = KIND_META[mission.type] ?? KIND_META.main;
  const missionDays = Math.max(1, daysBetween(mission.startDate, mission.endDate) + 1);
  const elapsed = Math.max(0, Math.min(missionDays, daysBetween(mission.startDate, todayKey) + 1));
  const done = mission.completed ? missionDays : elapsed;
  const complete = mission.completed || done >= missionDays;

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: 16,
        border: `1px solid ${complete ? "color-mix(in oklab, var(--accent) 55%, transparent)" : "var(--line)"}`,
        padding: 14,
        boxShadow: complete ? glowShadow(0.18, 20) : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "var(--surface-2)",
            border: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: meta.color,
            flexShrink: 0,
          }}
        >
          <Icon name={meta.icon} size={18} strokeWidth={2.2} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 12,
              color: "var(--text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {mission.title.replace(/^\S+\s/, "")}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-mute)" }}>
            {missionDays} dias
          </div>
        </div>
      </div>

      <Segments done={done} total={missionDays} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 11,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "var(--text-mute)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
          }}
        >
          {done}/{missionDays} dias
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 9px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--gold)",
            background: "color-mix(in oklab, var(--gold) 16%, transparent)",
            fontFamily: "var(--font-display)",
          }}
        >
          <Icon name="coin" size={12} strokeWidth={2.4} />+{mission.coinReward}
        </span>
      </div>
    </div>
  );
}

// ── Daily mission card ─────────────────────────────────────────
interface MissionCardProps {
  mission: Mission;
  expired?: boolean;
}

export function MissionCard({ mission, expired = false }: MissionCardProps) {
  const { dispatch, todayKey } = useGame();
  const meta = KIND_META[mission.type] ?? KIND_META.main;

  const daysLeft = daysBetween(todayKey, mission.endDate);
  const urgent = daysLeft <= 1;
  const deadlineText =
    daysLeft === 0
      ? "Vence hoje ⚠️"
      : daysLeft === 1
      ? "Vence amanhã"
      : `${daysLeft} dias restantes`;

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: 18,
        border: "1px solid var(--line)",
        padding: 15,
        opacity: mission.completed || expired ? 0.62 : 1,
        position: "relative",
        overflow: "hidden",
        transition: "opacity 0.2s",
      }}
    >
      {mission.completed && (
        <div style={{ position: "absolute", top: 12, right: 12, color: "var(--green)" }}>
          <Icon name="checkCircle" size={22} />
        </div>
      )}

      {/* Kind chip + deadline */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 9px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            color: meta.color,
            background: `color-mix(in oklab, ${meta.color} 16%, transparent)`,
            fontFamily: "var(--font-display)",
          }}
        >
          <Icon name={meta.icon} size={13} strokeWidth={2.4} />
          {meta.label}
        </span>
        <div style={{ flex: 1 }} />
        {!mission.completed && !expired && (
          urgent ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 9px",
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--red)",
                background: "color-mix(in oklab, var(--red) 16%, transparent)",
                fontFamily: "var(--font-display)",
              }}
            >
              <Icon name="alert" size={12} strokeWidth={2.4} />
              {deadlineText}
            </span>
          ) : (
            <span
              style={{
                fontSize: 11.5,
                color: "var(--text-mute)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icon name="clock" size={13} />
              {deadlineText}
            </span>
          )
        )}
        {expired && (
          <span
            style={{
              fontSize: 11,
              color: "var(--red)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
          >
            Expirada
          </span>
        )}
      </div>

      {/* Title */}
      <div
        style={{
          fontWeight: 600,
          fontSize: 15.5,
          color: mission.completed || expired ? "var(--text-mute)" : "var(--text)",
          textDecoration: mission.completed ? "line-through" : "none",
          marginBottom: 14,
          paddingRight: mission.completed ? 30 : 0,
        }}
      >
        {mission.title.replace(/^\S+\s/, "")}
      </div>

      {/* Coin + action */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 9px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--gold)",
            background: "color-mix(in oklab, var(--gold) 16%, transparent)",
            fontFamily: "var(--font-display)",
          }}
        >
          <Icon name="coin" size={13} strokeWidth={2.4} />+{mission.coinReward} moedas
        </span>

        {mission.completed ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 13px",
              borderRadius: 11,
              fontSize: 12.5,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              color: "var(--green)",
              background: "color-mix(in oklab, var(--green) 18%, transparent)",
              border: "1px solid color-mix(in oklab, var(--green) 35%, transparent)",
            }}
          >
            <Icon name="check" size={14} strokeWidth={2.6} />
            Concluída
          </span>
        ) : !expired ? (
          <button
            onClick={() =>
              dispatch({
                type: "COMPLETE_MISSION",
                missionId: mission.id,
                dateKey: todayKey,
              })
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "7px 13px",
              borderRadius: 11,
              fontSize: 12.5,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              cursor: "pointer",
              border: "none",
              background: "linear-gradient(180deg, var(--accent-glow), var(--accent))",
              color: "#fff",
              boxShadow: glowShadow(0.5, 18),
            }}
          >
            Concluir
          </button>
        ) : null}
      </div>
    </div>
  );
}
