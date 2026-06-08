"use client";

import { useGame } from "@/context/GameContext";
import { Reward } from "@/types";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RewardCardProps {
  reward: Reward;
}

export function RewardCard({ reward }: RewardCardProps) {
  const { state, dispatch } = useGame();
  const canBuy =
    state.player.coins >= reward.coinCost &&
    reward.purchaseCount < reward.maxPurchases;
  const exhausted = reward.purchaseCount >= reward.maxPurchases;

  return (
    <div className={`rounded-xl border border-white/10 bg-card p-4 space-y-3 ${exhausted ? "opacity-50" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{reward.icon}</span>
          <div>
            <p className="font-semibold text-sm">{reward.title}</p>
            {reward.description && (
              <p className="text-xs text-muted-foreground">{reward.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: "DELETE_REWARD", rewardId: reward.id })}
          className="text-muted-foreground hover:text-red-400 p-1"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: reward.maxPurchases }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i < reward.purchaseCount ? "bg-violet-500" : "bg-white/15"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {reward.purchaseCount}/{reward.maxPurchases}
        </span>
      </div>

      <Button
        size="sm"
        className="w-full"
        disabled={!canBuy}
        variant={canBuy ? "default" : "outline"}
        onClick={() => dispatch({ type: "BUY_REWARD", rewardId: reward.id })}
      >
        {exhausted ? "Esgotado" : `🪙 ${reward.coinCost} coins`}
      </Button>
    </div>
  );
}
