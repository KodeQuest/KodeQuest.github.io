"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lesson, Question } from "@/lib/data";
import { useProgress } from "@/lib/store";
import { clearSession, loadSession, saveSession } from "@/lib/session";
import { sfx } from "@/lib/sound";
import { CheckIcon, CloseIcon } from "./Icons";
import { CodeOrder, FillBlank, MultipleChoice } from "./questions";
import { LessonComplete } from "./LessonComplete";

type Answer = number | string[] | string;

function evaluate(q: Question, a: Answer): boolean {
  switch (q.type) {
    case "mc":
      return a === q.answer;
    case "order":
      return Array.isArray(a) && a.length === q.pieces.length && a.every((t, i) => t === q.pieces[i]);
    case "fill":
      return typeof a === "string" && q.answers.some((x) => x.toLowerCase() === a.trim().toLowerCase());
  }
}

function correctText(q: Question): string {
  switch (q.type) {
    case "mc":
      return q.options[q.answer];
    case "order":
      return q.pieces.join(" ");
    case "fill":
      return q.answers[0];
  }
}

export function LessonPlayer({ lesson, onExit }: { lesson: Lesson; onExit: () => void }) {
  const { completeLesson } = useProgress();
  const total = lesson.questions.length;

  const [hydrated, setHydrated] = useState(false);
  const [queue, setQueue] = useState<number[]>(() => lesson.questions.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [phase, setPhase] = useState<"answer" | "feedback">("answer");
  const [wasCorrect, setWasCorrect] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [attempt, setAttempt] = useState(0);
  const [summary, setSummary] = useState<{ xp: number; accuracy: number } | null>(null);

  // Pulihkan sesi yang tersimpan (misalnya setelah refresh).
  useEffect(() => {
    const s = loadSession();
    if (s && s.lessonId === lesson.id && s.queue.length > 0 && s.queue.every((i) => i < total) && s.idx < s.queue.length) {
      setQueue(s.queue);
      setIdx(s.idx);
      setStats(s.stats);
      setPhase(s.phase);
      setWasCorrect(s.wasCorrect);
      setAttempt(s.attempt);
      setSummary(s.summary);
    }
    setHydrated(true);
  }, [lesson.id, total]);

  // Simpan sesi setiap ada perubahan.
  useEffect(() => {
    if (!hydrated) return;
    saveSession({ v: 1, lessonId: lesson.id, queue, idx, stats, phase, wasCorrect, attempt, summary });
  }, [hydrated, lesson.id, queue, idx, stats, phase, wasCorrect, attempt, summary]);

  const q = lesson.questions[queue[idx]];
  const mastered = Math.min(stats.correct, total);
  const pct = Math.round((mastered / total) * 100);

  const check = useCallback(() => {
    if (phase !== "answer" || answer === null || !q) return;
    const ok = evaluate(q, answer);
    setWasCorrect(ok);
    setPhase("feedback");
    setStats((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
    if (ok) {
      sfx.correct();
    } else {
      sfx.wrong();
      setQueue((cur) => [...cur, queue[idx]]); // soal salah diulang di akhir
    }
  }, [phase, answer, q, queue, idx]);

  const next = useCallback(() => {
    if (phase !== "feedback") return;
    if (idx + 1 >= queue.length) {
      const accuracy = Math.round((stats.correct / Math.max(1, stats.total)) * 100);
      const xp = stats.correct * 10 + (accuracy === 100 ? 10 : 0);
      completeLesson(lesson.id, xp, accuracy);
      sfx.complete();
      setSummary({ xp, accuracy });
      return;
    }
    setIdx(idx + 1);
    setAnswer(null);
    setPhase("answer");
    setAttempt((a) => a + 1);
  }, [phase, idx, queue.length, stats, completeLesson, lesson.id]);

  // Enter untuk memeriksa / lanjut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if ((e.target as HTMLElement | null)?.tagName === "BUTTON") return;
      e.preventDefault();
      if (phase === "answer") check();
      else next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, check, next]);

  const leave = () => {
    clearSession();
    onExit();
  };

  const exit = () => {
    if (window.confirm("Keluar dari pelajaran? Progres pelajaran ini tidak akan disimpan.")) leave();
  };

  if (!hydrated) return <div className="min-h-dvh" />;

  if (summary) {
    return <LessonComplete title={lesson.title} xp={summary.xp} accuracy={summary.accuracy} onBack={leave} />;
  }

  const canCheck = answer !== null;

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 py-5">
        <button onClick={exit} aria-label="Keluar dari pelajaran" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <CloseIcon size={22} />
        </button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <main className="mx-auto w-full max-w-xl flex-1 px-5 pb-56 pt-4 md:max-w-2xl">
        <div key={`${idx}-${attempt}`} className="anim-fade-in">
          <p className="mb-1 text-xs font-extrabold uppercase tracking-wide text-indigo-400">
            {q.type === "mc" ? "Pilihan ganda" : q.type === "order" ? "Susun kode" : "Isi bagian rumpang"}
          </p>
          <h1 className="mb-6 text-2xl font-black leading-snug text-indigo-950">{q.prompt}</h1>

          {q.type === "mc" && <MultipleChoice q={q} locked={phase === "feedback"} onChange={setAnswer} />}
          {q.type === "order" && <CodeOrder q={q} locked={phase === "feedback"} onChange={setAnswer} />}
          {q.type === "fill" && <FillBlank q={q} locked={phase === "feedback"} onChange={setAnswer} />}
        </div>
      </main>

      <div
        className={`fixed inset-x-0 bottom-0 z-20 border-t-2 ${
          phase === "answer" ? "border-slate-200 bg-white" : wasCorrect ? "anim-slide-up border-teal-100 bg-teal-50" : "anim-slide-up border-rose-100 bg-rose-50"
        }`}
      >
        <div className="mx-auto w-full max-w-3xl px-5 py-5">
          {phase === "feedback" && (
            <div className="mb-4 flex items-start gap-3" role="status">
              <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white ${wasCorrect ? "text-teal-600" : "text-rose-500"}`}>
                {wasCorrect ? <CheckIcon size={24} /> : <CloseIcon size={22} />}
              </span>
              <div className="min-w-0">
                <p className={`text-lg font-black ${wasCorrect ? "text-teal-700" : "text-rose-600"}`}>{wasCorrect ? "Benar" : "Belum tepat"}</p>
                {!wasCorrect && <p className="break-words font-mono text-sm font-bold text-rose-700">Jawaban: {correctText(q)}</p>}
                <p className={`mt-1 text-sm font-semibold ${wasCorrect ? "text-teal-700" : "text-rose-700"}`}>{q.explain}</p>
              </div>
            </div>
          )}
          <button
            onClick={phase === "answer" ? check : next}
            disabled={phase === "answer" && !canCheck}
            className={`btn-3d w-full rounded-2xl px-6 py-4 text-base font-black uppercase tracking-wide sm:ml-auto sm:block sm:w-56 ${
              phase === "answer"
                ? canCheck
                  ? "bg-indigo-600 text-white shadow-[0_5px_0_#3730a3]"
                  : "bg-slate-200 text-slate-400 shadow-[0_5px_0_#cbd5e1]"
                : wasCorrect
                ? "bg-teal-500 text-white shadow-[0_5px_0_#0f766e]"
                : "bg-rose-500 text-white shadow-[0_5px_0_#be123c]"
            }`}
          >
            {phase === "answer" ? "Periksa" : "Lanjut"}
          </button>
        </div>
      </div>
    </div>
  );
}
