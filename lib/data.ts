import html from "@/data/languages/html.json";
import css from "@/data/languages/css.json";
import js from "@/data/languages/js.json";
import python from "@/data/languages/python.json";
import java from "@/data/languages/java.json";
import cpp from "@/data/languages/cpp.json";
import { normalizeTyped } from "./live";
import react from "@/data/languages/react.json";
import php from "@/data/languages/php.json";
import mysql from "@/data/languages/mysql.json";

/** Semua soal disimpan sebagai JSON di data/languages/<bahasa>.json */

export type MCQuestion = {
  /** ID unik soal, mis. "html-1-q3" */
  id: string;
  type: "mc";
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export type OrderQuestion = {
  id: string;
  type: "order";
  prompt: string;
  /** Potongan kode dalam urutan yang benar */
  pieces: string[];
  /** Potongan pengecoh (tidak dipakai) */
  decoys?: string[];
  explain: string;
};

export type FillQuestion = {
  id: string;
  type: "fill";
  prompt: string;
  /** Kode dengan satu bagian rumpang bertanda ___ */
  code: string;
  /** Jawaban yang diterima (tanpa membedakan huruf besar/kecil) */
  answers: string[];
  /** Pilihan kata (jawaban + pengecoh) */
  options: string[];
  explain: string;
};

/** Cara menampilkan hasil kode yang diketik pemain secara langsung (realtime). */
export type LiveSpec =
  /** Render HTML yang diketik di iframe ber-sandbox */
  | { kind: "html" }
  /** Terapkan CSS yang diketik ke markup contoh `html` (opsional `base` = CSS tambahan) */
  | { kind: "css"; html: string; base?: string }
  /** Jalankan JavaScript di iframe ber-sandbox; `before`/`after` dikirim sebelum/sesudah kode pemain */
  | { kind: "js"; before?: string; after?: string }
  /** Cocokkan teks yang sudah dinormalkan dengan regex; `output` boleh memakai $1, $2, … */
  | { kind: "match"; rules: { pattern: string; output: string }[] };

/** Soal ketik manual: pemain mengetik jawaban sendiri tanpa pilihan. */
export type TypeQuestion = {
  id: string;
  type: "type";
  prompt: string;
  /** Pratinjau hasil yang diharapkan (tampilan atau keluaran dari kode jawaban) */
  preview: string;
  /** Petunjuk yang bisa dibuka pemain sebelum menjawab */
  clue: string;
  /** Pratinjau langsung dari ketikan pemain */
  live?: LiveSpec;
  /** Abaikan huruf besar/kecil saat menilai (mis. SQL). Default: dibedakan */
  ignoreCase?: boolean;
  /** Jawaban yang diterima. Spasi di sekitar tanda baca diabaikan; huruf besar/kecil dibedakan */
  answers: string[];
  explain: string;
};

export type Question = MCQuestion | OrderQuestion | FillQuestion | TypeQuestion;

export type Lesson = {
  id: string;
  title: string;
  questions: Question[];
};

export type LanguageColor = "emerald" | "indigo" | "amber" | "sky" | "rose" | "violet" | "cyan" | "fuchsia" | "orange";

export type Language = {
  id: string;
  /** Nama bahasa yang tampil di kartu dan banner */
  title: string;
  subtitle: string;
  /** Singkatan pendek untuk lencana kartu (mis. "Py") */
  badge: string;
  color: LanguageColor;
  lessons: Lesson[];
};

/** Urutan di sini = urutan tampil di aplikasi. Bahasa baru: tambah file JSON lalu daftarkan di sini. */
export const LANGUAGES: Language[] = [html, css, js, react, php, mysql, python, java, cpp] as unknown as Language[];

export const ALL_LESSONS: Lesson[] = LANGUAGES.flatMap((l) => l.lessons);

export function getLanguage(id: string): Language | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

/** Bahasa pemilik sebuah pelajaran. */
export function languageOfLesson(lessonId: string): Language | undefined {
  return LANGUAGES.find((l) => l.lessons.some((x) => x.id === lessonId));
}

/** Pelajaran terbuka bila pertama di bahasanya, atau pelajaran sebelumnya (di bahasa yang sama) sudah selesai. */
export function isLessonUnlocked(lessonId: string, completed: Record<string, unknown>): boolean {
  const lang = languageOfLesson(lessonId);
  if (!lang) return false;
  const i = lang.lessons.findIndex((x) => x.id === lessonId);
  return i === 0 || !!completed[lang.lessons[i - 1].id];
}

export const ALL_QUESTIONS: Question[] = ALL_LESSONS.flatMap((l) => l.questions);

export function getLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

/** Cari soal lewat ID uniknya, mis. getQuestion("html-1-q3"). */
export function getQuestion(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

/** Ambil soal sesuai jenis, opsional dibatasi satu bahasa. */
export function getQuestionsByType<T extends Question["type"]>(type: T, languageId?: string): Extract<Question, { type: T }>[] {
  const pool = languageId ? getLanguage(languageId)?.lessons.flatMap((l) => l.questions) ?? [] : ALL_QUESTIONS;
  return pool.filter((q): q is Extract<Question, { type: T }> => q.type === type);
}


export function isTypedAnswerCorrect(q: TypeQuestion, typed: string): boolean {
  const fold = (x: string) => (q.ignoreCase ? normalizeTyped(x).toLowerCase() : normalizeTyped(x));
  const t = fold(typed);
  return t !== "" && q.answers.some((a) => fold(a) === t);
}
