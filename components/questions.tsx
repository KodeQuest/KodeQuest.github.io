"use client";

import { useState } from "react";
import type { FillQuestion, MCQuestion, OrderQuestion } from "@/lib/data";
import { sfx } from "@/lib/sound";

type Common<A> = { locked: boolean; onChange: (answer: A | null) => void };

function shuffle<T>(arr: T[], avoidSame?: (a: T[]) => boolean): T[] {
  let out = arr.slice();
  for (let tries = 0; tries < 8; tries++) {
    out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (!avoidSame || !avoidSame(out)) break;
  }
  return out;
}

export function MultipleChoice({ q, locked, onChange }: { q: MCQuestion } & Common<number>) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Pilihan jawaban">
      {q.options.map((opt, i) => (
        <button
          key={i}
          role="radio"
          aria-checked={sel === i}
          disabled={locked}
          onClick={() => {
            sfx.click();
            setSel(i);
            onChange(i);
          }}
          className={`btn-3d flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-mono text-sm font-bold sm:text-base ${
            sel === i
              ? "border-indigo-500 bg-indigo-50 text-indigo-800 shadow-[0_4px_0_#818cf8]"
              : "border-slate-200 bg-white text-slate-700 shadow-[0_4px_0_#e2e8f0] hover:bg-slate-50"
          }`}
        >
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 font-sans text-xs font-black ${
              sel === i ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-300 text-slate-400"
            }`}
          >
            {i + 1}
          </span>
          <span className="break-all">{opt}</span>
        </button>
      ))}
    </div>
  );
}

type Token = { id: number; text: string };

export function CodeOrder({ q, locked, onChange }: { q: OrderQuestion } & Common<string[]>) {
  const [pool, setPool] = useState<Token[]>(() => {
    const all: Token[] = [...q.pieces, ...(q.decoys ?? [])].map((text, id) => ({ id, text }));
    return shuffle(all, (a) => a.slice(0, q.pieces.length).every((t, i) => t.text === q.pieces[i]));
  });
  const [chosen, setChosen] = useState<Token[]>([]);

  const emit = (next: Token[]) => onChange(next.length ? next.map((t) => t.text) : null);

  const add = (t: Token) => {
    if (locked) return;
    sfx.click();
    const next = [...chosen, t];
    setChosen(next);
    setPool(pool.filter((p) => p.id !== t.id));
    emit(next);
  };
  const remove = (t: Token) => {
    if (locked) return;
    sfx.click();
    const next = chosen.filter((c) => c.id !== t.id);
    setChosen(next);
    setPool([...pool, t]);
    emit(next);
  };

  const chip = "btn-3d rounded-xl border-2 px-3 py-2 font-mono text-sm font-bold break-all text-left";
  return (
    <div>
      <div
        className="min-h-[7.5rem] rounded-2xl border-2 border-dashed border-indigo-200 bg-white p-3"
        aria-label="Area jawaban, susunan kode kamu"
      >
        {chosen.length === 0 && <p className="pt-6 text-center text-sm font-semibold text-slate-400">Ketuk potongan kode di bawah untuk menyusunnya di sini</p>}
        <div className="flex flex-wrap gap-2">
          {chosen.map((t) => (
            <button
              key={t.id}
              disabled={locked}
              onClick={() => remove(t)}
              className={`${chip} border-indigo-300 bg-indigo-50 text-indigo-800 shadow-[0_3px_0_#a5b4fc]`}
            >
              {t.text}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Potongan kode tersedia">
        {pool.map((t) => (
          <button
            key={t.id}
            disabled={locked}
            onClick={() => add(t)}
            className={`${chip} border-slate-200 bg-white text-slate-700 shadow-[0_3px_0_#e2e8f0] hover:bg-slate-50`}
          >
            {t.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FillBlank({ q, locked, onChange }: { q: FillQuestion } & Common<string>) {
  const [value, setValue] = useState("");
  const [before, after] = q.code.split("___");
  const [options] = useState(() => shuffle(q.options));

  const set = (v: string) => {
    setValue(v);
    onChange(v.trim() ? v : null);
  };

  return (
    <div>
      <pre className="overflow-x-auto rounded-2xl bg-indigo-950 p-4 font-mono text-sm leading-relaxed text-indigo-100 sm:text-base">
        <code>
          {before}
          <input
            value={value}
            disabled={locked}
            onChange={(e) => set(e.target.value)}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Isi bagian rumpang"
            placeholder="…"
            style={{ width: `${Math.max(4, value.length + 2)}ch` }}
            className="mx-0.5 rounded-md border-b-2 border-teal-300 bg-indigo-900 px-1 py-0.5 text-center font-mono font-bold text-teal-200 outline-none focus:border-white"
          />
          {after}
        </code>
      </pre>

      <p className="mb-2 mt-5 text-center text-xs font-extrabold uppercase tracking-wide text-slate-400">atau pilih kata</p>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((o) => (
          <button
            key={o}
            disabled={locked}
            onClick={() => {
              sfx.click();
              set(o);
            }}
            className={`btn-3d rounded-xl border-2 px-4 py-2 font-mono text-sm font-bold ${
              value === o
                ? "border-indigo-500 bg-indigo-50 text-indigo-800 shadow-[0_3px_0_#818cf8]"
                : "border-slate-200 bg-white text-slate-700 shadow-[0_3px_0_#e2e8f0] hover:bg-slate-50"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
