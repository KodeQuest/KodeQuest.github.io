"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sound";
import { clearSaved, loadSaved, saveCode, STARTERS } from "@/lib/sandbox";
import { useRuntime, type RuntimeKind } from "@/lib/useRuntime";
import { ConfirmModal } from "../Modal";
import { CodeEditor } from "./CodeEditor";
import { EnvLoading } from "./EnvLoading";

const META: Record<
  RuntimeKind,
  { title: string; file: string; steps: string[]; loadingHint: string; note: string }
> = {
  python: {
    title: "Menyiapkan environment Python",
    file: "main.py",
    steps: ["Mengunduh Pyodide", "Memuat interpreter Python", "Siap digunakan"],
    loadingHint: "Pertama kali mengunduh sekitar 10 MB, jadi bisa beberapa detik. Berikutnya cepat karena tersimpan di browser.",
    note: "Python 3 asli (Pyodide) yang berjalan di browsermu. Pustaka standar (math, random, json, dll.) tersedia. Paket tambahan dan akses file/jaringan tidak tersedia. Saat program memanggil input(), ketik jawabanmu langsung di console lalu tekan Enter.",
  },
  cpp: {
    title: "Menyiapkan environment C++",
    file: "main.cpp",
    steps: ["Mengunduh interpreter C++", "Menyiapkan parser dan pustaka", "Siap digunakan"],
    loadingHint: "Ukurannya kecil (sekitar 0,4 MB) dan hanya diunduh sekali.",
    note: "Interpreter C++ ringan (JSCPP): iostream, cmath, cstdio, cstdlib, cstring, cctype, ctime, iomanip. Belum mendukung std::string dan STL (vector, map, dll.), jadi pakai char[] untuk teks. Saat program membaca cin, ketik masukanmu langsung di console lalu tekan Enter.",
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
  const [typing, setTyping] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    rt.start();
  }, [rt.start]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCode(loadSaved(kind) ?? STARTERS[kind]);
    setLoaded(true);
  }, [kind]);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      saveCode(kind, code);
    }, 400);
    return () => clearTimeout(t);
  }, [loaded, kind, code]);

  const canRun = rt.status === "ready";
  const awaiting = rt.status === "input";
  const running = rt.status === "running" || awaiting;
  const run = () => {
    if (!canRun) return;
    sfx.click();
    setTyping("");
    rt.run(code);
  };

  // Fokuskan baris input saat program menunggu masukan, dan selalu gulir ke bawah mengikuti keluaran.
  useEffect(() => {
    if (awaiting) inputRef.current?.focus();
  }, [awaiting]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rt.output, typing, awaiting]);

  const submit = () => {
    if (!awaiting) return;
    const line = typing;
    setTyping("");
    rt.sendInput(line);
  };

  return (
    <div className="grid gap-x-6 gap-y-4 lg:grid-cols-2">
      {/* Layar kecil: editor, tombol, console, catatan. Layar besar: editor | console, lalu tombol selebar grid. */}
      <section className="order-1 min-w-0">
        <p className={labelCls}>{meta.file}</p>
        <CodeEditor value={code} onChange={setCode} onRun={run} label={`Editor ${meta.file}`} className={EDITOR_H} />
      </section>

      <section className="order-3 min-w-0 lg:order-2">
        <p className={labelCls}>Console</p>

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
            {/* Klik di mana saja pada console untuk fokus ke baris input. */}
            <div
              ref={scrollRef}
              onClick={() => inputRef.current?.focus()}
              className="min-h-0 flex-1 overflow-auto p-4 font-mono text-sm font-bold leading-relaxed"
              aria-live="polite"
            >
              {rt.output.length === 0 && !awaiting ? (
                <span className="text-indigo-400">{running ? "Berjalan…" : "Tekan Jalankan, lalu ketik masukan langsung di sini"}</span>
              ) : (
                <div className="whitespace-pre-wrap break-words font-mono">
                  {rt.output.map((l, i) => (
                    <span key={i} className={l.stream === "err" ? "text-rose-300" : l.stream === "in" ? "text-amber-200" : l.stream === "sys" ? "block italic text-amber-300" : "text-teal-200"}>
                      {l.text}
                    </span>
                  ))}
                  {awaiting && (
                    <input
                      ref={inputRef}
                      value={typing}
                      onChange={(e) => setTyping(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          submit();
                        }
                      }}
                      style={{ width: `${Math.max(typing.length + 1, 2)}ch` }}
                      maxLength={500}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoCorrect="off"
                      autoComplete="off"
                      aria-label="Masukan untuk program"
                      className="inline-block max-w-full border-0 bg-transparent p-0 font-mono text-sm font-bold text-amber-200 caret-amber-200 outline-none"
                    />
                  )}
                </div>
              )}
            </div>
            <p className="border-t-2 border-indigo-900 bg-indigo-900 px-4 py-1.5 text-xs font-bold text-indigo-300">
              {awaiting
                ? "Menunggu masukan: ketik lalu tekan Enter"
                : running
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

      <div className="order-2 flex flex-wrap items-center gap-3 lg:order-3 lg:col-span-2">
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

      <p className="order-4 min-w-0 self-start rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold leading-relaxed text-slate-500 lg:col-span-2">{meta.note}</p>

      {confirmReset && (
        <ConfirmModal
          title="Atur ulang kode?"
          message="Kode kembali ke contoh awal. Kode yang sekarang akan hilang."
          confirmLabel="Atur ulang"
          danger
          onConfirm={() => {
            setConfirmReset(false);
            clearSaved([kind, `${kind}-stdin`]);
            setCode(STARTERS[kind]);
          }}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
