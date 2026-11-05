"use client";

import { useRef, useState } from "react";
import { useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { progress, exportJson, importJson, toggleSound, reset } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const doExport = () => {
    sfx.click();
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kodequest-progres-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMsg({ ok: true, text: "File progres diunduh. Simpan di tempat aman." });
  };

  const doImport = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setMsg({ ok: false, text: "File terlalu besar." });
      return;
    }
    const res = importJson(await file.text());
    setMsg({ ok: res.ok, text: res.message });
    if (res.ok) sfx.correct();
    else sfx.wrong();
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-indigo-950/50 p-0 backdrop-blur-sm sm:place-items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pengaturan"
    >
      <div className="anim-slide-up w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black text-indigo-950">Pengaturan</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200" aria-label="Tutup">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              toggleSound();
            }}
            className="flex w-full items-center justify-between rounded-2xl bg-indigo-50 px-4 py-3 text-left font-bold text-indigo-950"
          >
            <span>Efek suara</span>
            <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${progress.sound ? "bg-teal-500 text-white" : "bg-slate-300 text-slate-700"}`}>
              {progress.sound ? "AKTIF" : "MATI"}
            </span>
          </button>

          <div className="rounded-2xl border-2 border-indigo-100 p-4">
            <h3 className="font-extrabold text-indigo-950">Cadangkan progres</h3>
            <p className="mb-3 text-sm text-slate-500">
              Progres tersimpan di browser ini. Unduh sebagai file .json agar aman bila data browser terhapus atau untuk pindah perangkat.
            </p>
            <div className="flex gap-2">
              <button onClick={doExport} className="btn-3d flex-1 rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_#3730a3]">
                ⬇ Ekspor
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  fileRef.current?.click();
                }}
                className="btn-3d flex-1 rounded-xl bg-teal-500 px-3 py-2.5 text-sm font-extrabold text-white shadow-[0_4px_0_#0f766e]"
              >
                ⬆ Impor
              </button>
              <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => void doImport(e.target.files?.[0])} />
            </div>
            {msg && (
              <p role="status" className={`mt-3 text-sm font-bold ${msg.ok ? "text-teal-600" : "text-rose-600"}`}>
                {msg.text}
              </p>
            )}
          </div>

          <div className="rounded-2xl border-2 border-rose-100 p-4">
            <h3 className="font-extrabold text-rose-600">Zona berbahaya</h3>
            {confirmReset ? (
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    reset();
                    setConfirmReset(false);
                    setMsg({ ok: true, text: "Progres direset." });
                  }}
                  className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-extrabold text-white"
                >
                  Ya, hapus semua
                </button>
                <button onClick={() => setConfirmReset(false)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
                  Batal
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmReset(true)} className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-extrabold text-rose-600 hover:bg-rose-100">
                Reset progres
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
