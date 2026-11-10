"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ALL_LESSONS } from "./data";
import { clearSession } from "./session";
import { setSoundEnabled } from "./sound";

const STORAGE_KEY = "kodequest:v1";
/** Tanda tangan progres pada saat terakhir diunduh/dipulihkan dari file JSON */
const BACKUP_KEY = "kodequest:backup:v1";

const signature = (p: Progress) => JSON.stringify({ name: p.name, xp: p.xp, streak: p.streak, lastActive: p.lastActive, completed: p.completed });

/** Panjang maksimum nama profil. */
export const MAX_NAME = 30;

/** Rapikan nama profil: buang karakter kontrol, ratakan spasi, batasi panjang. */
export function cleanName(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\x00-\x1f\x7f]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_NAME);
}

export type LessonResult = { stars: number; accuracy: number };

export type Progress = {
  xp: number;
  streak: number;
  /** Tanggal aktif terakhir, format YYYY-MM-DD (waktu lokal) */
  lastActive: string | null;
  completed: Record<string, LessonResult>;
  sound: boolean;
  /** Nama profil; ikut tersimpan di file JSON dan tampil di papan skor */
  name: string;
  /** Tampilkan pop up pengingat unduh progres (.json) saat hendak menutup tab */
  saveAlert: boolean;
};

const initial = (): Progress => ({
  xp: 0,
  streak: 0,
  lastActive: null,
  completed: {},
  sound: true,
  name: "",
  saveAlert: true,
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

/** Rapikan data dari storage / impor agar aman dipakai. */
export function sanitizeProgress(raw: unknown): Progress | null {
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
    streak: num(r.streak, 0),
    lastActive: typeof r.lastActive === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.lastActive) ? r.lastActive : null,
    completed,
    sound: typeof r.sound === "boolean" ? r.sound : true,
    name: cleanName(r.name),
    saveAlert: typeof r.saveAlert === "boolean" ? r.saveAlert : true,
  };
}

type Ctx = {
  ready: boolean;
  progress: Progress;
  /** Streak yang ditampilkan (0 bila sudah putus) */
  streakShown: number;
  completeLesson: (id: string, xpGained: number, accuracy: number) => void;
  toggleSound: () => void;
  /** Nyalakan/matikan pop up pengingat simpan JSON */
  toggleSaveAlert: () => void;
  /** Ganti / isi nama profil */
  setName: (name: string) => void;
  exportJson: () => string;
  /** Unduh progres sebagai file .json dan tandai sudah dicadangkan */
  backup: () => void;
  /** Ada progres yang belum dicadangkan ke file JSON */
  unsaved: boolean;
  importJson: (text: string) => { ok: boolean; message: string };
  reset: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Progress>(initial);
  const [backedSig, setBackedSig] = useState<string | null>(null);

  // Muat dari localStorage setelah mount (menghindari mismatch hidrasi).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = sanitizeProgress(JSON.parse(saved));
        if (p) setProgress(p);
      }
      setBackedSig(localStorage.getItem(BACKUP_KEY));
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

  const toggleSound = useCallback(() => setProgress((p) => ({ ...p, sound: !p.sound })), []);

  const toggleSaveAlert = useCallback(() => setProgress((p) => ({ ...p, saveAlert: !p.saveAlert })), []);

  const setName = useCallback((name: string) => setProgress((p) => ({ ...p, name: cleanName(name) })), []);

  const exportJson = useCallback(
    () =>
      JSON.stringify(
        { app: "kodequest", version: 1, exportedAt: new Date().toISOString(), profile: { name: progress.name }, data: progress },
        null,
        2
      ),
    [progress]
  );

  const markBackedUp = useCallback((p: Progress) => {
    const sig = signature(p);
    setBackedSig(sig);
    try {
      localStorage.setItem(BACKUP_KEY, sig);
    } catch {
      /* diblokir */
    }
  }, []);

  const backup = useCallback(() => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = progress.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    a.download = `kodequest-${slug || "progres"}-${dayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    markBackedUp(progress);
  }, [exportJson, markBackedUp, progress]);

  const importJson = useCallback((text: string) => {
    try {
      const parsed = JSON.parse(text);
      const p = sanitizeProgress(parsed?.app === "kodequest" ? parsed.data : parsed);
      if (!p) return { ok: false, message: "Format file tidak dikenali." };
      clearSession();
      setProgress(p);
      markBackedUp(p);
      return { ok: true, message: "Progres berhasil dipulihkan." };
    } catch {
      return { ok: false, message: "File bukan JSON yang valid." };
    }
  }, [markBackedUp]);

  const reset = useCallback(() => {
    clearSession();
    setProgress(initial());
  }, []);

  const streakShown = useMemo(() => {
    if (!progress.lastActive) return 0;
    const gap = daysBetween(progress.lastActive, dayKey());
    return gap <= 1 ? progress.streak : 0;
  }, [progress.lastActive, progress.streak]);

  const unsaved = ready && (progress.xp > 0 || Object.keys(progress.completed).length > 0) && signature(progress) !== backedSig;

  const value = useMemo<Ctx>(
    () => ({ ready, progress, streakShown, completeLesson, toggleSound, toggleSaveAlert, setName, exportJson, backup, unsaved, importJson, reset }),
    [ready, progress, streakShown, completeLesson, toggleSound, toggleSaveAlert, setName, exportJson, backup, unsaved, importJson, reset]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useProgress() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useProgress harus dipakai di dalam ProgressProvider");
  return c;
}
