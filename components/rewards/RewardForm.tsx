"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ICONS = ["🎮", "📺", "☕", "🍕", "🎵", "🛋️", "🏖️", "🛍️", "🎬", "🧘", "🎲", "📖"];

export function RewardForm() {
  const { dispatch } = useGame();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coinCost, setCoinCost] = useState(30);
  const [maxPurchases, setMaxPurchases] = useState(5);
  const [icon, setIcon] = useState("🎮");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({
      type: "ADD_REWARD",
      reward: {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        coinCost,
        maxPurchases,
        purchaseCount: 0,
        icon,
      },
    });
    setTitle("");
    setDescription("");
    setCoinCost(30);
    setMaxPurchases(5);
    setIcon("🎮");
    setOpen(false);
  }

  return (
    <>
      <Button size="sm" variant="outline" className="gap-1" onClick={() => setOpen(true)}>
        <Plus size={14} /> Nova recompensa
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar recompensa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium mb-1 block">Nome</label>
            <input
              className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Ex: Sessão de jogo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Descrição (opcional)</label>
            <input
              className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Ex: 1 hora sem culpa"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Custo: 🪙 {coinCost} coins</label>
            <input
              type="range"
              min={5}
              max={200}
              step={5}
              value={coinCost}
              onChange={(e) => setCoinCost(Number(e.target.value))}
              className="w-full accent-yellow-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Máximo de resgates: {maxPurchases}x</label>
            <input
              type="range"
              min={1}
              max={20}
              value={maxPurchases}
              onChange={(e) => setMaxPurchases(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
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
          <Button type="submit" className="w-full">Criar recompensa</Button>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
