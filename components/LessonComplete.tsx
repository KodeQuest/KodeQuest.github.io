"use client";

import { Hearts } from "./Header";

export function LessonComplete({
  title,
  xp,
  accuracy,
  lives,
  onBack,
}: {
  title: string;
  xp: number;
  accuracy: number;
  lives: number;
  onBack: () => void;
}) {
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="anim-pop text-7xl" aria-hidden>
        🎉
      </div>
      <h1 className="mt-4 text-3xl font-black text-indigo-950">Pelajaran selesai!</h1>
      <p className="mt-1 font-semibold text-slate-500">{title}</p>

      <div className="mt-4 text-4xl" aria-label={`${stars} bintang`}>
        {"⭐".repeat(stars)}
        <span className="opacity-20 grayscale">{"⭐".repeat(3 - stars)}</span>
      </div>

      <div className="mt-8 grid w-full grid-cols-3 gap-3">
        <div className="anim-fade-in rounded-2xl bg-amber-100 p-3" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-extrabold uppercase text-amber-600">XP</p>
          <p className="text-2xl font-black text-amber-700">+{xp}</p>
        </div>
        <div className="anim-fade-in rounded-2xl bg-teal-100 p-3" style={{ animationDelay: "0.2s" }}>
          <p className="text-xs font-extrabold uppercase text-teal-600">Akurasi</p>
          <p className="text-2xl font-black text-teal-700">{accuracy}%</p>
        </div>
        <div className="anim-fade-in rounded-2xl bg-rose-100 p-3" style={{ animationDelay: "0.3s" }}>
          <p className="text-xs font-extrabold uppercase text-rose-600">Hati</p>
          <p className="mt-1 text-sm">
            <Hearts lives={lives} />
          </p>
        </div>
      </div>

      <button
        onClick={onBack}
        autoFocus
        className="btn-3d mt-10 w-full rounded-2xl bg-indigo-600 px-6 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_5px_0_#3730a3]"
      >
        Kembali ke peta
      </button>
    </div>
  );
}
