/** Shared MPA design-system helpers */

export const ACCENT_RGB = "124, 58, 237";
export const GOLD_RGB   = "245, 158, 11";
export const GREEN_RGB  = "34, 197, 94";
export const RED_RGB    = "239, 68, 68";
export const ORANGE_RGB = "249, 115, 22";
export const BLUE_RGB   = "59, 130, 246";

/** Returns a CSS box-shadow glow string using the accent color */
export function glowShadow(opacity = 0.5, blur = 22): string {
  return `0 0 ${blur}px rgba(${ACCENT_RGB}, ${opacity})`;
}

/** Glow shadow with a custom RGB string like "245, 158, 11" */
export function colorGlow(rgb: string, opacity = 0.5, blur = 22): string {
  return `0 0 ${blur}px rgba(${rgb}, ${opacity})`;
}

/** Inline-style surface card */
export const cardStyle = {
  background: "var(--surface)",
  borderRadius: 18,
  border: "1px solid var(--line)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset",
} as const;

/** Inline-style surface card with accent glow */
export function cardGlowStyle(active = false) {
  return {
    ...cardStyle,
    borderColor: active
      ? "color-mix(in oklab, var(--accent) 55%, transparent)"
      : "var(--line)",
    boxShadow: active
      ? glowShadow(0.22, 26)
      : "0 1px 0 rgba(255,255,255,0.03) inset",
  };
}
