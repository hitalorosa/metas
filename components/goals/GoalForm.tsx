"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { SystemAction } from "@/types";

export function GoalForm() {
  const { dispatch } = useGame();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [actions, setActions] = useState<SystemAction[]>([
    { id: crypto.randomUUID(), label: "", frequency: "daily" },
  ]);

  function addAction() {
    setActions([...actions, { id: crypto.randomUUID(), label: "", frequency: "daily" }]);
  }

  function updateAction(id: string, field: keyof SystemAction, value: string) {
    setActions(actions.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  }

  function removeAction(id: string) {
    setActions(actions.filter((a) => a.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch({
      type: "ADD_GOAL",
      goal: {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        targetDate,
        progressPercent: 0,
        system: actions.filter((a) => a.label.trim()),
        createdAt: new Date().toISOString(),
        archived: false,
      },
    });
    setTitle("");
    setDescription("");
    setTargetDate("");
    setActions([{ id: crypto.randomUUID(), label: "", frequency: "daily" }]);
    setOpen(false);
  }

  return (
    <>
      <Button size="sm" variant="outline" className="gap-1" onClick={() => setOpen(true)}>
        <Plus size={14} /> Nova meta
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Meta + Sistema</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium mb-1 block">Meta</label>
            <input
              className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="Ex: Publicar um livro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Descrição (opcional)</label>
            <textarea
              className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
              placeholder="Contexto ou motivação..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Data alvo (opcional)</label>
            <input
              type="date"
              className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Sistema — ações repetidas</label>
              <button type="button" onClick={addAction} className="text-xs text-violet-400 hover:text-violet-300">
                + Adicionar ação
              </button>
            </div>
            <div className="space-y-2">
              {actions.map((action) => (
                <div key={action.id} className="flex gap-2 items-center">
                  <input
                    className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                    placeholder="Ex: Escrever 300 palavras"
                    value={action.label}
                    onChange={(e) => updateAction(action.id, "label", e.target.value)}
                  />
                  <select
                    className="rounded-lg bg-white/10 px-2 py-2 text-xs focus:outline-none"
                    value={action.frequency}
                    onChange={(e) => updateAction(action.id, "frequency", e.target.value)}
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="as-needed">Quando precisar</option>
                  </select>
                  {actions.length > 1 && (
                    <button type="button" onClick={() => removeAction(action.id)} className="text-muted-foreground hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">Criar meta</Button>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
