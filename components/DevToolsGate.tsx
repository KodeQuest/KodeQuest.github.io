"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Berapa lama layar tetap hitam setelah pemain menekan pintasan pembuka dev tools. */
const HOLD_MS = 3000;
/** Selisih ukuran jendela luar/dalam yang dianggap sebagai panel dev tools yang terdock. */
const DOCK_THRESHOLD = 160;
const MESSAGE = "Jangan buka dev mode";

/** Pintasan keyboard pembuka dev tools / lihat sumber (Windows, Linux, macOS). */
function isDevShortcut(e: KeyboardEvent) {
  if (e.code === "F12") return true;
  // Ctrl/Cmd + Shift + I, J, C, K
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["KeyI", "KeyJ", "KeyC", "KeyK"].includes(e.code)) return true;
  // Cmd + Opt + I, J, C, U (macOS)
  if (e.metaKey && e.altKey && ["KeyI", "KeyJ", "KeyC", "KeyU"].includes(e.code)) return true;
  // Ctrl + U (lihat sumber halaman)
  if (e.ctrlKey && e.code === "KeyU") return true;
  return false;
}

/** Deteksi dev tools yang sedang terbuka lewat ukuran jendela (terdock) dan jeda pada pernyataan debugger. */
function devToolsOpen() {
  // Perangkat sentuh punya selisih ukuran yang tidak berarti (bilah alamat), jadi dilewati.
  if (window.matchMedia("(pointer: fine)").matches) {
    if (window.outerWidth - window.innerWidth > DOCK_THRESHOLD || window.outerHeight - window.innerHeight > DOCK_THRESHOLD) return true;
  }
  // Saat dev tools terbuka, `debugger` berhenti dan jeda terukur. Bila tertutup, tidak melakukan apa-apa.
  const t = performance.now();
  new Function("debugger")();
  return performance.now() - t > 100;
}

/**
 * Pencegah ringan terhadap dev tools. Saat pemain menekan pintasan dev tools atau panel dev tools terdeteksi terbuka:
 * semua isi aplikasi dilepas dari DOM (panel Elements hanya berisi pesan di bawah) dan layar menjadi hitam polos
 * yang tidak bisa disentuh. Setelah dev tools ditutup, aplikasi tampil lagi.
 * Hanya aktif pada build produksi supaya `npm run dev` tetap nyaman dipakai.
 * Catatan: ini hanya penghalang, bukan keamanan. Browser tidak bisa benar-benar mencegah dev tools.
 */
export function DevToolsGate({ children }: { children: ReactNode }) {
  const [locked, setLocked] = useState(false);
  const openRef = useRef(false);
  const holdUntil = useRef(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    let releaseTimer: number | undefined;

    const sync = () => setLocked(openRef.current || Date.now() < holdUntil.current);
    const check = () => {
      openRef.current = devToolsOpen();
      sync();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!isDevShortcut(e)) return;
      e.preventDefault();
      e.stopPropagation();
      holdUntil.current = Date.now() + HOLD_MS;
      sync();
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(sync, HOLD_MS + 50);
    };

    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", check);
    const poll = window.setInterval(check, 700);
    check();
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", check);
      window.clearInterval(poll);
      window.clearTimeout(releaseTimer);
    };
  }, []);

  useEffect(() => {
    if (locked) console.clear();
  }, [locked]);

  if (locked) {
    // Teks sengaja memakai warna yang sama dengan latar: layar tampak hitam polos, tetapi panel Elements berisi pesannya.
    return (
      <div
        role="alert"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2147483647,
          background: "#000",
          color: "#000",
          pointerEvents: "all",
          userSelect: "none",
          cursor: "none",
        }}
      >
        {MESSAGE}
      </div>
    );
  }
  return <>{children}</>;
}
