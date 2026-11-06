"use client";

import { LANGUAGES } from "@/lib/data";
import { useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { LANGUAGE_STYLES } from "@/lib/theme";
import { CheckIcon, StarIcon } from "./Icons";

/** Halaman pemilihan bahasa pemrograman. Tiap kartu membuka jalur pelajaran bahasa tersebut. */
export function LanguagePicker({ onPick }: { onPick: (langId: string) => void }) {
  const { progress, ready } = useProgress();

  return (
    <div className={`transition-opacity ${ready ? "opacity-100" : "opacity-0"}`}>
      <div className="text-center">
        <h1 className="text-3xl font-black text-indigo-950 sm:text-4xl">Pilih bahasa pemrograman</h1>
        <p className="mx-auto mt-2 max-w-xl font-medium text-slate-500">
          Setiap bahasa punya jalur pelajaran dan soal latihannya sendiri. XP dan streak dipakai bersama.
        </p>
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LANGUAGES.map((lang) => {
          const st = LANGUAGE_STYLES[lang.color];
          const total = lang.lessons.length;
          const done = lang.lessons.filter((l) => progress.completed[l.id]).length;
          const questions = lang.lessons.reduce((n, l) => n + l.questions.length, 0);
          const stars = lang.lessons.reduce((n, l) => n + (progress.completed[l.id]?.stars ?? 0), 0);
          const pct = Math.round((done / total) * 100);
          const finished = done === total;

          return (
            <li key={lang.id}>
              <button
                onClick={() => {
                  sfx.click();
                  onPick(lang.id);
                }}
                aria-label={`${lang.title}: ${done} dari ${total} pelajaran selesai`}
                className="btn-3d flex h-full w-full flex-col rounded-3xl border-2 border-slate-200 bg-white p-5 text-left shadow-[0_5px_0_#e2e8f0] hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-mono text-lg font-black text-white ${st.solid} ${st.shadow}`}>
                    {lang.badge}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-black text-indigo-950">{lang.title}</h2>
                    <p className="text-sm font-semibold text-slate-500">{lang.subtitle}</p>
                  </div>
                  {finished && (
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-400 text-white" aria-label="Selesai">
                      <CheckIcon size={18} />
                    </span>
                  )}
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <div className={`h-full rounded-full transition-all ${st.bar}`} style={{ width: `${pct}%` }} />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm font-bold text-slate-500">
                  <span>
                    {done}/{total} pelajaran · {questions} soal
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <StarIcon size={14} /> {stars}/{total * 3}
                  </span>
                </div>

                <span className={`mt-4 text-sm font-black uppercase tracking-wide ${st.text}`}>
                  {done === 0 ? "Mulai belajar" : finished ? "Latihan lagi" : "Lanjutkan"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
