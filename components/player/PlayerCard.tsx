"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { getXPProgress } from "@/lib/levelSystem";
import { XPBar } from "./XPBar";
import { Icon } from "@/components/ui/Icon";
import { glowShadow, GOLD_RGB, ORANGE_RGB } from "@/lib/mpaStyles";

function fmt(n: number) {
  return n.toLocaleString("pt-BR");
}

/** Circular avatar with conic-gradient XP ring + level number */
export function Avatar({
  level,
  size = 72,
  progress = 1,
  glow = true,
}: {
  level: number;
  size?: number;
  progress?: number;
  glow?: boolean;
}) {
  const ringW = Math.max(3, Math.round(size * 0.045));
  const deg = Math.round(Math.max(0, Math.min(1, progress)) * 360);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(var(--accent-glow) ${deg}deg, rgba(255,255,255,0.08) ${deg}deg)`,
          padding: ringW,
          boxShadow: glow ? glowShadow(0.55, size * 0.28) : "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle at 50% 30%, var(--surface-2), var(--surface))",
            border: "1px solid var(--line-2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: size * 0.34,
              color: "var(--accent-glow)",
              lineHeight: 1,
            }}
          >
            {level}
          </span>
          <span
            style={{
              fontSize: Math.max(7, size * 0.1),
              letterSpacing: 1.5,
              color: "var(--text-mute)",
              fontWeight: 600,
              marginTop: size * 0.02,
            }}
          >
            NÍVEL
          </span>
        </div>
      </div>
    </div>
  );
}

/** Compact sticky header shown at top of every tab */
export function ProfileHeader({
  onAvatarClick,
}: {
  onAvatarClick?: () => void;
}) {
  const { state } = useGame();
  const { player, streak } = state;
  const { level, current, needed } = getXPProgress(player.totalXP);
  const progress = needed > 0 ? current / needed : 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "2px 2px 14px",
      }}
    >
      <div onClick={onAvatarClick} style={{ cursor: onAvatarClick ? "pointer" : "default" }}>
        <Avatar level={level} size={48} progress={progress} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text)",
            }}
          >
            {player.name}
          </span>
          {streak.currentStreak > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 9px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--orange)",
                background: "color-mix(in oklab, var(--orange) 16%, transparent)",
                fontFamily: "var(--font-display)",
              }}
            >
              <Icon name="flame" size={13} strokeWidth={2.4} />
              {streak.currentStreak}d
            </span>
          )}
        </div>
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <XPBar percent={progress * 100} height={7} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              color: "var(--text-mute)",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {current}/{needed}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "6px 10px",
          borderRadius: 999,
          background: "color-mix(in oklab, var(--gold) 14%, transparent)",
        }}
      >
        <span style={{ color: "var(--gold)", display: "flex" }}>
          <Icon name="coin" size={16} strokeWidth={2.2} />
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 14,
            color: "var(--gold)",
          }}
        >
          {fmt(player.coins)}
        </span>
      </div>
    </div>
  );
}

/** Full profile card — "card" variant (default on the tab) */
export function PlayerCard() {
  const { state, dispatch } = useGame();
  const { player, streak } = state;
  const { level, current, needed, percent } = getXPProgress(player.totalXP);
  const progress = needed > 0 ? current / needed : 1;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(player.name);

  function saveName() {
    dispatch({ type: "UPDATE_PLAYER_NAME", name: name.trim() || "Jogador" });
    setEditing(false);
  }

  const stats = [
    { icon: "coin", v: fmt(player.coins), l: "moedas", c: "var(--gold)" },
    { icon: "flame", v: String(streak.currentStreak), l: "dias", c: "var(--orange)" },
    { icon: "star", v: fmt(player.totalXP), l: "XP total", c: "var(--accent-glow)" },
  ];

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: 18,
        border: "1px solid var(--line)",
        boxShadow: glowShadow(0.22, 26),
        padding: 20,
      }}
    >
      {/* Avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
        <Avatar level={level} size={80} progress={progress} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid var(--line-2)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: "var(--text)",
                  width: "100%",
                  outline: "none",
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                autoFocus
              />
              <button
                onClick={saveName}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--green)",
                  display: "flex",
                }}
              >
                <Icon name="check" size={18} strokeWidth={2.6} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 21,
                  color: "var(--text)",
                }}
              >
                {player.name}
              </span>
              <button
                onClick={() => {
                  setName(player.name);
                  setEditing(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-mute)",
                  display: "flex",
                  padding: 0,
                }}
              >
                <Icon name="pencil" size={14} />
              </button>
            </div>
          )}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              marginTop: 6,
              padding: "4px 10px",
              borderRadius: 999,
              background: "color-mix(in oklab, var(--accent) 18%, transparent)",
              color: "var(--accent-glow)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            <Icon name="crown" size={13} strokeWidth={2.4} /> Nível {level}
          </span>
        </div>
      </div>

      {/* XP bar */}
      <XPBar percent={percent} current={current} needed={needed} height={11} showShine />

      {/* Stats row */}
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        {stats.map((s) => (
          <div
            key={s.l}
            style={{
              flex: 1,
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "11px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: s.c,
                display: "flex",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <Icon name={s.icon} size={18} strokeWidth={2.3} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--text)",
              }}
            >
              {s.v}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--text-mute)", marginTop: 1 }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
