"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TypeQuestion } from "@/lib/data";
import { cssDoc, htmlDoc, jsCode, jsDoc, matchLive } from "@/lib/live";

/** Semua kotak pratinjau (target dan hasil) memakai ukuran yang sama supaya kedua kolom sejajar. */
const box = "h-32 w-full overflow-auto rounded-xl";
const frame = `${box} border-2 border-slate-200 bg-white`;
const consoleBox = `${box} whitespace-pre-wrap break-words bg-indigo-950 p-3 font-mono text-sm font-bold`;
const emptyBox = `${box} grid place-items-center border-2 border-dashed border-slate-200 px-3 text-center text-sm font-bold text-slate-400`;
const label = "mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-400";

/** Hasil yang diharapkan: HTML/CSS dirender dari jawaban pertama, sisanya memakai teks `preview`. */
export function TargetPreview({ q }: { q: TypeQuestion }) {
  const live = q.live;
  return (
    <div className="min-w-0">
      <p className={label}>Target</p>
      {live?.kind === "html" ? (
        <iframe title="Target" sandbox="" srcDoc={htmlDoc(q.answers[0])} className={frame} />
      ) : live?.kind === "css" ? (
        <iframe title="Target" sandbox="" srcDoc={cssDoc(q.answers[0], live.html, live.base)} className={frame} />
      ) : (
        <pre className={`${consoleBox} text-indigo-200`}>{q.preview}</pre>
      )}
    </div>
  );
}

let counter = 0;

/** Hasil dari kode yang sedang diketik pemain, diperbarui langsung saat mengetik. */
export function LiveResult({ q, typed }: { q: TypeQuestion; typed: string }) {
  const live = q.live;
  const [debounced, setDebounced] = useState(typed);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(typed), 150);
    return () => clearTimeout(t);
  }, [typed]);

  const hasCode = debounced.trim() !== "";
  const waiting = <span>{hasCode ? "…" : "Ketik kode untuk melihat hasilnya"}</span>;

  // JavaScript: dijalankan di iframe ber-sandbox, keluaran console.log dikirim balik lewat postMessage.
  const [run, setRun] = useState<{ id: number; doc: string } | null>(null);
  const [jsOut, setJsOut] = useState<{ ok: boolean; out: string[] } | null>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (live?.kind !== "js") return;
    if (!debounced.trim()) {
      setRun(null);
      setJsOut(null);
      return;
    }
    const id = ++counter;
    setRun({ id, doc: jsDoc(jsCode(live, debounced), id) });
  }, [live, debounced]);
  useEffect(() => {
    if (live?.kind !== "js") return;
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const d = e.data as { kq?: number; ok?: boolean; out?: string[] } | null;
      if (d && typeof d.kq === "number" && d.kq === counter) setJsOut({ ok: !!d.ok, out: Array.isArray(d.out) ? d.out : [] });
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [live]);

  const matched = useMemo(() => (live?.kind === "match" ? matchLive(live.rules, debounced, q.ignoreCase) : null), [live, debounced, q.ignoreCase]);

  let body: React.ReactNode;
  if (live?.kind === "html") {
    body = hasCode ? <iframe title="Hasil kodemu" sandbox="" srcDoc={htmlDoc(debounced)} className={frame} /> : <div className={emptyBox}>{waiting}</div>;
  } else if (live?.kind === "css") {
    body = hasCode ? <iframe title="Hasil kodemu" sandbox="" srcDoc={cssDoc(debounced, live.html, live.base)} className={frame} /> : <div className={emptyBox}>{waiting}</div>;
  } else if (live?.kind === "js") {
    body = (
      <>
        <div className={`${consoleBox} text-teal-200`}>{jsOut && jsOut.ok && hasCode ? jsOut.out.join("\n") || <span className="text-indigo-400">(tidak ada keluaran)</span> : <span className="text-indigo-400">{waiting}</span>}</div>
        {run && <iframe key={run.id} ref={frameRef} title="Penjalan kode" sandbox="allow-scripts" srcDoc={run.doc} className="hidden" />}
      </>
    );
  } else {
    body = <div className={`${consoleBox} text-teal-200`}>{matched ?? <span className="text-indigo-400">{waiting}</span>}</div>;
  }

  return (
    <div className="min-w-0">
      <p className={label}>Hasil kodemu (langsung)</p>
      {body}
    </div>
  );
}
