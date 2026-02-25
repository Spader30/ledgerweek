export type Session = { email: string; name: string };
const KEY = "ledgerweek_session";
export function setSession(session: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(session));
  document.cookie = "ledgerweek=1; path=/; samesite=lax";
}
export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  document.cookie = "ledgerweek=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax";
}
export function getSessionClient(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Session; } catch { return null; }
}
