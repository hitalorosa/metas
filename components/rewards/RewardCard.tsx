"use client";

import { useGame } from "@/context/GameContext";
import { Reward } from "@/types";
import { Icon } from "@/components/ui/Icon";
import { glowShadow, ACCENT_RGB } from "@/lib/mpaStyles";

// Map icon names / emoji → lucide-style icon names
const ICON_MAP: Record<string, string> = {
  "🎮": "gamepad",
  "🍿": "popcorn",
  "🍕": "coffee",
  "☕": "coffee",
  "🛏️": "bed",
  "🎓": "book",
  "🍺": "wine",
  "🎁": "gift",
  "⭐": "star",
  "🏆": "award",
};

interface RewardCardProps {
  reward: Reward;
}

export function RewardCard({ reward }: RewardCardProps) {
  const { state, dispatch } = useGame();
  const canBuy =
    state.player.coins >= reward.coinCost && reward.purchaseCount < reward.maxPurchases;
  const exhausted = reward.purchaseCount >= reward.maxPurchases;

  const iconName = ICON_MAP[reward.icon] ?? "gift";

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: 18,
        border: "1px solid var(--line)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        opacity: exhausted ? 0.5 : 1,
      }}
    >
      {/* Icon */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: "var(--surface-2)",
            border: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-glow)",
          }}
        >
          {ICON_MAP[reward.icon] ? (
            <Icon name={iconName} size={25} strokeWidth={1.9} />
          ) : (
            <span style={{ fontSize: 24 }}>{reward.icon}</span>
          )}
        </div>
      </div>

      {/* Title + desc */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 14.5,
          color: "var(--text)",
          textAlign: "center",
        }}
      >
        {reward.title}
      </div>
      {reward.description && (
        <div
          style={{
            fontSize: 11,
            color: "var(--text-mute)",
            textAlign: "center",
            marginTop: 3,
            marginBottom: 11,
            lineHeight: 1.35,
          }}
        >
          {reward.description}
        </div>
      )}

      {/* Purchase tracker dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 12 }}>
        {Array.from({ length: reward.maxPurchases }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background:
                i < reward.purchaseCount
                  ? "var(--accent-glow)"
                  : "rgba(255,255,255,0.12)",
              boxShadow:
                i < reward.purchaseCount
                  ? `0 0 5px rgba(${ACCENT_RGB}, 0.5)`
                  : "none",
            }}
          />
        ))}
      </div>

      {/* Buy button */}
      <div style={{ marginTop: "auto" }}>
        <button
          disabled={!canBuy}
          onClick={() => !exhausted && dispatch({ type: "BUY_REWARD", rewardId: reward.id })}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            width: "100%",
            padding: "7px 13px",
            borderRadius: 11,
            fontSize: 12.5,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            cursor: canBuy ? "pointer" : "not-allowed",
            border: canBuy ? "none" : "1px solid var(--line)",
            background: exhausted
              ? "rgba(255,255,255,0.06)"
              : canBuy
              ? "linear-gradient(180deg, var(--accent-glow), var(--accent))"
              : "var(--surface-2)",
            color: exhausted
              ? "var(--text-mute)"
              : canBuy
              ? "#fff"
              : "var(--text-mute)",
            boxShadow: canBuy ? glowShadow(0.5, 18) : "none",
            transition: "transform 0.12s",
          }}
        >
          <Icon name="coin" size={14} strokeWidth={2.4} />
          {exhausted ? "Esgotado" : reward.coinCost}
        </button>
      </div>
    </div>
  );
}
