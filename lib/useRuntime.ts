"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CPP_WORKER_URL, PYODIDE_INDEX_URL, PY_WORKER_URL } from "./sandbox";

export type RuntimeKind = "python" | "cpp";
export type RuntimeStatus = "idle" | "loading" | "ready" | "running" | "error";
export type OutLine = { stream: "out" | "err" | "sys"; text: string };

/** Batas waktu satu eksekusi sebelum worker dihentikan paksa (loop tanpa henti). */
const RUN_LIMIT_MS = 10000;
/** Batas keluaran agar tab tidak macet oleh program yang mencetak tanpa henti. */
const MAX_OUT_CHARS = 100_000;

/**
 * Mengelola satu worker (Python/Pyodide atau C++/JSCPP): memuat environment, menjalankan kode,
 * mengumpulkan keluaran, dan menghentikan eksekusi yang macet.
 * Environment baru dimuat saat `start()` dipanggil (malas), bukan saat halaman dibuka.
 */
export function useRuntime(kind: RuntimeKind) {
  const [status, setStatus] = useState<RuntimeStatus>("idle");
  /** Indeks langkah pemuatan yang sedang berjalan (untuk daftar langkah di layar loading). */
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<OutLine[]>([]);
  const [lastRun, setLastRun] = useState<{ ms: number; exit?: number; ok: boolean } | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const runId = useRef(0);
  const startedAt = useRef(0);
  const outChars = useRef(0);
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disposed = useRef(false);

  const clearWatchdog = () => {
    if (watchdog.current) clearTimeout(watchdog.current);
    watchdog.current = null;
  };

  const append = useCallback((line: OutLine) => {
    setOutput((cur) => {
      // Gabungkan potongan berurutan dari aliran yang sama agar tidak jadi ratusan elemen.
      const last = cur[cur.length - 1];
      if (last && last.stream === line.stream && line.stream !== "sys") {
        return [...cur.slice(0, -1), { stream: line.stream, text: last.text + line.text }];
      }
      return [...cur, line];
    });
  }, []);

  const boot = useCallback(() => {
    if (disposed.current) return;
    workerRef.current?.terminate();
    clearWatchdog();
    setStatus("loading");
    setStep(0);
    setError(null);

    let w: Worker;
    try {
      w =
        kind === "python"
          ? new Worker(PY_WORKER_URL, { type: "module" })
          : new Worker(CPP_WORKER_URL);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Browser tidak mendukung Web Worker.");
      return;
    }
    workerRef.current = w;

    w.onmessage = (ev: MessageEvent) => {
      if (workerRef.current !== w) return;
      const m = ev.data as { type: string; id?: number; text?: string; stream?: "out" | "err"; message?: string; stage?: string; exit?: number };
      switch (m.type) {
        case "stage":
          setStep(m.stage === "init" ? 1 : 0);
          break;
        case "ready":
          setStep(2);
          setStatus("ready");
          break;
        case "fatal":
          setStatus("error");
          setError(m.message || "Gagal menyiapkan environment.");
          w.terminate();
          workerRef.current = null;
          break;
        case "out":
          if (m.id !== runId.current) break;
          outChars.current += m.text?.length ?? 0;
          if (outChars.current > MAX_OUT_CHARS) {
            if (outChars.current - (m.text?.length ?? 0) <= MAX_OUT_CHARS) append({ stream: "sys", text: "(keluaran dipotong: terlalu panjang)" });
            break;
          }
          append({ stream: m.stream ?? "out", text: m.text ?? "" });
          break;
        case "done":
          if (m.id !== runId.current) break;
          clearWatchdog();
          setLastRun({ ms: Math.round(performance.now() - startedAt.current), exit: m.exit, ok: true });
          setStatus("ready");
          break;
        case "error":
          if (m.id !== runId.current) break;
          clearWatchdog();
          append({ stream: "err", text: m.message ?? "Terjadi kesalahan." });
          setLastRun({ ms: Math.round(performance.now() - startedAt.current), ok: false });
          setStatus("ready");
          break;
      }
    };
    w.onerror = (ev) => {
      if (workerRef.current !== w) return;
      setStatus("error");
      setError(ev.message || "Worker gagal dimuat. Periksa koneksi internet lalu coba lagi.");
      w.terminate();
      workerRef.current = null;
    };

    w.postMessage(kind === "python" ? { type: "init", indexURL: PYODIDE_INDEX_URL } : { type: "init" });
  }, [kind, append]);

  /** Mulai memuat environment bila belum. */
  const start = useCallback(() => {
    if (workerRef.current || disposed.current) return;
    boot();
  }, [boot]);

  const halt = useCallback(
    (message: string) => {
      clearWatchdog();
      runId.current++; // abaikan pesan susulan dari worker lama
      append({ stream: "sys", text: message });
      setLastRun(null);
      boot(); // worker lama dibunuh dan environment dimuat ulang
    },
    [append, boot]
  );

  const run = useCallback(
    (code: string, stdin: string) => {
      const w = workerRef.current;
      if (!w || status !== "ready") return;
      runId.current++;
      outChars.current = 0;
      startedAt.current = performance.now();
      setOutput([]);
      setLastRun(null);
      setStatus("running");
      w.postMessage({ type: "run", id: runId.current, code, stdin });
      watchdog.current = setTimeout(() => halt(`Waktu habis (${RUN_LIMIT_MS / 1000} detik). Mungkin ada perulangan tanpa henti.`), RUN_LIMIT_MS);
    },
    [status, halt]
  );

  const stop = useCallback(() => {
    if (status === "running") halt("Eksekusi dihentikan.");
  }, [status, halt]);

  const retry = useCallback(() => {
    workerRef.current = null;
    boot();
  }, [boot]);

  useEffect(() => {
    disposed.current = false;
    return () => {
      disposed.current = true;
      clearWatchdog();
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  return { status, step, error, output, lastRun, start, run, stop, retry };
}
