"use client";

import { useState } from "react";
import { UNITS } from "@/lib/data";
import { HEART_REGEN_MS, REFILL_COST, MAX_LIVES, useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";

const OFFSETS = [0, 44, 66, 44, 0, -44, -66, -44];

const UNIT_STYLES = {
  emerald: { banner: "from-emerald-500 to-teal-500", node: "bg-teal-500", shadow: "shadow-[0_6px_0_#0f766e]", ring: "#14b8a6" },
  indigo: { banner: "from-indigo-500 to-violet-500", node: "bg-indigo-500", shadow: "shadow-[0_6px_0_#3730a3]", ring: "#6366f1" },
  amber: { banner: "from-amber-500 to-orange-500", node: "bg-amber-500", shadow: "shadow-[0_6px_0_#b45309]", ring: "#f59e0b" },
} as const;

export function LearningPath({ onStart }: { onStart: (id: string) => void }) {
  const { progress, ready, refillLives } = useProgress();
  const [openId, setOpenId] = useState<string | null>(null);

  const flat = UNITS.flatMap((u) => u.lessons.map((l) => l.id));
  const firstOpen = flat.find((id) => !progress.completed[id]) ?? null;
  const unlocked = (id: string) => {
    const i = flat.indexOf(id);
    return i === 0 || !!progress.completed[flat[i - 1]];
  };

  const regenMin = Math.max(1, Math.ceil((progress.livesAt + HEART_REGEN_MS - Date.now()) / 60000));
  const outOfLives = progress.lives <= 0;

  let counter = 0;

  return (
    <div className={`transition-opacity ${ready ? "opacity-100" : "opacity-0"}`}>
      {UNITS.map((unit) => {
        const st = UNIT_STYLES[unit.color];
        return (
          <section key={unit.id} className="mb-10">
            <div className={`rounded-3xl bg-gradient-to-r ${st.banner} p-4 text-white shadow-lg`}>
              <h2 className="text-lg font-black">{unit.title}</h2>
              <p className="text-sm font-medium text-white/85">{unit.subtitle}</p>
            </div>

            <ol className="relative mt-6 flex flex-col items-center gap-6">
              {unit.lessons.map((lesson) => {
                const x = OFFSETS[counter++ % OFFSETS.length];
                const done = progress.completed[lesson.id];
                const isActive = lesson.id === firstOpen;
                const isOpen = unlocked(lesson.id);
                const isPop = openId === lesson.id;

                return (
                  <li key={lesson.id} className="relative flex flex-col items-center" style={{ transform: `translateX(${x}px)` }}>
                    <button
                      disabled={!isOpen}
                      onClick={() => {
                        sfx.click();
                        setOpenId(isPop ? null : lesson.id);
                      }}
                      aria-label={`${lesson.title}${done ? ", selesai" : isOpen ? "" : ", terkunci"}`}
                      className={`btn-3d relative grid h-20 w-20 place-items-center rounded-full text-3xl text-white ${
                        isOpen ? `${st.node} ${st.shadow}` : "bg-slate-300 shadow-[0_6px_0_#94a3b8]"
                      } ${isActive ? "anim-pulse-ring" : ""}`}
                    >
                      <span aria-hidden>{isOpen ? lesson.icon : "🔒"}</span>
                      {done && (
                        <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-white text-sm shadow ring-2 ring-emerald-400">
                          ✅
                        </span>
                      )}
                    </button>

                    <span className="mt-2 text-sm font-extrabold text-indigo-950">{lesson.title}</span>
                    {done && (
                      <span className="text-sm" aria-label={`${done.stars} bintang`}>
                        {"⭐".repeat(done.stars)}
                        <span className="opacity-25 grayscale">{"⭐".repeat(3 - done.stars)}</span>
                      </span>
                    )}

                    {isPop && isOpen && (
                      <div className="anim-pop absolute top-full z-10 mt-14 w-64 rounded-2xl border-2 border-indigo-100 bg-white p-4 text-center shadow-xl">
                        <p className="font-black text-indigo-950">{lesson.title}</p>
                        <p className="mb-3 text-xs font-semibold text-slate-500">
                          {lesson.questions.length} soal · {done ? `akurasi terbaik ${done.accuracy}%` : "pelajaran baru"}
                        </p>
                        {outOfLives ? (
                          <>
                            <p className="mb-2 text-sm font-bold text-rose-600">Hati habis. Pulih 1 hati sekitar {regenMin} menit lagi.</p>
                            <button
                              onClick={() => {
                                sfx.click();
                                refillLives();
                              }}
                              disabled={progress.xp < REFILL_COST}
                              className="btn-3d w-full rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_#be123c]"
                            >
                              Isi ulang {MAX_LIVES} hati ({REFILL_COST} XP)
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              sfx.click();
                              setOpenId(null);
                              onStart(lesson.id);
                            }}
                            className="btn-3d w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_4px_0_#3730a3]"
                          >
                            {done ? "Latihan lagi" : "Mulai"}
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <p className="text-center text-sm font-semibold text-slate-400">Materi baru akan segera hadir ✨</p>
    </div>
  );
}
