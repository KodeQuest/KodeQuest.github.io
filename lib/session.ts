// Sesi pelajaran yang sedang berjalan, disimpan agar refresh tidak mengulang soal.
export type LessonSession = {
  v: 1;
  lessonId: string;
  /** Urutan soal sebagai indeks ke lesson.questions (soal salah ditambahkan di akhir) */
  queue: number[];
  idx: number;
  stats: { correct: number; total: number };
  phase: "answer" | "feedback";
  wasCorrect: boolean;
  attempt: number;
  summary: { xp: number; accuracy: number } | null;
};

const KEY = "kodequest:session:v1";

const isInt = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n >= 0;

export function loadSession(): LessonSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<LessonSession>;
    if (
      s?.v !== 1 ||
      typeof s.lessonId !== "string" ||
      !Array.isArray(s.queue) ||
      !s.queue.every(isInt) ||
      !isInt(s.idx) ||
      !s.stats ||
      !isInt(s.stats.correct) ||
      !isInt(s.stats.total) ||
      (s.phase !== "answer" && s.phase !== "feedback") ||
      typeof s.wasCorrect !== "boolean" ||
      !isInt(s.attempt)
    ) {
      return null;
    }
    const sum = s.summary;
    if (sum !== null && sum !== undefined && (!isInt(sum.xp) || !isInt(sum.accuracy))) return null;
    return { ...(s as LessonSession), summary: sum ?? null };
  } catch {
    return null;
  }
}

export function saveSession(s: LessonSession) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* penyimpanan penuh / diblokir */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* abaikan */
  }
}
