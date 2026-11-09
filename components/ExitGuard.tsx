"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { DownloadIcon } from "./Icons";
import { Modal } from "./Modal";

/**
 * Modal dalam halaman yang menawarkan unduh progres (.json) saat pemain hendak menutup tab.
 * Hanya aktif di /belajar (bukan landing page) dan hanya bila sudah ada progres (XP atau pelajaran selesai).
 * - Browser tidak mengizinkan modal sendiri saat tab ditutup, jadi dipicu dari dua sinyal:
 *   kursor keluar lewat tepi atas jendela (menuju tombol tutup tab) dan `beforeunload`.
 * - `beforeunload` membuat browser menampilkan dialog bawaannya (teks tidak bisa diubah).
 *   Bila pemain memilih tetap di halaman, modal ini yang tampil.
 */
export function ExitGuard() {
  const { progress, backup } = useProgress();
  const pathname = usePathname();
  const active = pathname.startsWith("/belajar") && (progress.xp > 0 || Object.keys(progress.completed).length > 0);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const activeRef = useRef(active);
  const shownFor = useRef<string | null>(null);

  useEffect(() => {
    activeRef.current = active;
    if (!active) {
      shownFor.current = null;
      setOpen(false);
    }
  }, [active]);

  useEffect(() => {
    const show = (key: string) => {
      if (!activeRef.current || shownFor.current === key) return;
      shownFor.current = key;
      setSaved(false);
      setOpen(true);
    };
    // Kursor keluar lewat tepi atas: tampil sekali per perubahan progres.
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) show(`${progress.xp}:${Object.keys(progress.completed).length}`);
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!activeRef.current) return;
      e.preventDefault();
      e.returnValue = "";
      shownFor.current = null;
      setSaved(false);
      setOpen(true);
    };
    document.addEventListener("mouseout", onLeave);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [progress.xp, progress.completed]);

  if (!open) return null;

  const lessons = Object.keys(progress.completed).length;

  return (
    <Modal label="Simpan progres" onClose={() => setOpen(false)}>
      {(close) => (
        <div>
          <h2 className="text-xl font-black text-indigo-950">{saved ? "Progres tersimpan" : "Simpan progres sebelum pergi?"}</h2>
          <p className="mb-2 mt-2 text-sm font-semibold text-slate-500">
            {saved
              ? "File .json sudah diunduh. Pulihkan lewat Pengaturan > Impor kapan saja."
              : "Progres hanya tersimpan di browser ini. Unduh sebagai file .json agar tetap aman bila data browser terhapus."}
          </p>
          <p className="mb-6 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-extrabold text-indigo-700">
            {progress.xp} XP · {lessons} pelajaran selesai
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button onClick={close} className="btn-3d rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-600 shadow-[0_3px_0_#e2e8f0] hover:bg-slate-50">
              {saved ? "Selesai" : "Nanti saja"}
            </button>
            {!saved && (
              <button
                autoFocus
                onClick={() => {
                  sfx.click();
                  backup();
                  setSaved(true);
                }}
                className="btn-3d flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-[0_3px_0_#3730a3]"
              >
                <DownloadIcon size={18} /> Unduh progres (.json)
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
