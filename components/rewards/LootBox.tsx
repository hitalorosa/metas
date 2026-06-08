"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Reward } from "@/types";

export function LootBox() {
  const { state, dispatch } = useGame();
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Reward | null>(null);

  useEffect(() => {
    if (state.streak.lootBoxPending) setOpen(true);
  }, [state.streak.lootBoxPending]);

  function spin() {
    if (state.rewards.length === 0) return;
    setSpinning(true);
    setWinner(null);

    setTimeout(() => {
      const idx = Math.floor(Math.random() * state.rewards.length);
      setWinner(state.rewards[idx]);
      setSpinning(false);
    }, 1500);
  }

  function claim() {
    if (!winner) return;
    dispatch({ type: "CLAIM_LOOT_BOX", rewardId: winner.id });
    setOpen(false);
    setWinner(null);
  }

  function skip() {
    dispatch({ type: "CLAIM_LOOT_BOX", rewardId: "" });
    setOpen(false);
    setWinner(null);
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">🎁 Loot Box!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Você completou <strong className="text-orange-400">{state.streak.currentStreak} dias seguidos</strong>!<br />
            Você ganhou uma recompensa surpresa!
          </p>

          {!winner && !spinning && (
            <Button onClick={spin} className="w-full bg-gradient-to-r from-violet-600 to-purple-500">
              Abrir caixa 🎲
            </Button>
          )}

          {spinning && (
            <div className="py-6 text-4xl animate-bounce">🎁</div>
          )}

          {winner && (
            <div className="space-y-3">
              <div className="rounded-xl bg-violet-500/20 border border-violet-500/30 p-5 space-y-1">
                <div className="text-4xl">{winner.icon}</div>
                <p className="font-bold text-lg">{winner.title}</p>
                {winner.description && (
                  <p className="text-sm text-muted-foreground">{winner.description}</p>
                )}
              </div>
              <Button onClick={claim} className="w-full">Resgatar!</Button>
            </div>
          )}

          <button onClick={skip} className="text-xs text-muted-foreground hover:text-foreground underline">
            Pular por agora
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
