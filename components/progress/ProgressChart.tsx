"use client";

import { useGame } from "@/context/GameContext";
import { Icon } from "@/components/ui/Icon";
import { glowShadow } from "@/lib/mpaStyles";
import { getXPProgress } from "@/lib/levelSystem";

function fmt(n: number) {
  return n.toLocaleString("pt-BR");
}

/** Pure-SVG XP line chart — no Recharts dependency */
function XPChart({ series, h = 150 }: { series: number[]; h?: number }) {
  const w = 320;
  const pad = { t: 14, r: 6, b: 6, l: 6 };
  const maxVal = Math.max(...series, 1) * 1.12;
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const pts = series.map((v, i) => [
    pad.l + (i / (series.length - 1)) * iw,
    pad.t + ih - (v / maxVal) * ih,
  ]);
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `${pad.l},${pad.t + ih} ${line} ${pad.l + iw},${pad.t + ih}`;
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      preserveAspectRatio="none"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="xpArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
        <filter id="xpGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={pad.l}
          x2={pad.l + iw}
          y1={pad.t + ih * g}
          y2={pad.t + ih * g}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      {/* Area fill */}
      <polyline points={area} fill="url(#xpArea)" stroke="none" />
      {/* Line */}
      <polyline
        points={line}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#xpGlow)"
        vectorEffect="non-scaling-stroke"
      />
      {/* Today dot */}
      <circle
        cx={last[0]}
        cy={last[1]}
        r="4.5"
        fill="#fff"
        stroke="#a78bfa"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function ProgressChart() {
  const { state, todayKey } = useGame();
  const { level } = getXPProgress(state.player.totalXP);

  // Build 21-day series from xpHistory
  const series: number[] = Array.from({ length: 21 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (20 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return state.xpHistory.find((e) => e.dateKey === key)?.xp ?? 0;
  });

  const totalWeek = series.slice(-7).reduce((a, b) => a + b, 0);
  const hasData = series.some((v) => v > 0);

  if (!hasData) {
    return (
      <div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 23,
            color: "var(--text)",
            margin: "0 0 16px",
          }}
        >
          Progresso
        </h1>
        <div
          style={{
            textAlign: "center",
            padding: "40px 0",
            color: "var(--text-mute)",
            fontSize: 14,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>📈</div>
          Complete hábitos para ver seu progresso aqui.
        </div>
      </div>
    );
  }

  const stats = [
    { icon: "crown", v: String(level), l: "Nível atual",   c: "var(--accent-glow)" },
    { icon: "star",  v: fmt(state.player.totalXP), l: "XP total", c: "var(--gold)"       },
    { icon: "flame", v: String(state.streak.longestStreak), l: "Melhor streak", c: "var(--orange)" },
  ];

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 23,
          color: "var(--text)",
          margin: "0 0 16px",
        }}
      >
        Progresso
      </h1>

      {/* Chart card */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: 18,
          border: "1px solid var(--line)",
          boxShadow: glowShadow(0.22, 26),
          padding: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 12.5,
              color: "var(--text-dim)",
              fontWeight: 600,
            }}
          >
            XP nos últimos 21 dias
          </span>
          {totalWeek > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 9px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                color: "var(--green)",
                background: "color-mix(in oklab, var(--green) 16%, transparent)",
                fontFamily: "var(--font-display)",
              }}
            >
              <Icon name="trending" size={13} strokeWidth={2.4} />
              +{fmt(totalWeek)} na semana
            </span>
          )}
        </div>
        <XPChart series={series} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
            fontSize: 10,
            color: "var(--text-mute)",
            fontFamily: "var(--font-display)",
          }}
        >
          <span>há 21 dias</span>
          <span>hoje</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        {stats.map((s) => (
          <div
            key={s.l}
            style={{
              flex: 1,
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 15,
              padding: "15px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: s.c,
                display: "flex",
                justifyContent: "center",
                marginBottom: 7,
              }}
            >
              <Icon name={s.icon} size={20} strokeWidth={2.2} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 19,
                color: "var(--text)",
              }}
            >
              {s.v}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--text-mute)", marginTop: 2 }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
