"use client";

import { useGame } from "@/context/GameContext";
import { RewardCard } from "./RewardCard";
import { RewardForm } from "./RewardForm";
import { LootBox } from "./LootBox";
import { Icon } from "@/components/ui/Icon";
import { glowShadow } from "@/lib/mpaStyles";

function fmt(n: number) {
  return n.toLocaleString("pt-BR");
}

export function RewardShop() {
  const { state, dispatch } = useGame();
  const { player, streak } = state;
  const lootReady = streak.lootBoxPending;
  const canBuyLoot = player.coins >= 100;

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
          Recompensas
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 11px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              color: "var(--gold)",
              background: "color-mix(in oklab, var(--gold) 14%, transparent)",
              fontFamily: "var(--font-display)",
            }}
          >
            <Icon name="coin" size={16} strokeWidth={2.2} />
            {fmt(player.coins)}
          </span>
          <RewardForm />
        </div>
      </div>

      {/* Loot Box hero */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: 18,
          border: "1px solid color-mix(in oklab, var(--accent) 45%, transparent)",
          padding: 16,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "relative",
          overflow: "hidden",
          boxShadow: glowShadow(0.22, 26),
        }}
      >
        {/* Radial glow bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 50%, color-mix(in oklab, var(--accent) 35%, transparent), transparent 60%)",
            pointerEvents: "none",
            animation: lootReady ? "mpaLootGlow 2s ease-in-out infinite" : "none",
          }}
        />

        {/* Box icon */}
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 15,
            background: "linear-gradient(180deg, var(--accent-glow), var(--accent))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: glowShadow(0.7, 20),
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
          }}
        >
          <Icon name="box" size={28} strokeWidth={1.9} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text)",
            }}
          >
            Loot Box{lootReady ? " 🎉" : ""}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginTop: 2 }}>
            {lootReady
              ? "Disponível! Abra agora para uma recompensa surpresa."
              : "Complete 3 dias seguidos de hábitos para desbloquear."}
          </div>
        </div>

        {/* Action */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {lootReady ? (
            <LootBox />
          ) : (
            <button
              disabled={!canBuyLoot}
              onClick={() =>
                canBuyLoot &&
                dispatch({
                  type: "CLAIM_LOOT_BOX",
                  rewardId: state.rewards[0]?.id ?? "",
                })
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 13px",
                borderRadius: 11,
                fontSize: 12.5,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                cursor: canBuyLoot ? "pointer" : "not-allowed",
                border: canBuyLoot ? "none" : "1px solid var(--line)",
                background: canBuyLoot
                  ? "linear-gradient(180deg, var(--accent-glow), var(--accent))"
                  : "var(--surface-2)",
                color: canBuyLoot ? "#fff" : "var(--text-mute)",
                boxShadow: canBuyLoot ? glowShadow(0.5, 18) : "none",
              }}
            >
              <Icon name="coin" size={13} strokeWidth={2.4} />
              100
            </button>
          )}
        </div>
      </div>

      {/* Rewards grid */}
      {state.rewards.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "32px 0",
            color: "var(--text-mute)",
            fontSize: 14,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎁</div>
          Nenhuma recompensa. Crie a primeira!
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 11,
          }}
        >
          {state.rewards.map((r) => (
            <RewardCard key={r.id} reward={r} />
          ))}
        </div>
      )}
    </div>
  );
}
