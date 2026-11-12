"use client";

import { useEffect, useState } from "react";
import { sfx } from "@/lib/sound";
import { clearSaved, DEFAULT_STDIN, loadSaved, saveCode, STARTERS } from "@/lib/sandbox";
import { useRuntime, type RuntimeKind } from "@/lib/useRuntime";
import { ConfirmModal } from "../Modal";
import { CodeEditor } from "./CodeEditor";
import { EnvLoading } from "./EnvLoading";

const META: Record<
  RuntimeKind,
  { title: string; file: string; steps: string[]; loadingHint: string; note: string; stdinHint: string }
> = {
  python: {
    title: "Menyiapkan environment Python",
    file: "main.py",
    steps: ["Mengunduh Pyodide", "Memuat interpreter Python", "Siap digunakan"],
    loadingHint: "Pertama kali mengunduh sekitar 10 MB, jadi bisa beberapa detik. Berikutnya cepat karena tersimpan di browser.",
    note: "Python 3 asli (Pyodide) yang berjalan di browsermu. Pustaka standar (math, random, json, dll.) tersedia. Paket tambahan dan akses file/jaringan tidak tersedia.",
    stdinHint: "Satu baris untuk tiap input().",
  },
  cpp: {
    title: "Menyiapkan environment C++",
    file: "main.cpp",
    steps: ["Mengunduh interpreter C++", "Menyiapkan parser dan pustaka", "Siap digunakan"],
    loadingHint: "Ukurannya kecil (sekitar 0,4 MB) dan hanya diunduh sekali.",
    note: "Interpreter C++ ringan (JSCPP): iostream, cmath, cstdio, cstdlib, cstring, cctype, ctime, iomanip. Belum mendukung std::string dan STL (vector, map, dll.), jadi pakai char[] untuk teks.",
    stdinHint: "Dibaca oleh cin, dipisah spasi atau baris baru.",
  },
};

/** Editor dan keluaran memakai tinggi yang sama agar sejajar. */
const EDITOR_H = "h-72 lg:h-[24rem]";
const OUT_H = "h-80 lg:h-[24rem]";

const labelCls = "mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-400";

/** Editor + keluaran untuk bahasa yang butuh environment (Python, C++). Environment dimuat saat komponen pertama kali tampil. */
export function RuntimePlayground({ kind }: { kind: RuntimeKind }) {
  const meta = META[kind];
  const rt = useRuntime(kind);
  const [code, setCode] = useState(STARTERS[kind]);
  const [stdin, setStdin] = useState(DEFAULT_STDIN[kind]);
  const [loaded, setLoaded] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    rt.start();
  }, [rt.start]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCode(loadSaved(kind) ?? STARTERS[kind]);
    setStdin(loadSaved(`${kind}-stdin`) ?? DEFAULT_STDIN[kind]);
    setLoaded(true);
  }, [kind]);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      saveCode(kind, code);
      saveCode(`${kind}-stdin`, stdin);
    }, 400);
    return () => clearTimeout(t);
  }, [loaded, kind, code, stdin]);

  const canRun = rt.status === "ready";
  const running = rt.status === "running";
  const run = () => {
    if (!canRun) return;
    sfx.click();
    rt.run(code, stdin);
  };

  return (
    <div className="grid gap-x-6 gap-y-4 lg:grid-cols-2">
      {/* Baris 1: editor | keluaran, tinggi sama. Layar kecil: editor, masukan + tombol, keluaran, catatan. */}
      <section className="order-1 min-w-0">
        <p className={labelCls}>{meta.file}</p>
        <CodeEditor value={code} onChange={setCode} onRun={run} label={`Editor ${meta.file}`} className={EDITOR_H} />
      </section>

      <section className="order-3 min-w-0 lg:order-2">
        <p className={labelCls}>Keluaran</p>

        {rt.status === "loading" || rt.status === "idle" ? (
          <EnvLoading title={meta.title} steps={meta.steps} active={rt.step} hint={meta.loadingHint} className={OUT_H} />
        ) : rt.status === "error" ? (
          <div role="alert" className={`overflow-auto rounded-2xl border-2 border-rose-100 bg-rose-50 p-5 ${OUT_H}`}>
            <p className="font-black text-rose-700">Environment gagal disiapkan</p>
            <p className="mt-1 break-words text-sm font-semibold text-rose-700">{rt.error}</p>
            <p className="mt-2 text-xs font-semibold text-rose-600">Periksa koneksi internet, lalu coba lagi.</p>
            <button
              onClick={() => {
                sfx.click();
                rt.retry();
              }}
              className="btn-3d mt-4 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#be123c]"
            >
              Coba lagi
            </button>
          </div>
        ) : (
          <div className={`flex flex-col overflow-hidden rounded-2xl bg-indigo-950 ${OUT_H}`}>
            <div className="min-h-0 flex-1 overflow-auto p-4 font-mono text-sm font-bold leading-relaxed" aria-live="polite">
              {rt.output.length === 0 ? (
                <span className="text-indigo-400">{running ? "Berjalan…" : "Tekan Jalankan untuk melihat hasilnya"}</span>
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono">
                  {rt.output.map((l, i) => (
                    <span key={i} className={l.stream === "err" ? "text-rose-300" : l.stream === "sys" ? "block italic text-amber-300" : "text-teal-200"}>
                      {l.text}
                    </span>
                  ))}
                </pre>
              )}
            </div>
            <p className="border-t-2 border-indigo-900 bg-indigo-900 px-4 py-1.5 text-xs font-bold text-indigo-300">
              {running
                ? "Berjalan…"
                : rt.lastRun
                  ? rt.lastRun.ok
                    ? `Selesai dalam ${rt.lastRun.ms} ms${rt.lastRun.exit !== undefined ? ` · kode keluar ${rt.lastRun.exit}` : ""}`
                    : `Berakhir dengan error setelah ${rt.lastRun.ms} ms`
                  : "Environment siap"}
            </p>
          </div>
        )}
      </section>

      <section className="order-2 min-w-0 lg:order-3">
        <label className={`${labelCls} block`} htmlFor={`stdin-${kind}`}>
          Masukan (stdin)
        </label>
        <textarea
          id={`stdin-${kind}`}
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          rows={2}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="block w-full resize-none rounded-2xl border-2 border-slate-200 bg-white p-3 font-mono text-sm text-indigo-950 outline-none focus:border-indigo-400"
        />
        <p className="mt-1 text-xs font-semibold text-slate-500">{meta.stdinHint}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {running ? (
            <button onClick={() => rt.stop()} className="btn-3d rounded-xl bg-rose-500 px-6 py-2.5 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#be123c]">
              Hentikan
            </button>
          ) : (
            <button
              onClick={run}
              disabled={!canRun}
              className={`btn-3d rounded-xl px-6 py-2.5 text-sm font-black uppercase tracking-wide ${
                canRun ? "bg-indigo-600 text-white shadow-[0_4px_0_#3730a3]" : "bg-slate-200 text-slate-400 shadow-[0_4px_0_#cbd5e1]"
              }`}
            >
              {rt.status === "loading" ? "Menyiapkan…" : "Jalankan"}
            </button>
          )}
          <button
            onClick={() => setConfirmReset(true)}
            className="btn-3d rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-600 shadow-[0_3px_0_#e2e8f0] hover:bg-slate-50"
          >
            Atur ulang
          </button>
          <span className="text-xs font-semibold text-slate-400">Ctrl/⌘ + Enter</span>
        </div>
      </section>

      <p className="order-4 min-w-0 self-start rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold leading-relaxed text-slate-500">{meta.note}</p>

      {confirmReset && (
        <ConfirmModal
          title="Atur ulang kode?"
          message="Kode dan masukan kembali ke contoh awal. Kode yang sekarang akan hilang."
          confirmLabel="Atur ulang"
          danger
          onConfirm={() => {
            setConfirmReset(false);
            clearSaved([kind, `${kind}-stdin`]);
            setCode(STARTERS[kind]);
            setStdin(DEFAULT_STDIN[kind]);
          }}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
