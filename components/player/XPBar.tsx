"use client";

import React from "react";
import { glowShadow } from "@/lib/mpaStyles";

interface XPBarProps {
  percent: number;
  current?: number;
  needed?: number;
  height?: number;
  showShine?: boolean;
}

export function XPBar({ percent, current, needed, height = 10, showShine = false }: XPBarProps) {
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <div>
      <div
        style={{
          position: "relative",
          height,
          borderRadius: height,
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pct}%`,
            borderRadius: height,
            background: "linear-gradient(90deg, var(--accent), var(--accent-glow))",
            boxShadow: glowShadow(0.55, 14),
            transition: "width 0.7s cubic-bezier(.2,.8,.2,1)",
            overflow: "hidden",
          }}
        >
          {showShine && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",
                animation: "mpaShine 2.2s linear infinite",
              }}
            />
          )}
        </div>
      </div>
      {current !== undefined && needed !== undefined && (
        <div
          style={{
            marginTop: 5,
            fontSize: 11,
            color: "var(--text-mute)",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
          }}
        >
          <span>
            {current} / {needed} XP
          </span>
          <span>faltam {needed - current} p/ próx. nível</span>
        </div>
      )}
    </div>
  );
}
