// Pengganti minimal modul Node "util" untuk bundel browser (dipakai pustaka printf milik JSCPP).
export function inspect(v) {
  if (typeof v === "string") return v;
  try { return JSON.stringify(v); } catch { return String(v); }
}
export default { inspect };
