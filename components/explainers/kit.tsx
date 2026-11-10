import type { ReactNode } from "react";
import { Check, Pop } from "./html";

/** Perkakas bersama untuk video penjelasan bahasa pemrograman (Python, C++, Java, PHP, React). */

export type Accent = "sky" | "violet" | "rose" | "fuchsia" | "cyan";

// Kelas ditulis utuh agar terbaca oleh Tailwind.
const A: Record<Accent, { box: string; chip: string; dot: string; title: string; tag: string; hot: string }> = {
  sky: { box: "border-sky-200 bg-sky-50", chip: "bg-sky-200 text-sky-800", dot: "bg-sky-500", title: "text-sky-700", tag: "text-sky-600", hot: "bg-sky-100 text-sky-700" },
  violet: { box: "border-violet-200 bg-violet-50", chip: "bg-violet-200 text-violet-800", dot: "bg-violet-500", title: "text-violet-700", tag: "text-violet-600", hot: "bg-violet-100 text-violet-700" },
  rose: { box: "border-rose-200 bg-rose-50", chip: "bg-rose-200 text-rose-800", dot: "bg-rose-500", title: "text-rose-700", tag: "text-rose-600", hot: "bg-rose-100 text-rose-700" },
  fuchsia: { box: "border-fuchsia-200 bg-fuchsia-50", chip: "bg-fuchsia-200 text-fuchsia-800", dot: "bg-fuchsia-500", title: "text-fuchsia-700", tag: "text-fuchsia-600", hot: "bg-fuchsia-100 text-fuchsia-700" },
  cyan: { box: "border-cyan-200 bg-cyan-50", chip: "bg-cyan-200 text-cyan-800", dot: "bg-cyan-500", title: "text-cyan-700", tag: "text-cyan-600", hot: "bg-cyan-100 text-cyan-700" },
};

/** Pewarna kode: `source` = alternasi regex tanpa grup penangkap, `classify` memberi kelas warna per token. */
export function makeTint(source: string, classify: (token: string) => string) {
  const re = new RegExp(`(${source})`);
  return (code: string): ReactNode =>
    code.split(re).map((part, k) => {
      if (!part) return null;
      const cls = classify(part);
      return cls ? (
        <span key={k} className={cls}>
          {part}
        </span>
      ) : (
        <span key={k}>{part}</span>
      );
    });
}

export function Chip({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`rounded-lg px-2 py-1 font-mono text-xs font-black ${className}`}>{children}</span>;
}

/** Keluaran program (terminal / konsol). */
export function Out({ lines, label = "Terminal" }: { lines: string[]; label?: string }) {
  return (
    <div className="mt-3 rounded-xl bg-indigo-950 p-3 font-mono text-sm font-bold text-teal-300">
      <div className="mb-1 text-xs font-extrabold uppercase tracking-wide text-indigo-300">{label}</div>
      {lines.length === 0 ? (
        <span className="text-indigo-400">…</span>
      ) : (
        lines.map((l, i) => (
          <Pop key={i}>
            <div>&gt; {l}</div>
          </Pop>
        ))
      )}
    </div>
  );
}

/** Kartu variabel: nama, nilai, dan tipe. */
export function Var({ name, value, type, accent }: { name: string; value: string; type?: string; accent: Accent }) {
  return (
    <Pop className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-2 ${A[accent].box}`}>
      <span className="font-mono text-sm font-black text-indigo-950">{name}</span>
      <span className="ml-auto font-mono text-sm font-bold text-slate-600">{value}</span>
      {type && <Chip className={A[accent].chip}>{type}</Chip>}
    </Pop>
  );
}

/** Kartu umum untuk fungsi, komponen, atau bagian struktur. */
export function Card({ title, note, accent }: { title: string; note?: string; accent: Accent }) {
  return (
    <Pop className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2 font-mono text-sm font-black ${A[accent].box} ${A[accent].title}`}>
      {title}
      {note && <span className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-xs font-black">{note}</span>}
    </Pop>
  );
}

/** Ekspresi → hasil, mis. `umur >= 17 → True`. */
export function Result({ expr, value, accent }: { expr: string; value: string; accent: Accent }) {
  return (
    <Pop className="flex items-center gap-2 font-mono text-sm font-bold text-slate-600">
      <Chip className="bg-slate-100 text-slate-600">{expr}</Chip>
      <span aria-hidden="true">→</span>
      <Chip className={A[accent].hot}>{value}</Chip>
    </Pop>
  );
}

/** Sel list/array dengan indeks di bawahnya. */
export function Cells({ items, accent }: { items: string[]; accent: Accent }) {
  return (
    <div className="flex gap-2">
      {items.map((b, i) => (
        <Pop key={b} className="text-center">
          <div className={`rounded-xl border-2 px-3 py-2 font-mono text-sm font-black ${A[accent].box} ${A[accent].title}`}>{b}</div>
          <div className="mt-1 font-mono text-xs font-bold text-slate-400">[{i}]</div>
        </Pop>
      ))}
    </div>
  );
}

/** Daftar ringkasan di adegan terakhir; baris ke-k muncul saat n >= k + 1. */
export function Recap({ items, n, accent }: { items: [string, string][]; n: number; accent: Accent }) {
  return (
    <div className="grid gap-2 rounded-2xl border-2 border-slate-200 p-4">
      {items.map(([tags, label], k) =>
        n >= k + 1 ? (
          <Pop key={tags} className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 ${A[accent].box}`}>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-white ${A[accent].dot}`}>
              <Check />
            </span>
            <span className={`text-sm font-black ${A[accent].title}`}>{label}</span>
            <span className={`ml-auto font-mono text-xs font-bold ${A[accent].tag}`}>{tags}</span>
          </Pop>
        ) : null
      )}
    </div>
  );
}
