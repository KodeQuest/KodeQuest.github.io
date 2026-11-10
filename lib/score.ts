import { ALL_LESSONS, LANGUAGES } from "./data";
import { cleanName, sanitizeProgress, type LessonResult } from "./store";

/**
 * Papan skor dihitung dari file JSON progres (hasil Ekspor di Pengaturan).
 * - Nilai pelajaran  = akurasi terbaik (0–100) saat pelajaran diselesaikan.
 * - Nilai bahasa     = rata-rata nilai semua pelajarannya (yang belum selesai dihitung 0).
 * - Nilai rata-rata  = rata-rata nilai seluruh pelajaran.
 */

export const MAX_FILE_BYTES = 1024 * 1024;
export const MAX_FILES = 200;

export type Entry = {
  id: string;
  /** Nama file asal */
  file: string;
  name: string;
  xp: number;
  streak: number;
  completed: Record<string, LessonResult>;
  /** Tanda tangan isi, untuk mendeteksi file yang sama dimuat dua kali */
  sig: string;
};

export type SortKey = "xp" | "avg" | `lang:${string}` | `lesson:${string}`;

export type ParseResult = { ok: true; entry: Entry } | { ok: false; error: string };

let counter = 0;

/** Baca satu file progres KodeQuest. Isi dirapikan lewat sanitizeProgress, jadi aman dipakai. */
export function parseEntry(text: string, file: string): ParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "bukan JSON yang valid." };
  }
  const root = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  const raw = root?.app === "kodequest" ? root.data : parsed;
  const rawObj = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null;
  if (!rawObj || !("completed" in rawObj || "xp" in rawObj)) return { ok: false, error: "bukan file progres KodeQuest." };

  const p = sanitizeProgress(raw);
  if (!p) return { ok: false, error: "format tidak dikenali." };

  const profile = root?.profile && typeof root.profile === "object" ? (root.profile as Record<string, unknown>) : null;
  const name = cleanName(profile?.name) || p.name || cleanName(file.replace(/\.json$/i, "")) || "Tanpa nama";

  return {
    ok: true,
    entry: { id: `e${++counter}`, file, name, xp: p.xp, streak: p.streak, completed: p.completed, sig: JSON.stringify([name, p.xp, p.completed]) },
  };
}

export function lessonScore(e: Entry, lessonId: string): number | null {
  return e.completed[lessonId]?.accuracy ?? null;
}

/** Nilai satu bahasa, jumlah pelajaran selesai, dan total pelajaran. `score` null bila belum ada yang selesai. */
export function languageScore(e: Entry, langId: string): { score: number | null; done: number; total: number } {
  const lang = LANGUAGES.find((l) => l.id === langId);
  if (!lang) return { score: null, done: 0, total: 0 };
  let sum = 0;
  let done = 0;
  for (const l of lang.lessons) {
    const r = e.completed[l.id];
    if (r) {
      sum += r.accuracy;
      done++;
    }
  }
  return { score: done === 0 ? null : Math.round(sum / lang.lessons.length), done, total: lang.lessons.length };
}

export function averageScore(e: Entry): number | null {
  const done = ALL_LESSONS.filter((l) => e.completed[l.id]);
  if (done.length === 0) return null;
  return Math.round(done.reduce((s, l) => s + e.completed[l.id].accuracy, 0) / ALL_LESSONS.length);
}

/** Nilai peserta untuk kunci urutan yang dipilih; null = belum mengerjakan. */
export function metricOf(e: Entry, key: SortKey): number | null {
  if (key === "xp") return e.xp;
  if (key === "avg") return averageScore(e);
  if (key.startsWith("lang:")) return languageScore(e, key.slice(5)).score;
  if (key.startsWith("lesson:")) return lessonScore(e, key.slice(7));
  return null;
}

export type Ranked = { entry: Entry; value: number | null; rank: number };

/** Urutkan dari nilai tertinggi. Seri diurutkan XP lalu nama; peringkat sama untuk nilai dan XP yang sama. */
export function rankEntries(entries: Entry[], key: SortKey, hideEmpty: boolean): Ranked[] {
  const rows = entries
    .map((entry) => ({ entry, value: metricOf(entry, key) }))
    .filter((r) => !hideEmpty || r.value !== null)
    .sort((a, b) => (b.value ?? -1) - (a.value ?? -1) || b.entry.xp - a.entry.xp || a.entry.name.localeCompare(b.entry.name, "id"));
  const out: Ranked[] = [];
  rows.forEach((r, i) => {
    const prev = out[i - 1];
    const tie = prev && prev.value === r.value && prev.entry.xp === r.entry.xp;
    out.push({ ...r, rank: tie ? prev.rank : i + 1 });
  });
  return out;
}
