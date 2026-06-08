"use client";

interface XPBarProps {
  percent: number;
  current: number;
  needed: number;
}

export function XPBar({ percent, current, needed }: XPBarProps) {
  return (
    <div className="space-y-1">
      <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">
        {current} / {needed} XP para o próximo nível
      </p>
    </div>
  );
}
