"use client";

import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sound";
import { buildWebDoc, clearSaved, loadSaved, saveCode, STARTERS, type ConsoleLine, type WebFile } from "@/lib/sandbox";
import { CloseIcon, ExpandIcon } from "../Icons";
import { ConfirmModal } from "../Modal";
import { CodeEditor } from "./CodeEditor";

const FILES: { id: WebFile; label: string; name: string }[] = [
  { id: "html", label: "HTML", name: "index.html" },
  { id: "css", label: "CSS", name: "style.css" },
  { id: "js", label: "JavaScript", name: "script.js" },
];

const levelClass: Record<ConsoleLine["level"], string> = {
  log: "text-teal-200",
  info: "text-sky-300",
  warn: "text-amber-300",
  error: "text-rose-300",
};

/** Tinggi panel editor; panel kanan memakai tinggi yang sama (editor + baris tab) agar dasarnya sejajar. */
const PANE_H = "h-72 lg:h-[26rem]";
const PANE_H_RIGHT = "h-[22rem] lg:h-[26rem]";
const btnGhost = "btn-3d rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-600 shadow-[0_3px_0_#e2e8f0] hover:bg-slate-50";

/** HTML + CSS + JavaScript dengan pratinjau langsung. HTML/CSS memperbarui pratinjau otomatis; JS dijalankan lewat tombol Jalankan. */
export function WebPlayground() {
  const [files, setFiles] = useState<Record<WebFile, string>>({ html: STARTERS.html, css: STARTERS.css, js: STARTERS.js });
  /** Versi JS yang terakhir dijalankan. Mengetik di editor JS tidak mengubah pratinjau sampai Jalankan ditekan. */
  const [ranJs, setRanJs] = useState(STARTERS.js);
  const [runTick, setRunTick] = useState(0);
  const [active, setActive] = useState<WebFile>("html");
  const [loaded, setLoaded] = useState(false);
  const [doc, setDoc] = useState<{ id: number; html: string } | null>(null);
  const [lines, setLines] = useState<ConsoleLine[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const [full, setFull] = useState(false);
  const idRef = useRef(0);
  const frameRef = useRef<HTMLIFrameElement>(null);

  // Pulihkan kode tersimpan (setelah mount, agar tidak beda dengan HTML hasil render server).
  useEffect(() => {
    const next = {
      html: loadSaved("html") ?? STARTERS.html,
      css: loadSaved("css") ?? STARTERS.css,
      js: loadSaved("js") ?? STARTERS.js,
    };
    setFiles(next);
    setRanJs(next.js);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      saveCode("html", files.html);
      saveCode("css", files.css);
      saveCode("js", files.js);
    }, 400);
    return () => clearTimeout(t);
  }, [loaded, files]);

  // Susun ulang pratinjau (ditunda sebentar saat mengetik).
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      const id = ++idRef.current;
      setLines([]);
      setDoc({ id, html: buildWebDoc(files.html, files.css, ranJs, id) });
    }, 250);
    return () => clearTimeout(t);
  }, [loaded, files.html, files.css, ranJs, runTick]);

  // Terima keluaran console dari iframe.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const d = e.data as { kq?: number; level?: ConsoleLine["level"]; text?: string } | null;
      if (!d || d.kq !== idRef.current || typeof d.text !== "string") return;
      const level = d.level && d.level in levelClass ? d.level : "log";
      setLines((cur) => (cur.length >= 200 ? cur : [...cur, { level, text: d.text as string }]));
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Layar penuh: Esc menutup, dan halaman di belakang tidak ikut tergulir.
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [full]);

  const run = () => {
    sfx.click();
    setRanJs(files.js);
    setRunTick((t) => t + 1);
  };

  const reset = () => {
    clearSaved(["html", "css", "js"]);
    setFiles({ html: STARTERS.html, css: STARTERS.css, js: STARTERS.js });
    setRanJs(STARTERS.js);
    setRunTick((t) => t + 1);
  };

  const current = FILES.find((f) => f.id === active)!;
  const dirtyJs = files.js !== ranJs;

  return (
    <div className="grid gap-x-6 gap-y-4 lg:grid-cols-2">
      {/* Kiri: editor. Tinggi tetap supaya sejajar dengan panel hasil di kanan. */}
      <section className="order-1 flex min-w-0 flex-col gap-3">
        <div className="flex h-11 items-center gap-2 overflow-x-auto py-1" role="tablist" aria-label="Berkas">
          {FILES.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={active === f.id}
              onClick={() => {
                sfx.click();
                setActive(f.id);
              }}
              className={`btn-3d shrink-0 rounded-xl border-2 px-4 py-1.5 text-sm font-extrabold ${
                active === f.id ? "border-indigo-500 bg-indigo-50 text-indigo-800 shadow-[0_3px_0_#818cf8]" : "border-slate-200 bg-white text-slate-500 shadow-[0_3px_0_#e2e8f0] hover:bg-slate-50"
              }`}
            >
              {f.label}
              {f.id === "js" && dirtyJs && <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-amber-400 align-middle" title="Belum dijalankan" />}
            </button>
          ))}
        </div>
        <CodeEditor key={active} value={files[active]} onChange={(v) => setFiles((f) => ({ ...f, [active]: v }))} onRun={run} label={`Editor ${current.name}`} className={PANE_H} />
      </section>

      {/* Tombol: di bawah editor pada layar kecil, selebar grid pada layar besar. */}
      <div className="order-2 flex flex-wrap items-center gap-x-3 gap-y-2 lg:order-3 lg:col-span-2">
        <button onClick={run} className="btn-3d rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#3730a3]">
          Jalankan
        </button>
        <button onClick={() => setConfirmReset(true)} className={btnGhost}>
          Atur ulang
        </button>
        <p className="min-w-[14rem] flex-1 text-xs font-semibold text-slate-500">
          {active === "js" ? "JavaScript berjalan saat kamu menekan Jalankan (Ctrl/⌘ + Enter)." : "Pratinjau diperbarui otomatis saat kamu mengetik."} Tab = indentasi, Esc lalu Tab = pindah fokus.
        </p>
      </div>

      {/* Kanan: pratinjau dan console sebagai dua kotak terpisah, total setinggi editor. */}
      <section className="order-3 flex min-w-0 flex-col gap-3 lg:order-2">
        <div className="flex h-11 items-center">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Pratinjau</p>
        </div>
        <div className={`flex flex-col gap-3 ${PANE_H_RIGHT}`}>
          {/* Slot tetap di grid. Saat layar penuh, bingkai di dalamnya menjadi fixed; iframe tidak dipindah supaya tidak dimuat ulang. */}
          <div className="min-h-0 flex-[3]">
            <div className={full ? "fixed inset-0 z-[100] flex flex-col bg-white" : "relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-indigo-950"}>
              {full && (
                <div className="flex h-12 shrink-0 items-center justify-between border-b-2 border-indigo-900 bg-indigo-950 px-4">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-indigo-200">Pratinjau · layar penuh</p>
                  <button
                    onClick={() => {
                      sfx.click();
                      setFull(false);
                    }}
                    className="btn-3d flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wide text-indigo-700 shadow-[0_3px_0_#a5b4fc]"
                    aria-label="Tutup layar penuh (Esc)"
                  >
                    <CloseIcon size={16} /> Tutup
                  </button>
                </div>
              )}
              <iframe ref={frameRef} title="Pratinjau hasil" sandbox="allow-scripts" srcDoc={doc?.html ?? ""} className="min-h-0 w-full flex-1 bg-white" />
              {!full && (
                <button
                  onClick={() => {
                    sfx.click();
                    setFull(true);
                  }}
                  className="btn-3d absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-xl border-2 border-indigo-200 bg-white/90 text-indigo-700 shadow-[0_3px_0_#c7d2fe] backdrop-blur hover:bg-indigo-50"
                  aria-label="Pratinjau layar penuh"
                  title="Layar penuh"
                >
                  <ExpandIcon size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-[2] flex-col overflow-hidden rounded-2xl border-2 border-indigo-950 bg-indigo-950">
            <div className="border-b-2 border-indigo-900 bg-indigo-900 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-indigo-300">Console</div>
            <div className="min-h-0 flex-1 overflow-auto p-3 font-mono text-sm font-bold" aria-live="polite">
              {lines.length === 0 ? (
                <span className="text-indigo-400">Keluaran console.log akan tampil di sini</span>
              ) : (
                lines.map((l, i) => (
                  <div key={i} className={`whitespace-pre-wrap break-words ${levelClass[l.level]}`}>
                    {l.level === "error" ? "✖ " : l.level === "warn" ? "⚠ " : ""}
                    {l.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {confirmReset && (
        <ConfirmModal
          title="Atur ulang kode?"
          message="HTML, CSS, dan JavaScript kembali ke contoh awal. Kode yang sekarang akan hilang."
          confirmLabel="Atur ulang"
          danger
          onConfirm={() => {
            setConfirmReset(false);
            reset();
          }}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
