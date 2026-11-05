"use client";

import { useEffect, useState } from "react";
import { UNITS } from "@/lib/data";
import { HEART_REGEN_MS, MAX_LIVES, REFILL_COST, useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { CheckIcon, LockIcon, StarIcon, UnitIcon } from "./Icons";

const OFFSETS = [0, 38, 58, 38, 0, -38, -58, -38];

const UNIT_STYLES = {
  emerald: { banner: "bg-teal-500 shadow-[0_5px_0_#0f766e]", node: "bg-teal-500 shadow-[0_6px_0_#0f766e]", text: "text-teal-600" },
  indigo: { banner: "bg-indigo-500 shadow-[0_5px_0_#3730a3]", node: "bg-indigo-500 shadow-[0_6px_0_#3730a3]", text: "text-indigo-600" },
  amber: { banner: "bg-amber-500 shadow-[0_5px_0_#b45309]", node: "bg-amber-500 shadow-[0_6px_0_#b45309]", text: "text-amber-600" },
} as const;

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${count} dari 3 bintang`}>
      {[0, 1, 2].map((i) => (
        <StarIcon key={i} size={size} className={i < count ? "text-amber-400" : "text-slate-200"} />
      ))}
    </span>
  );
}

export function LearningPath({ onStart }: { onStart: (id: string) => void }) {
  const { progress, ready, refillLives } = useProgress();
  const [sheetId, setSheetId] = useState<string | null>(null);

  useEffect(() => {
    if (!sheetId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetId]);

  const flat = UNITS.flatMap((u) => u.lessons.map((l) => l.id));
  const firstOpen = flat.find((id) => !progress.completed[id]) ?? null;
  const unlocked = (id: string) => {
    const i = flat.indexOf(id);
    return i === 0 || !!progress.completed[flat[i - 1]];
  };

  const regenMin = Math.max(1, Math.ceil((progress.livesAt + HEART_REGEN_MS - Date.now()) / 60000));
  const outOfLives = progress.lives <= 0;

  const sheetLesson = sheetId ? UNITS.flatMap((u) => u.lessons.map((l) => ({ l, unit: u }))).find((x) => x.l.id === sheetId) : null;

  let counter = 0;

  return (
    <div className={`transition-opacity ${ready ? "opacity-100" : "opacity-0"}`}>
      {UNITS.map((unit) => {
        const st = UNIT_STYLES[unit.color];
        return (
          <section key={unit.id} className="mb-12">
            <div className={`flex items-center justify-between rounded-2xl px-5 py-4 text-white ${st.banner}`}>
              <div>
                <h2 className="text-lg font-black leading-tight">{unit.title}</h2>
                <p className="text-sm font-semibold text-white/85">{unit.subtitle}</p>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/20">
                <UnitIcon unit={unit.color} size={24} />
              </div>
            </div>

            <ol className="mt-10 flex flex-col items-center gap-6">
              {unit.lessons.map((lesson) => {
                const x = OFFSETS[counter++ % OFFSETS.length];
                const done = progress.completed[lesson.id];
                const isActive = lesson.id === firstOpen;
                const isOpen = unlocked(lesson.id);

                const nodeColor = done
                  ? "bg-amber-400 shadow-[0_6px_0_#b45309]"
                  : isOpen
                  ? st.node
                  : "bg-slate-200 shadow-[0_6px_0_#cbd5e1]";

                return (
                  <li key={lesson.id} className="relative flex flex-col items-center" style={{ transform: `translateX(${x}px)` }}>
                    {isActive && (
                      <div className="anim-bob absolute -top-9 z-10">
                        <div className={`relative rounded-xl border-2 border-slate-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-wide ${st.text}`}>
                          Mulai
                          <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-slate-200 bg-white" />
                        </div>
                      </div>
                    )}

                    <button
                      disabled={!isOpen}
                      onClick={() => {
                        sfx.click();
                        setSheetId(lesson.id);
                      }}
                      aria-label={`${lesson.title}${done ? ", selesai" : isOpen ? "" : ", terkunci"}`}
                      className={`btn-3d grid h-[72px] w-[72px] place-items-center rounded-full text-white ${nodeColor}`}
                    >
                      {done ? <CheckIcon size={34} /> : isOpen ? <UnitIcon unit={unit.color} size={30} /> : <LockIcon size={28} className="text-slate-400" />}
                    </button>

                    {done && (
                      <div className="mt-3">
                        <Stars count={done.stars} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      {sheetLesson && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 sm:items-center sm:p-4"
          onClick={() => setSheetId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={sheetLesson.l.title}
        >
          <div
            className="anim-slide-up w-full max-w-md rounded-t-3xl bg-white p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className={`text-xs font-extrabold uppercase tracking-wide ${UNIT_STYLES[sheetLesson.unit.color].text}`}>{sheetLesson.unit.title}</p>
            <h3 className="mt-1 text-2xl font-black text-indigo-950">{sheetLesson.l.title}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {sheetLesson.l.questions.length} soal
              {progress.completed[sheetLesson.l.id] ? ` · akurasi terbaik ${progress.completed[sheetLesson.l.id].accuracy}%` : ""}
            </p>

            {outOfLives ? (
              <div className="mt-5">
                <p className="text-sm font-bold text-rose-600">Hati habis. Satu hati pulih sekitar {regenMin} menit lagi.</p>
                <button
                  onClick={() => {
                    sfx.click();
                    refillLives();
                  }}
                  disabled={progress.xp < REFILL_COST}
                  className="btn-3d mt-3 w-full rounded-2xl bg-rose-500 px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#be123c] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-[0_4px_0_#cbd5e1]"
                >
                  Isi ulang {MAX_LIVES} hati ({REFILL_COST} XP)
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  sfx.click();
                  const id = sheetLesson.l.id;
                  setSheetId(null);
                  onStart(id);
                }}
                autoFocus
                className="btn-3d mt-5 w-full rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#3730a3]"
              >
                {progress.completed[sheetLesson.l.id] ? "Latihan lagi" : "Mulai"}
              </button>
            )}
          </div>
        </div>
      )}

      <p className="pb-6 text-center text-sm font-semibold text-slate-400">Materi baru segera hadir</p>
    </div>
  );
}
