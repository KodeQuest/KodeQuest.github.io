"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Menonaktifkan seleksi teks di /belajar dan semua halaman di bawahnya (kolom isian tetap bisa dipilih). */
export function NoSelect() {
  const pathname = usePathname();
  const active = pathname.startsWith("/belajar");

  useEffect(() => {
    const root = document.documentElement;
    if (active) root.setAttribute("data-noselect", "");
    else root.removeAttribute("data-noselect");
    return () => root.removeAttribute("data-noselect");
  }, [active]);

  return null;
}
