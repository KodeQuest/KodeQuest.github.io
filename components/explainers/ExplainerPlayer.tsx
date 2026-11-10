"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Language } from "@/lib/data";
import { LANGUAGE_STYLES } from "@/lib/theme";
import { sfx } from "@/lib/sound";

/** Satu adegan dalam video penjelasan. */
export type Scene = {
  title: string;
  caption: string;
  /** Baris kode yang diketik otomatis */
  code: string[];
  /** Tampilan hasil. `linesDone` = jumlah baris kode yang sudah selesai diketik. */
  render: (linesDone: number) => ReactNode;
  /** Lama adegan (ms). Default 7000. */
  duration?: number;
};

const DEFAULT_MS = 7000;
/** Bagian awal adegan yang dipakai untuk mengetik; sisanya jeda agar sempat dibaca. */
const TYPE_PORTION = 0.6;

const iconBtn =
  "btn-3d grid h-11 w-11 place-items-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 shadow-[0_3px_0_#e2e8f0] hover:bg-slate-50 disabled:opacity-40";

const PLAY = "M8 5v14l11-7z";
const PAUSE = "M6 5h4v14H6zM14 5h4v14h-4z";
const PREV = "M6 6h2v12H6zM9.5 12 18 18V6z";
const NEXT = "M16 6h2v12h-2zM6 18l8.5-6L6 6z";
const REPLAY = "M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z";

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Video penjelasan bergerak untuk satu bahasa (diputar di halaman /belajar/bahasa/<id>/). */
export function ExplainerPlayer({
  language,
  scenes,
  tint,
}: {
  language: Language;
  scenes: Scene[];
  tint?: (code: string) => ReactNode;
}) {
  const st = LANGUAGE_STYLES[language.color];
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);

  const last = scenes.length - 1;
  const scene = scenes[i];
  const D = scene.duration ?? DEFAULT_MS;
  const totalSecs = Math.round(scenes.reduce((s, x) => s + (x.duration ?? DEFAULT_MS), 0) / 1000);
  const maxLines = Math.max(...scenes.map((s) => s.code.length));

  // Pengatur waktu animasi
  useEffect(() => {
    if (!playing || reduced) return;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(100, now - prev);
      prev = now;
      setT((x) => x + dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced]);

  // Pindah ke adegan berikutnya, atau berhenti di akhir
  useEffect(() => {
    if (!playing || t < D) return;
    if (i < last) {
      setI(i + 1);
      setT(0);
      setRun((r) => r + 1);
    } else {
      setPlaying(false);
      setT(D);
    }
  }, [playing, t, D, i, last]);

  // Preferensi kurangi gerakan: tanpa putar otomatis
  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  const tt = reduced ? D : Math.min(t, D);
  const text = scene.code.join("\n");
  const typeProgress = reduced ? 1 : Math.min(1, tt / (D * TYPE_PORTION));
  const chars = Math.floor(text.length * typeProgress);
  const typed = text.slice(0, chars);

  let linesDone = 0;
  {
    let acc = 0;
    for (const line of scene.code) {
      acc += line.length;
      if (chars >= acc) {
        linesDone++;
        acc += 1;
      } else break;
    }
  }

  const started = playing || t > 0 || i > 0;
  const ended = !playing && i === last && t >= D;

  const goTo = (j: number) => {
    sfx.click();
    setI(j);
    setT(0);
    setRun((r) => r + 1);
    setPlaying(!reduced);
  };

  const toggle = () => {
    sfx.click();
    if (reduced) return;
    if (ended) {
      setI(0);
      setT(0);
      setRun((r) => r + 1);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  };

  return (
    <section
      aria-label={`Video penjelasan ${language.title}`}
      className="mb-10 overflow-hidden rounded-3xl border-2 border-slate-200 bg-white"
    >
      <div className={`flex items-center justify-between px-5 py-3 text-white ${st.solid}`}>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-white/85">Video penjelasan</p>
          <h2 className="text-base font-black leading-tight">
            {language.title} dalam {totalSecs} detik
          </h2>
        </div>
        <span className="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-black">
          {i + 1}/{scenes.length}
        </span>
      </div>

      <div className="flex gap-1.5 px-4 pt-4" role="group" aria-label="Bagian video">
        {scenes.map((s, j) => {
          const pct = j < i ? 100 : j === i ? (reduced ? 100 : Math.min(100, (t / D) * 100)) : 0;
          return (
            <button
              key={j}
              onClick={() => goTo(j)}
              aria-label={`Bagian ${j + 1}: ${s.title}`}
              aria-current={j === i}
              className="h-3 flex-1 py-[3px]"
            >
              <span className="block h-1.5 overflow-hidden rounded-full bg-slate-200">
                <span className={`block h-full rounded-full ${st.bar}`} style={{ width: `${pct}%` }} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative p-4">
        <pre
          className="overflow-x-auto rounded-2xl bg-indigo-950 p-4 font-mono text-xs leading-6 text-indigo-100 sm:text-sm"
          style={{ minHeight: `${maxLines * 1.5 + 2}rem` }}
        >
          <code aria-hidden="true">
            {tint ? tint(typed) : typed}
            {chars < text.length && (
              <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-teal-300" />
            )}
          </code>
          <span className="sr-only">{text}</span>
        </pre>

        <div key={`${i}-${run}`} className="mt-3 min-h-[15rem]" aria-hidden="true">
          {scene.render(linesDone)}
        </div>

        {!started && !reduced && (
          <div className="absolute inset-2 z-10 grid place-items-center rounded-2xl bg-white/95 p-6 text-center">
            <div>
              <p className={`text-xs font-extrabold uppercase tracking-wide ${st.text}`}>Video penjelasan</p>
              <h3 className="mt-1 text-2xl font-black text-indigo-950">
                {language.title} dalam {totalSecs} detik
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">{language.subtitle}</p>
              <button
                onClick={toggle}
                className="btn-3d mt-5 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#3730a3]"
              >
                Putar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-2" aria-live="polite">
        <h3 className={`text-xs font-extrabold uppercase tracking-wide ${st.text}`}>{scene.title}</h3>
        <p className="mt-1 min-h-[4.5rem] text-sm font-semibold leading-relaxed text-slate-600">{scene.caption}</p>
      </div>

      <div className="flex items-center justify-center gap-3 px-4 pb-5 pt-2">
        <button onClick={() => goTo(Math.max(0, i - 1))} disabled={i === 0} aria-label="Bagian sebelumnya" className={iconBtn}>
          <Icon d={PREV} />
        </button>
        {!reduced && (
          <button
            onClick={toggle}
            className="btn-3d flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#3730a3]"
          >
            <Icon d={ended ? REPLAY : playing ? PAUSE : PLAY} />
            {ended ? "Ulangi" : playing ? "Jeda" : "Putar"}
          </button>
        )}
        <button onClick={() => goTo(Math.min(last, i + 1))} disabled={i === last} aria-label="Bagian berikutnya" className={iconBtn}>
          <Icon d={NEXT} />
        </button>
      </div>
    </section>
  );
}
