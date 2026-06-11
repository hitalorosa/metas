"use client";

import { useGame } from "@/context/GameContext";
import { Habit } from "@/types";
import { Icon } from "@/components/ui/Icon";
import { glowShadow } from "@/lib/mpaStyles";

interface HabitItemProps {
  habit: Habit;
  done: boolean;
}

// Map common emoji to icon names for the 42px icon box
const EMOJI_TO_ICON: Record<string, string> = {
  "⏰": "clock",
  "🏋️": "dumbbell",
  "🥗": "activity",
  "🎓": "book",
  "🇺🇸": "wind",
  "📚": "book",
  "🧴": "droplet",
  "🧹": "sparkles",
  "🚀": "zap",
  "😴": "moon",
  "📱": "smartphone",
  "❌": "x",
  "🌙": "moon",
  "💸": "coins",
  "📉": "trending",
};

export function HabitItem({ habit, done }: HabitItemProps) {
  const { dispatch, todayKey } = useGame();
  const positive = habit.type === "positive";
  const xpColor = positive ? "var(--green)" : "var(--red)";
  const sign = positive ? "+" : "−";

  // Determine icon: if it maps to an SVG icon name, use Icon; else show emoji
  const iconName = EMOJI_TO_ICON[habit.icon];

  return (
    <div
      onClick={() => dispatch({ type: "TOGGLE_HABIT", habitId: habit.id, dateKey: todayKey })}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: "13px 14px",
        cursor: "pointer",
        borderRadius: 16,
        border: `1px solid ${done ? "color-mix(in oklab, var(--accent) 55%, transparent)" : "var(--line)"}`,
        background: done
          ? "color-mix(in oklab, var(--accent) 12%, var(--surface))"
          : "var(--surface)",
        boxShadow: done ? glowShadow(0.22, 26) : "0 1px 0 rgba(255,255,255,0.03) inset",
        transition: "all 0.22s",
      }}
    >
      {/* Icon box 42×42 */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: done
            ? "linear-gradient(180deg, var(--accent-glow), var(--accent))"
            : "var(--surface-2)",
          color: done ? "#fff" : xpColor,
          border: done ? "none" : "1px solid var(--line)",
          boxShadow: done ? glowShadow(0.5, 14) : "none",
          transition: "all 0.25s",
        }}
      >
        {done ? (
          <Icon name="check" size={20} strokeWidth={2.3} />
        ) : iconName ? (
          <Icon name={iconName} size={20} strokeWidth={2.3} />
        ) : (
          <span style={{ fontSize: 20, lineHeight: 1 }}>{habit.icon}</span>
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14.5,
            color: done ? "var(--text-mute)" : "var(--text)",
            textDecoration: done ? "line-through" : "none",
            transition: "color 0.2s",
          }}
        >
          {habit.name}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--text-mute)", marginTop: 2 }}>
          {positive ? "Hábito positivo" : "Evitar hoje"}
        </div>
      </div>

      {/* XP badge */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          padding: "5px 10px",
          borderRadius: 999,
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 12.5,
          whiteSpace: "nowrap",
          color: done ? xpColor : "var(--text-dim)",
          background: done
            ? `color-mix(in oklab, ${xpColor} 18%, transparent)`
            : "rgba(255,255,255,0.05)",
          transition: "all 0.2s",
        }}
      >
        {sign}{habit.xpValue} XP
      </span>
    </div>
  );
}
