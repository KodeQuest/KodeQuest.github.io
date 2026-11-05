"use client";

import { useEffect } from "react";

/** Menonaktifkan menu klik kanan di seluruh halaman (kecuali kolom isian teks). */
export function NoContextMenu() {
  useEffect(() => {
    const block = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, [contenteditable='true']")) return;
      e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);
  return null;
}
