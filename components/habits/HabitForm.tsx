"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HabitType } from "@/types";

const ICONS = ["💧", "🏋️", "📚", "🧘", "🏃", "🍎", "😴", "✍️", "🎯", "🚫", "📱", "🍔", "🍺", "🎮", "😤"];

export function HabitForm() {
  const { dispatch } = useGame();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<HabitType>("positive");
  const [xpValue, setXpValue] = useState(10);
  const [icon, setIcon] = useState("🎯");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch({
      type: "ADD_HABIT",
      habit: {
        id: crypto.randomUUID(),
        name: name.trim(),
        type,
        xpValue,
        icon,
      },
    });
    setName("");
    setType("positive");
    setXpValue(10);
    setIcon("🎯");
    setOpen(false);
  }

  return (
    <>
      <Button size="sm" variant="outline" className="gap-1" onClick={() => setOpen(true)}>
        <Plus size={14} /> Novo hábito
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar hábito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium mb-1 block">Nome</label>
            <input
              className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Ex: Beber 2L de água"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tipo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("positive")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium border transition-colors ${
                  type === "positive"
                    ? "border-green-500 bg-green-500/20 text-green-400"
                    : "border-white/10 bg-white/5 text-muted-foreground"
                }`}
              >
                ✅ Positivo (ganhar XP)
              </button>
              <button
                type="button"
                onClick={() => setType("negative")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium border transition-colors ${
                  type === "negative"
                    ? "border-red-500 bg-red-500/20 text-red-400"
                    : "border-white/10 bg-white/5 text-muted-foreground"
                }`}
              >
                ❌ Negativo (perder XP)
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              XP ({type === "positive" ? "+" : "-"}{xpValue})
            </label>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={xpValue}
              onChange={(e) => setXpValue(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5</span><span>100</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Ícone</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors ${
                    icon === ic ? "bg-violet-500/30 ring-1 ring-violet-500" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">Criar hábito</Button>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
