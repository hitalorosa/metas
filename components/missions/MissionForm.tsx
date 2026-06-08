"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MissionType } from "@/types";
import { MISSION_LABELS, MISSION_COINS } from "@/lib/constants";

interface MissionFormProps {
  type: MissionType | null;
  onClose: () => void;
}

export function MissionForm({ type, onClose }: MissionFormProps) {
  const { dispatch, todayKey } = useGame();
  const [title, setTitle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !type) return;
    dispatch({
      type: "SET_MISSION",
      mission: {
        id: crypto.randomUUID(),
        dateKey: todayKey,
        type,
        title: title.trim(),
        completed: false,
        coinReward: MISSION_COINS[type],
      },
    });
    setTitle("");
    onClose();
  }

  return (
    <Dialog open={!!type} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{type ? `Definir ${MISSION_LABELS[type]}` : ""}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <input
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            placeholder="O que você precisa fazer hoje?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          {type && (
            <p className="text-xs text-muted-foreground">
              Recompensa: 🪙 <strong>{MISSION_COINS[type]}</strong> coins ao concluir
            </p>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
