"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MissionType } from "@/types";
import { MISSION_LABELS, MISSION_COINS } from "@/lib/constants";

const DURATIONS = [
  { label: "Hoje",        days: 0 },
  { label: "3 dias",     days: 2 },
  { label: "Esta semana", days: 6 },
  { label: "2 semanas",   days: 13 },
];

interface MissionFormProps {
  open: boolean;
  onClose: () => void;
  defaultType?: MissionType;
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function MissionForm({ open, onClose, defaultType = "main" }: MissionFormProps) {
  const { dispatch, todayKey } = useGame();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<MissionType>(defaultType);
  const [durationIdx, setDurationIdx] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({
      type: "SET_MISSION",
      mission: {
        id: crypto.randomUUID(),
        type,
        title: title.trim(),
        completed: false,
        coinReward: MISSION_COINS[type],
        startDate: todayKey,
        endDate: addDays(DURATIONS[durationIdx].days),
      },
    });
    setTitle("");
    setDurationIdx(0);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Nova missão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium mb-1 block">Tipo</label>
            <div className="flex gap-1">
              {(["main", "secondary", "bonus"] as MissionType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold border transition-colors ${
                    type === t
                      ? "border-violet-500 bg-violet-500/20 text-violet-300"
                      : "border-white/10 bg-white/5 text-muted-foreground"
                  }`}
                >
                  {MISSION_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Missão</label>
            <input
              className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Ex: Treinar 3x esta semana"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Prazo</label>
            <div className="flex gap-1">
              {DURATIONS.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDurationIdx(i)}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium border transition-colors ${
                    durationIdx === i
                      ? "border-violet-500 bg-violet-500/20 text-violet-300"
                      : "border-white/10 bg-white/5 text-muted-foreground"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Recompensa: 🪙 <strong>{MISSION_COINS[type]}</strong> coins ao concluir
          </p>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">Criar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
