"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { MAX_NAME, cleanName, useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { CloseIcon, DownloadIcon, UploadIcon } from "./Icons";
import { Modal } from "./Modal";

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { progress, backup, importJson, toggleSound, toggleSaveAlert, setName, reset } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [draft, setDraft] = useState(progress.name);
  const [nameMsg, setNameMsg] = useState<string | null>(null);

  const saveName = (e: FormEvent) => {
    e.preventDefault();
    const clean = cleanName(draft);
    setName(clean);
    setDraft(clean);
    sfx.click();
    setNameMsg(clean ? "Nama disimpan. Ekspor ulang file JSON agar nama ikut tersimpan." : "Nama dikosongkan.");
  };

  const doExport = () => {
    sfx.click();
    backup();
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
    <Modal label="Pengaturan" onClose={onClose}>
      {(close) => (
      <>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-indigo-950">Pengaturan</h2>
          <button onClick={close} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Tutup">
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="divide-y-2 divide-slate-100">
          <div className="pb-4">
            <h3 className="font-extrabold text-indigo-950">Nama profil</h3>
            <p className="mb-3 mt-1 text-sm text-slate-500">
              Nama ikut tersimpan di file JSON dan tampil di{" "}
              <Link href="/belajar/score/" className="font-bold text-indigo-600 underline">
                papan skor
              </Link>
              .
            </p>
            <form onSubmit={saveName} className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setNameMsg(null);
                }}
                maxLength={MAX_NAME}
                placeholder="Tulis namamu"
                aria-label="Nama profil"
                autoComplete="nickname"
                className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-bold text-indigo-950 outline-none focus:border-indigo-400"
              />
              <button
                type="submit"
                disabled={cleanName(draft) === progress.name}
                className="btn-3d rounded-xl bg-indigo-600 px-4 py-2 text-sm font-extrabold text-white shadow-[0_3px_0_#3730a3] disabled:opacity-50"
              >
                Simpan
              </button>
            </form>
            {nameMsg && (
              <p role="status" className="mt-2 text-sm font-bold text-teal-600">
                {nameMsg}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between py-4">
            <span className="font-bold text-indigo-950">Efek suara</span>
            <button
              role="switch"
              aria-checked={progress.sound}
              aria-label="Efek suara"
              onClick={toggleSound}
              className={`relative h-7 w-12 rounded-full transition-colors ${progress.sound ? "bg-teal-500" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${progress.sound ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <span className="font-bold text-indigo-950">Pengingat simpan JSON</span>
              <p className="mt-0.5 text-sm text-slate-500">Tampilkan pop up untuk mengunduh progres (.json) saat hendak menutup tab.</p>
            </div>
            <button
              role="switch"
              aria-checked={progress.saveAlert}
              aria-label="Pengingat simpan JSON"
              onClick={toggleSaveAlert}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${progress.saveAlert ? "bg-teal-500" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${progress.saveAlert ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          <div className="py-4">
            <h3 className="font-extrabold text-indigo-950">Cadangkan progres</h3>
            <p className="mb-3 mt-1 text-sm text-slate-500">
              Progres tersimpan di browser ini. Unduh sebagai file .json agar aman bila data browser terhapus, atau untuk pindah perangkat.
            </p>
            <div className="flex gap-3">
              <button
                onClick={doExport}
                className="btn-3d flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-extrabold text-indigo-600 shadow-[0_3px_0_#e2e8f0]"
              >
                <DownloadIcon size={18} /> Ekspor
              </button>
              <button
                onClick={() => {
                  sfx.click();
                  fileRef.current?.click();
                }}
                className="btn-3d flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-extrabold text-indigo-600 shadow-[0_3px_0_#e2e8f0]"
              >
                <UploadIcon size={18} /> Impor
              </button>
              <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => void doImport(e.target.files?.[0])} />
            </div>
            {msg && (
              <p role="status" className={`mt-3 text-sm font-bold ${msg.ok ? "text-teal-600" : "text-rose-600"}`}>
                {msg.text}
              </p>
            )}
          </div>

          <div className="pt-4">
            <h3 className="font-extrabold text-rose-600">Reset progres</h3>
            <p className="mb-3 mt-1 text-sm text-slate-500">Menghapus XP, streak, dan semua pelajaran yang sudah selesai.</p>
            {confirmReset ? (
              <div className="flex items-center gap-2">
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
              <button onClick={() => setConfirmReset(true)} className="rounded-xl border-2 border-rose-200 px-3 py-2 text-sm font-extrabold text-rose-600 hover:bg-rose-50">
                Reset progres
              </button>
            )}
          </div>
        </div>
      </>
      )}
    </Modal>
  );
}
