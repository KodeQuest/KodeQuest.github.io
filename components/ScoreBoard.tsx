"use client";

import { useMemo, useRef, useState, type DragEvent } from "react";
import { LANGUAGES, getLesson, languageOfLesson } from "@/lib/data";
import { useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { MAX_FILES, MAX_FILE_BYTES, languageScore, metricOf, parseEntry, rankEntries, type Entry, type SortKey } from "@/lib/score";
import { UploadIcon } from "./Icons";

const BASE_COLS: { key: SortKey; label: string }[] = [
  { key: "xp", label: "XP" },
  { key: "avg", label: "Rata-rata" },
  ...LANGUAGES.map((l) => ({ key: `lang:${l.id}` as SortKey, label: l.title })),
];

const MEDAL = ["bg-amber-300 text-amber-950", "bg-slate-300 text-slate-800", "bg-orange-300 text-orange-950"];

function cell(e: Entry, key: SortKey): { main: string; sub?: string } {
  if (key.startsWith("lang:")) {
    const r = languageScore(e, key.slice(5));
    return r.score === null ? { main: "–" } : { main: String(r.score), sub: `${r.done}/${r.total}` };
  }
  const v = metricOf(e, key);
  return { main: v === null ? "–" : String(v) };
}

/** Papan skor: muat satu atau lebih file JSON progres, lalu urutkan dari nilai tertinggi per materi. */
export function ScoreBoard() {
  const { exportJson } = useProgress();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("xp");
  const [hideEmpty, setHideEmpty] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const entriesRef = useRef<Entry[]>([]);
  entriesRef.current = entries;

  const addEntries = (incoming: Entry[], errs: string[]) => {
    const seen = new Set(entriesRef.current.map((e) => e.sig));
    const fresh: Entry[] = [];
    for (const e of incoming) {
      if (seen.has(e.sig)) errs.push(`${e.file}: sudah dimuat.`);
      else {
        seen.add(e.sig);
        fresh.push(e);
      }
    }
    setEntries((prev) => [...prev, ...fresh]);
    setNotes(errs);
  };

  const addFiles = async (files: FileList | File[] | null) => {
    if (!files) return;
    const incoming: Entry[] = [];
    const errs: string[] = [];
    for (const f of Array.from(files)) {
      if (entriesRef.current.length + incoming.length >= MAX_FILES) {
        errs.push(`Batas ${MAX_FILES} file tercapai.`);
        break;
      }
      if (f.size > MAX_FILE_BYTES) {
        errs.push(`${f.name}: file terlalu besar (maks 1 MB).`);
        continue;
      }
      const r = parseEntry(await f.text(), f.name);
      if (r.ok) incoming.push(r.entry);
      else errs.push(`${f.name}: ${r.error}`);
    }
    addEntries(incoming, errs);
    if (incoming.length) sfx.correct();
    else if (errs.length) sfx.wrong();
    if (fileRef.current) fileRef.current.value = "";
  };

  const addMine = () => {
    sfx.click();
    const r = parseEntry(exportJson(), "Saya.json");
    if (r.ok) addEntries([r.entry], []);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void addFiles(e.dataTransfer.files);
  };

  const lessonCol = sort.startsWith("lesson:") ? getLesson(sort.slice(7)) : undefined;
  const cols = lessonCol
    ? [{ key: sort, label: `${languageOfLesson(lessonCol.id)?.title ?? ""} · ${lessonCol.title}` }, ...BASE_COLS]
    : BASE_COLS;
  const ranked = useMemo(() => rankEntries(entries, sort, hideEmpty), [entries, sort, hideEmpty]);

  return (
    <div className="space-y-6">
      <section
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-3xl border-2 border-dashed p-5 transition-colors ${dragging ? "border-indigo-400 bg-indigo-50" : "border-slate-300"}`}
      >
        <h2 className="font-black text-indigo-950">Muat file progres</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Pilih satu atau lebih file .json hasil Ekspor di Pengaturan, atau seret ke sini. File dibaca di browser ini dan tidak diunggah ke mana pun.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              sfx.click();
              fileRef.current?.click();
            }}
            className="btn-3d flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_3px_0_#3730a3]"
          >
            <UploadIcon size={18} /> Pilih file JSON
          </button>
          <button
            onClick={addMine}
            className="btn-3d rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-indigo-600 shadow-[0_3px_0_#e2e8f0]"
          >
            Masukkan progresku
          </button>
          {entries.length > 0 && (
            <button
              onClick={() => {
                sfx.click();
                setEntries([]);
                setNotes([]);
              }}
              className="rounded-xl px-3 py-2.5 text-sm font-extrabold text-rose-600 hover:bg-rose-50"
            >
              Hapus semua
            </button>
          )}
          <input ref={fileRef} type="file" multiple accept="application/json,.json" className="hidden" onChange={(e) => void addFiles(e.target.files)} />
        </div>
        {notes.length > 0 && (
          <ul role="status" className="mt-3 space-y-0.5 text-sm font-bold text-rose-600">
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        )}
      </section>

      {entries.length === 0 ? (
        <p className="rounded-3xl border-2 border-slate-200 p-8 text-center text-sm font-bold text-slate-400">
          Belum ada peserta. Muat file JSON untuk melihat peringkat.
        </p>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <label className="min-w-0 flex-1 text-sm font-extrabold text-indigo-950 sm:max-w-sm">
              Urutkan dari nilai tertinggi
              <select
                value={sort}
                onChange={(e) => {
                  sfx.click();
                  setSort(e.target.value as SortKey);
                }}
                className="mt-1 block w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-indigo-950 outline-none focus:border-indigo-400"
              >
                <optgroup label="Umum">
                  <option value="xp">Total XP</option>
                  <option value="avg">Nilai rata-rata semua materi</option>
                </optgroup>
                <optgroup label="Nilai per bahasa">
                  {LANGUAGES.map((l) => (
                    <option key={l.id} value={`lang:${l.id}`}>
                      {l.title}
                    </option>
                  ))}
                </optgroup>
                {LANGUAGES.map((l) => (
                  <optgroup key={l.id} label={`Pelajaran ${l.title}`}>
                    {l.lessons.map((ls) => (
                      <option key={ls.id} value={`lesson:${ls.id}`}>
                        {ls.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 pb-2.5 text-sm font-bold text-slate-600">
              <input type="checkbox" checked={hideEmpty} onChange={(e) => setHideEmpty(e.target.checked)} className="h-4 w-4 accent-indigo-600" />
              Sembunyikan yang belum mengerjakan
            </label>
            <p className="pb-2.5 text-sm font-semibold text-slate-400">{ranked.length} peserta</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border-2 border-slate-200">
            <table className="w-full min-w-[44rem] text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  <th scope="col" className="w-14 px-3 py-3">
                    #
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Nama
                  </th>
                  {cols.map((c) => (
                    <th key={c.key} scope="col" aria-sort={c.key === sort ? "descending" : "none"} className={`px-3 py-3 ${c.key === sort ? "bg-indigo-50 text-indigo-700" : ""}`}>
                      <button
                        onClick={() => {
                          sfx.click();
                          setSort(c.key);
                        }}
                        className="text-left uppercase tracking-wide hover:text-indigo-600"
                      >
                        {c.label}
                        {c.key === sort && " ↓"}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ranked.map(({ entry, rank }) => (
                  <tr key={entry.id} className="border-t-2 border-slate-100">
                    <td className="px-3 py-2.5">
                      <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${rank <= 3 ? MEDAL[rank - 1] : "bg-slate-100 text-slate-500"}`}>{rank}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="max-w-[12rem] truncate font-black text-indigo-950">{entry.name}</div>
                      <div className="max-w-[12rem] truncate text-xs font-semibold text-slate-400">{entry.file}</div>
                    </td>
                    {cols.map((c) => {
                      const v = cell(entry, c.key);
                      return (
                        <td key={c.key} className={`px-3 py-2.5 tabular-nums ${c.key === sort ? "bg-indigo-50/60" : ""}`}>
                          <div className={`font-black ${v.main === "–" ? "text-slate-300" : "text-indigo-950"}`}>{v.main}</div>
                          {v.sub && <div className="text-xs font-semibold text-slate-400">{v.sub}</div>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs font-semibold text-slate-400">
            Nilai pelajaran = akurasi saat menyelesaikannya (0–100). Nilai bahasa = rata-rata semua pelajaran bahasa itu, yang belum selesai dihitung 0. Angka kecil di bawahnya
            = pelajaran selesai. Nilai seri diurutkan lewat XP.
          </p>
        </section>
      )}
    </div>
  );
}
