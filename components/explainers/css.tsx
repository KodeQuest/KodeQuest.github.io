import type { ReactNode } from "react";
import type { Scene } from "./ExplainerPlayer";
import { Browser, Check, Pop } from "./html";

/** Warnai kode CSS yang sedang diketik: selektor (biru), properti (teal), nilai (kuning). */
export function tintCss(code: string): ReactNode {
  const out: ReactNode[] = [];
  let depth = 0;
  let inValue = false;
  let buf = "";
  let k = 0;

  const flush = () => {
    if (!buf) return;
    const cls = depth === 0 ? "text-sky-300" : inValue ? "text-amber-300" : "text-teal-300";
    out.push(
      <span key={k++} className={cls}>
        {buf}
      </span>
    );
    buf = "";
  };
  const punct = (ch: string) => out.push(<span key={k++}>{ch}</span>);

  for (const ch of code) {
    if (ch === "{") {
      flush();
      punct(ch);
      depth++;
      inValue = false;
    } else if (ch === "}") {
      flush();
      punct(ch);
      depth = Math.max(0, depth - 1);
      inValue = false;
    } else if (ch === ":" && depth > 0 && !inValue) {
      flush();
      punct(ch);
      inValue = true;
    } else if (ch === ";") {
      flush();
      punct(ch);
      inValue = false;
    } else {
      buf += ch;
    }
  }
  flush();
  return out;
}

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="ml-2 rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-bold text-slate-500">{children}</span>
  );
}

function Chip({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`rounded-lg px-2 py-1 font-mono text-xs font-black ${className}`}>{children}</span>;
}

const RECAP: [string, string][] = [
  [".kelas #id", "Selektor"],
  ["color background", "Warna"],
  ["padding border margin", "Box model"],
  ["display: flex", "Flexbox"],
];

/** Video penjelasan CSS: mengikuti 3 pelajaran di data/languages/css.json. */
export const cssScenes: Scene[] = [
  {
    title: "Apa itu CSS?",
    caption:
      "CSS (Cascading Style Sheets) mengatur tampilan halaman: warna, ukuran, dan tata letak. Aturannya berbentuk selektor { properti: nilai; }.",
    duration: 6000,
    code: ["h1 {", "  color: blue;", "}"],
    render: (n) => (
      <Browser tab="Halamanku">
        <h1 className={`text-2xl font-black transition-colors duration-300 ${n >= 2 ? "text-blue-600" : "text-indigo-950"}`}>
          Halo, KodeQuest!
        </h1>
        <p className="mt-2 font-semibold text-slate-600">CSS mengubah tampilan tanpa mengubah isi halaman.</p>
      </Browser>
    ),
  },
  {
    title: "Selektor",
    caption:
      "Selektor memilih elemen yang ingin ditata: nama tag (p), class dengan titik (.kartu), atau id dengan tanda pagar (#menu).",
    duration: 8000,
    code: ["p { color: gray; }", ".kartu { background: gold; }", "#menu { color: red; }"],
    render: (n) => (
      <Browser tab="Selektor">
        <div className="space-y-3">
          <p className={`font-semibold transition-colors duration-300 ${n >= 1 ? "text-slate-400" : "text-indigo-950"}`}>
            Paragraf biasa
            <Label>p</Label>
          </p>
          <div
            className={`rounded-xl px-3 py-2 text-sm font-black transition-colors duration-300 ${
              n >= 2 ? "bg-amber-300 text-amber-950" : "bg-slate-100 text-slate-500"
            }`}
          >
            Kartu
            <Label>.kartu</Label>
          </div>
          <div className={`font-black transition-colors duration-300 ${n >= 3 ? "text-rose-600" : "text-indigo-950"}`}>
            Menu
            <Label>#menu</Label>
          </div>
        </div>
      </Browser>
    ),
  },
  {
    title: "Box model",
    caption:
      "Setiap elemen adalah kotak berlapis. Dari dalam ke luar: konten, padding (ruang dalam), border (garis tepi), lalu margin (jarak luar).",
    duration: 9000,
    code: [".kotak {", "  padding: 16px;", "  border: 4px solid teal;", "  margin: 24px;", "}"],
    render: (n) => (
      <Browser tab="Box model">
        <div className="space-y-3">
          <div
            className={`rounded-xl transition-all duration-300 ${
              n >= 4 ? "border-2 border-dashed border-amber-400 bg-amber-50 p-6" : "border-2 border-transparent p-0"
            }`}
          >
            <div className={`rounded-lg transition-all duration-300 ${n >= 3 ? "border-4 border-teal-500" : "border-4 border-transparent"}`}>
              <div className={`bg-indigo-100 transition-all duration-300 ${n >= 2 ? "p-4" : "p-0"}`}>
                <div className="rounded-md bg-white px-3 py-2 text-center text-sm font-black text-indigo-950">Konten</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {n >= 2 && (
              <Pop>
                <Chip className="bg-indigo-100 text-indigo-700">padding 16px</Chip>
              </Pop>
            )}
            {n >= 3 && (
              <Pop>
                <Chip className="bg-teal-100 text-teal-700">border 4px</Chip>
              </Pop>
            )}
            {n >= 4 && (
              <Pop>
                <Chip className="bg-amber-100 text-amber-700">margin 24px</Chip>
              </Pop>
            )}
          </div>
        </div>
      </Browser>
    ),
  },
  {
    title: "Flexbox",
    caption:
      "display: flex menyusun item dalam satu baris. justify-content mengatur posisi di sumbu utama, dan gap memberi jarak antar item.",
    duration: 9000,
    code: [".baris {", "  display: flex;", "  justify-content: center;", "  gap: 12px;", "}"],
    render: (n) => (
      <Browser tab="Flexbox">
        <div
          className={`flex rounded-xl border-2 border-dashed border-slate-200 p-3 transition-all duration-300 ${
            n >= 2 ? "flex-row" : "flex-col items-start"
          } ${n >= 3 ? "justify-center" : "justify-start"} ${n >= 4 ? "gap-3" : "gap-0"}`}
        >
          {["A", "B", "C"].map((x) => (
            <div key={x} className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500 text-lg font-black text-white">
              {x}
            </div>
          ))}
        </div>
      </Browser>
    ),
  },
  {
    title: "Ringkasan",
    caption: "Kamu sudah melihat selektor, warna, box model, dan flexbox. Saatnya berlatih lewat pelajaran di bawah.",
    duration: 6000,
    code: [".kelas #id → selektor", "color background → warna", "padding border margin → box model", "display: flex → flexbox"],
    render: (n) => (
      <div className="grid gap-2 rounded-2xl border-2 border-slate-200 p-4">
        {RECAP.map(([tags, label], k) =>
          n >= k + 1 ? (
            <Pop key={tags} className="flex items-center gap-3 rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-3 py-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-500 text-white">
                <Check />
              </span>
              <span className="text-sm font-black text-indigo-700">{label}</span>
              <span className="ml-auto font-mono text-xs font-bold text-indigo-600">{tags}</span>
            </Pop>
          ) : null
        )}
      </div>
    ),
  },
];
