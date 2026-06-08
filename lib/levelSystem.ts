export function xpForLevel(level: number): number {
  return 100 * level * level;
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

export function getXPProgress(totalXP: number): { level: number; current: number; needed: number; percent: number } {
  const level = getLevelFromXP(totalXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  const current = totalXP - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  const percent = Math.min(100, Math.round((current / needed) * 100));
  return { level, current, needed, percent };
}
