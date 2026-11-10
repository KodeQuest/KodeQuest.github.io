"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Lama animasi tutup (ms). Harus sama dengan durasi .anim-*-out di globals.css. */
const CLOSE_MS = 200;

/**
 * Modal dalam halaman dengan animasi buka dan tutup.
 * `onClose` dipanggil SETELAH animasi tutup selesai, jadi induk cukup melepas komponen ini.
 * Anak menerima `close()` untuk menutup dengan animasi.
 * Dirender lewat portal ke document.body: induk ber-backdrop-filter/transform (mis. nav landing)
 * menjadikan `fixed` relatif ke induk itu, bukan ke layar.
 */
export function Modal({ label, onClose, wide = false, children }: { label: string; onClose: () => void; wide?: boolean; children: (close: () => void) => ReactNode }) {  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    if (timer.current) return;
    setClosing(true);
    timer.current = setTimeout(onClose, CLOSE_MS);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return createPortal(
    <div
      className={`${closing ? "anim-backdrop-out" : "anim-backdrop-in"} fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center sm:p-4`}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className={`${closing ? "anim-sheet-out" : "anim-sheet-in"} w-full bg-white ${
  wide ? "max-h-[92dvh] max-w-3xl overflow-y-auto rounded-t-3xl sm:rounded-3xl" : "max-w-md rounded-t-3xl p-6 sm:rounded-3xl"
}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children(close)}
      </div>
    </div>,
    document.body
  );
}

/** Pengganti window.confirm. `onConfirm` / `onCancel` dipanggil setelah animasi tutup. */
export function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel = "Batal",
  danger = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmed = useRef(false);
  return (
    <Modal label={title} onClose={() => (confirmed.current ? onConfirm() : onCancel())}>
      {(close) => (
        <div>
          <h2 className="text-xl font-black text-indigo-950">{title}</h2>
          <p className="mb-6 mt-2 text-sm font-semibold text-slate-500">{message}</p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button onClick={close} className="btn-3d rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-600 shadow-[0_3px_0_#e2e8f0] hover:bg-slate-50">
              {cancelLabel}
            </button>
            <button
              autoFocus
              onClick={() => {
                confirmed.current = true;
                close();
              }}
              className={`btn-3d rounded-xl px-5 py-3 text-sm font-extrabold text-white ${
                danger ? "bg-rose-500 shadow-[0_3px_0_#be123c]" : "bg-indigo-600 shadow-[0_3px_0_#3730a3]"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
