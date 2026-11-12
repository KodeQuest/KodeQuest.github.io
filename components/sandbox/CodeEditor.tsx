"use client";

import { useRef } from "react";

/**
 * Editor kode sederhana berbasis <textarea>.
 * - Tab menyisipkan dua spasi (riwayat undo tetap utuh). Tekan Esc lalu Tab untuk memindahkan fokus keluar.
 * - Ctrl/⌘ + Enter memanggil `onRun`.
 */
export function CodeEditor({
  value,
  onChange,
  onRun,
  label,
  className = "h-72",
}: {
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  label: string;
  /** Kelas tinggi (mis. "h-72 lg:h-[28rem]"). Tinggi tetap agar sejajar dengan panel di sebelahnya. */
  className?: string;
}) {
  const releaseTab = useRef(false);

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          releaseTab.current = true;
          return;
        }
        if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
          if (releaseTab.current) {
            releaseTab.current = false;
            return; // biarkan fokus pindah
          }
          e.preventDefault();
          const el = e.currentTarget;
          if (!document.execCommand("insertText", false, "  ")) {
            const s = el.selectionStart;
            onChange(el.value.slice(0, s) + "  " + el.value.slice(el.selectionEnd));
            requestAnimationFrame(() => {
              el.selectionStart = el.selectionEnd = s + 2;
            });
          }
          return;
        }
        releaseTab.current = false;
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && onRun) {
          e.preventDefault();
          onRun();
        }
      }}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      autoComplete="off"
      wrap="off"
      aria-label={label}
      className={`block w-full resize-none overflow-auto rounded-2xl border-2 border-indigo-950 bg-indigo-950 p-4 font-mono text-sm leading-relaxed text-indigo-100 outline-none focus:border-indigo-400 ${className}`}
    />
  );
}
