"use client";

import { HeartCount } from "./Header";
import { BoltIcon, StarIcon, TrophyIcon } from "./Icons";

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
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-6">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="anim-pop text-amber-400">
          <TrophyIcon size={96} />
        </div>
        <h1 className="mt-5 text-3xl font-black text-indigo-950">Pelajaran selesai</h1>
        <p className="mt-1 font-semibold text-slate-500">{title}</p>

        <div className="mt-4 flex gap-1.5" aria-label={`${stars} dari 3 bintang`}>
          {[0, 1, 2].map((i) => (
            <StarIcon key={i} size={36} className={i < stars ? "text-amber-400" : "text-slate-200"} />
          ))}
        </div>

        <div className="mt-8 grid w-full grid-cols-3 gap-3">
          <div className="anim-fade-in overflow-hidden rounded-2xl border-2 border-amber-400 text-center">
            <p className="bg-amber-400 py-1 text-xs font-extrabold uppercase tracking-wide text-white">XP</p>
            <p className="flex items-center justify-center gap-1 py-3 text-xl font-black text-amber-500">
              <BoltIcon size={20} />
              {xp}
            </p>
          </div>
          <div className="anim-fade-in overflow-hidden rounded-2xl border-2 border-teal-500 text-center" style={{ animationDelay: "0.08s" }}>
            <p className="bg-teal-500 py-1 text-xs font-extrabold uppercase tracking-wide text-white">Akurasi</p>
            <p className="py-3 text-xl font-black text-teal-600">{accuracy}%</p>
          </div>
          <div className="anim-fade-in overflow-hidden rounded-2xl border-2 border-rose-500 text-center" style={{ animationDelay: "0.16s" }}>
            <p className="bg-rose-500 py-1 text-xs font-extrabold uppercase tracking-wide text-white">Hati</p>
            <p className="flex items-center justify-center py-3 text-xl">
              <HeartCount lives={lives} />
            </p>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-slate-100 py-5">
        <button
          onClick={onBack}
          autoFocus
          className="btn-3d w-full rounded-2xl bg-indigo-600 px-6 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_5px_0_#3730a3]"
        >
          Kembali ke peta
        </button>
      </div>
    </div>
  );
}
