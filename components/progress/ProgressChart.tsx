"use client";

import { useGame } from "@/context/GameContext";
import { formatDateKey } from "@/lib/dateUtils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Dot,
} from "recharts";

export function ProgressChart() {
  const { state, todayKey } = useGame();
  const data = state.xpHistory.map((entry) => ({
    date: formatDateKey(entry.dateKey),
    xp: entry.xp,
    isToday: entry.dateKey === todayKey,
  }));

  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm space-y-2">
        <p className="text-3xl">📈</p>
        <p>Nenhum dado ainda.</p>
        <p className="text-xs">Complete hábitos para ver seu progresso aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Progresso de XP (21 dias)</h2>
      <div className="rounded-xl border border-white/10 bg-card p-4">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#a78bfa" }}
              formatter={(v) => [`${v} XP`, "Total XP"]}
            />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle
                    key={`dot-${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r={payload.isToday ? 5 : 3}
                    fill={payload.isToday ? "#a78bfa" : "#7c3aed"}
                    stroke={payload.isToday ? "#fff" : "none"}
                    strokeWidth={payload.isToday ? 2 : 0}
                  />
                );
              }}
              activeDot={{ r: 6, fill: "#a78bfa" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
