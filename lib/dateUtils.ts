export function getTodayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateKey(dateKey: string): string {
  const [, m, d] = dateKey.split("-");
  return `${d}/${m}`;
}

export function daysBetween(a: string, b: string): number {
  const dateA = new Date(a + "T12:00:00");
  const dateB = new Date(b + "T12:00:00");
  const diff = Math.abs(dateA.getTime() - dateB.getTime());
  return Math.round(diff / (1000 * 60 * 60 * 24));
}
