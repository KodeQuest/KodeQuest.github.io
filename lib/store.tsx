"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ALL_LESSONS } from "./data";
import { clearSession } from "./session";
import { setSoundEnabled } from "./sound";

export const MAX_LIVES = 5;
export const HEART_REGEN_MS = 15 * 60 * 1000;
export const REFILL_COST = 50;
const STORAGE_KEY = "kodequest:v1";

export type LessonResult = { stars: number; accuracy: number };

export type Progress = {
  xp: number;
  lives: number;
  /** Waktu (ms) acuan pemulihan hati berikutnya */
  livesAt: number;
  streak: number;
  /** Tanggal aktif terakhir, format YYYY-MM-DD (waktu lokal) */
  lastActive: string | null;
  completed: Record<string, LessonResult>;
  sound: boolean;
};

const initial = (): Progress => ({
  xp: 0,
  lives: MAX_LIVES,
  livesAt: Date.now(),
  streak: 0,
  lastActive: null,
  completed: {},
  sound: true,
});

export function dayKey(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function daysBetween(a: string, b: string) {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

/** Terapkan pemulihan hati berdasarkan waktu yang berlalu. */
function regen(p: Progress, now = Date.now()): Progress {
  if (p.lives >= MAX_LIVES) return p.livesAt === now ? p : { ...p, livesAt: now };
  const gained = Math.floor((now - p.livesAt) / HEART_REGEN_MS);
  if (gained <= 0) return p;
  const lives = Math.min(MAX_LIVES, p.lives + gained);
  return { ...p, lives, livesAt: lives >= MAX_LIVES ? now : p.livesAt + gained * HEART_REGEN_MS };
}

/** Rapikan data dari storage / impor agar aman dipakai. */
function sanitize(raw: unknown): Progress | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const base = initial();
  const num = (v: unknown, fb: number, min = 0, max = Number.MAX_SAFE_INTEGER) =>
    typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.floor(v))) : fb;
  const validIds = new Set(ALL_LESSONS.map((l) => l.id));
  const completed: Record<string, LessonResult> = {};
  if (r.completed && typeof r.completed === "object") {
    for (const [id, v] of Object.entries(r.completed as Record<string, unknown>)) {
      if (!validIds.has(id) || !v || typeof v !== "object") continue;
      const vv = v as Record<string, unknown>;
      completed[id] = { stars: num(vv.stars, 1, 0, 3), accuracy: num(vv.accuracy, 0, 0, 100) };
    }
  }
  return {
    xp: num(r.xp, base.xp),
    lives: num(r.lives, base.lives, 0, MAX_LIVES),
    livesAt: num(r.livesAt, base.livesAt),
    streak: num(r.streak, 0),
    lastActive: typeof r.lastActive === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.lastActive) ? r.lastActive : null,
    completed,
    sound: typeof r.sound === "boolean" ? r.sound : true,
  };
}

type Ctx = {
  ready: boolean;
  progress: Progress;
  /** Streak yang ditampilkan (0 bila sudah putus) */
  streakShown: number;
  loseLife: () => void;
  completeLesson: (id: string, xpGained: number, accuracy: number) => void;
  refillLives: () => void;
  toggleSound: () => void;
  exportJson: () => string;
  importJson: (text: string) => { ok: boolean; message: string };
  reset: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Progress>(initial);

  // Muat dari localStorage setelah mount (menghindari mismatch hidrasi).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = sanitize(JSON.parse(saved));
        if (p) setProgress(regen(p));
      }
    } catch {
      /* abaikan data rusak */
    }
    setReady(true);
  }, []);

  // Simpan otomatis.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* penyimpanan penuh / diblokir */
    }
    setSoundEnabled(progress.sound);
  }, [progress, ready]);

  // Pemulihan hati berkala.
  useEffect(() => {
    const t = setInterval(() => setProgress((p) => regen(p)), 20000);
    return () => clearInterval(t);
  }, []);

  const loseLife = useCallback(() => {
    setProgress((p) => {
      if (p.lives <= 0) return p;
      // Saat turun dari penuh, mulai hitung pemulihan dari sekarang.
      return { ...p, lives: p.lives - 1, livesAt: p.lives >= MAX_LIVES ? Date.now() : p.livesAt };
    });
  }, []);

  const completeLesson = useCallback((id: string, xpGained: number, accuracy: number) => {
    setProgress((p) => {
      const today = dayKey();
      let streak = p.streak;
      if (p.lastActive !== today) {
        streak = p.lastActive && daysBetween(p.lastActive, today) === 1 ? p.streak + 1 : 1;
      }
      const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
      const prev = p.completed[id];
      const best: LessonResult = prev
        ? { stars: Math.max(prev.stars, stars), accuracy: Math.max(prev.accuracy, accuracy) }
        : { stars, accuracy };
      return { ...p, xp: p.xp + xpGained, streak, lastActive: today, completed: { ...p.completed, [id]: best } };
    });
  }, []);

  const refillLives = useCallback(() => {
    setProgress((p) => {
      if (p.xp < REFILL_COST || p.lives >= MAX_LIVES) return p;
      return { ...p, xp: p.xp - REFILL_COST, lives: MAX_LIVES, livesAt: Date.now() };
    });
  }, []);

  const toggleSound = useCallback(() => setProgress((p) => ({ ...p, sound: !p.sound })), []);

  const exportJson = useCallback(
    () => JSON.stringify({ app: "kodequest", version: 1, exportedAt: new Date().toISOString(), data: progress }, null, 2),
    [progress]
  );

  const importJson = useCallback((text: string) => {
    try {
      const parsed = JSON.parse(text);
      const p = sanitize(parsed?.app === "kodequest" ? parsed.data : parsed);
      if (!p) return { ok: false, message: "Format file tidak dikenali." };
      clearSession();
      setProgress(regen(p));
      return { ok: true, message: "Progres berhasil dipulihkan." };
    } catch {
      return { ok: false, message: "File bukan JSON yang valid." };
    }
  }, []);

  const reset = useCallback(() => {
    clearSession();
    setProgress(initial());
  }, []);

  const streakShown = useMemo(() => {
    if (!progress.lastActive) return 0;
    const gap = daysBetween(progress.lastActive, dayKey());
    return gap <= 1 ? progress.streak : 0;
  }, [progress.lastActive, progress.streak]);

  const value = useMemo<Ctx>(
    () => ({ ready, progress, streakShown, loseLife, completeLesson, refillLives, toggleSound, exportJson, importJson, reset }),
    [ready, progress, streakShown, loseLife, completeLesson, refillLives, toggleSound, exportJson, importJson, reset]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useProgress() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useProgress harus dipakai di dalam ProgressProvider");
  return c;
}
