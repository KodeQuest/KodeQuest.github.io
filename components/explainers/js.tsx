import type { ReactNode } from "react";
import type { Scene } from "./ExplainerPlayer";
import { Browser, Check, Pop } from "./html";

const KEYWORDS = new Set(["const", "let", "var", "function", "return", "if", "else", "for", "of"]);
const TOKEN = /(\/\/.*|`[^`]*`?|"[^"]*"?|'[^']*'?|\b(?:const|let|var|function|return|if|else|for|of)\b|\b\d+(?:\.\d+)?\b)/;

/** Warnai kode JavaScript yang sedang diketik: kata kunci (biru), teks (kuning), angka (teal), komentar (abu). */
export function tintJs(code: string): ReactNode {
  return code.split(TOKEN).map((part, k) => {
    if (!part) return null;
    let cls = "";
    if (part.startsWith("//")) cls = "text-slate-400";
    else if (/^["'`]/.test(part)) cls = "text-amber-300";
    else if (KEYWORDS.has(part)) cls = "text-sky-300";
    else if (/^\d/.test(part)) cls = "text-teal-300";
    return cls ? (
      <span key={k} className={cls}>
        {part}
      </span>
    ) : (
      <span key={k}>{part}</span>
    );
  });
}

function Chip({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`rounded-lg px-2 py-1 font-mono text-xs font-black ${className}`}>{children}</span>;
}

/** Hasil console.log. */
function Out({ lines }: { lines: string[] }) {
  return (
    <div className="mt-3 rounded-xl bg-indigo-950 p-3 font-mono text-sm font-bold text-teal-300">
      <div className="mb-1 text-xs font-extrabold uppercase tracking-wide text-indigo-300">Konsol</div>
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

function Variable({ name, kind, type, value }: { name: string; kind: string; type: string; value: string }) {
  return (
    <Pop className="flex items-center gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 px-3 py-2">
      <Chip className="bg-amber-200 text-amber-800">{kind}</Chip>
      <span className="font-mono text-sm font-black text-indigo-950">{name}</span>
      <span className="ml-auto font-mono text-sm font-bold text-slate-600">{value}</span>
      <Chip className="bg-slate-100 text-slate-500">{type}</Chip>
    </Pop>
  );
}

const BUAH = ["apel", "jeruk", "mangga"];

function FileCard({ name, tag }: { name: string; tag?: string }) {
  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-3">
      <div className="font-mono text-xs font-black text-amber-800">{name}</div>
      <div className="mt-2 min-h-[1.75rem]">
        {tag && (
          <Pop>
            <Chip className="bg-white text-amber-700">{tag}</Chip>
          </Pop>
        )}
      </div>
    </div>
  );
}

const RECAP: [string, string][] = [
  ["const let", "Variabel & tipe"],
  ["=> if else", "Fungsi & kondisi"],
  ["[ ] for", "Array & perulangan"],
  ["import export", "File & modul"],
];

/** Video penjelasan JavaScript: mengikuti 3 pelajaran di data/languages/js.json. */
export const jsScenes: Scene[] = [
  {
    title: "Apa itu JavaScript?",
    caption:
      "JavaScript adalah bahasa pemrograman yang membuat halaman web bisa berpikir dan bereaksi. console.log mencetak sesuatu ke konsol.",
    duration: 6000,
    code: ['console.log("Halo, KodeQuest!");'],
    render: (n) => (
      <Browser tab="Konsol">
        <Out lines={n >= 1 ? ["Halo, KodeQuest!"] : []} />
      </Browser>
    ),
  },
  {
    title: "Variabel & tipe",
    caption:
      "const membuat variabel yang nilainya tetap, let untuk nilai yang bisa diganti. Tipe datanya bisa teks (string) atau angka (number), dan template string memakai `${...}`.",
    duration: 10000,
    code: ['const nama = "Budi";', "let umur = 16;", "umur = 17;", "console.log(`Halo, ${nama}`);"],
    render: (n) => (
      <Browser tab="Memori">
        <div className="space-y-2">
          {n >= 1 && <Variable name="nama" kind="const" type="string" value='"Budi"' />}
          {n >= 2 && <Variable key={n >= 3 ? "b" : "a"} name="umur" kind="let" type="number" value={n >= 3 ? "17" : "16"} />}
        </div>
        <Out lines={n >= 4 ? ["Halo, Budi"] : []} />
      </Browser>
    ),
  },
  {
    title: "Fungsi",
    caption:
      "Fungsi adalah blok kode yang bisa dipakai berulang. Fungsi panah (=>) menulisnya singkat, dan return mengembalikan hasilnya.",
    duration: 7500,
    code: ["const kali = (a, b) => a * b;", "console.log(kali(3, 4));"],
    render: (n) => (
      <Browser tab="Fungsi">
        <div className="space-y-2">
          {n >= 1 && (
            <Pop className="rounded-2xl border-2 border-amber-200 bg-amber-50 px-3 py-2 font-mono text-sm font-black text-amber-800">
              kali(a, b) → a * b
            </Pop>
          )}
          {n >= 2 && (
            <Pop className="flex items-center gap-2 font-mono text-sm font-bold text-slate-600">
              <Chip className="bg-slate-100 text-slate-600">kali(3, 4)</Chip>
              <span aria-hidden="true">→</span>
              <Chip className="bg-teal-100 text-teal-700">12</Chip>
            </Pop>
          )}
        </div>
        <Out lines={n >= 2 ? ["12"] : []} />
      </Browser>
    ),
  },
  {
    title: "Kondisi",
    caption:
      "if menjalankan kode hanya jika kondisinya benar, else untuk sebaliknya. Gunakan === untuk perbandingan ketat: nilai dan tipe harus sama.",
    duration: 9000,
    code: ["const umur = 17;", "if (umur >= 17) {", '  console.log("Boleh");', "} else {", '  console.log("Belum");', "}"],
    render: (n) => (
      <Browser tab="Kondisi">
        <div className="space-y-2">
          {n >= 1 && <Variable name="umur" kind="const" type="number" value="17" />}
          {n >= 2 && (
            <Pop className="flex items-center gap-2 font-mono text-sm font-bold text-slate-600">
              <Chip className="bg-slate-100 text-slate-600">umur &gt;= 17</Chip>
              <span aria-hidden="true">→</span>
              <Chip className="bg-teal-100 text-teal-700">true</Chip>
            </Pop>
          )}
        </div>
        <Out lines={n >= 3 ? ["Boleh"] : []} />
      </Browser>
    ),
  },
  {
    title: "Array & perulangan",
    caption:
      "Array menyimpan banyak nilai dan indeksnya mulai dari 0. push menambah di akhir, length memberi jumlah elemen, dan for mengulang untuk tiap elemen.",
    duration: 10000,
    code: [
      'const buah = ["apel", "jeruk"];',
      'buah.push("mangga");',
      "for (let i = 0; i < buah.length; i++) {",
      "  console.log(buah[i]);",
      "}",
    ],
    render: (n) => (
      <Browser tab="Array">
        <div className="flex gap-2">
          {BUAH.map((b, i) =>
            (i < 2 && n >= 1) || (i === 2 && n >= 2) ? (
              <Pop key={b} className="text-center">
                <div className="rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2 font-mono text-sm font-black text-amber-800">{b}</div>
                <div className="mt-1 font-mono text-xs font-bold text-slate-400">[{i}]</div>
              </Pop>
            ) : null
          )}
        </div>
        <Out lines={n >= 4 ? BUAH : []} />
      </Browser>
    ),
  },
  {
    title: "File & modul",
    caption:
      "export membuka fungsi dari satu berkas, import memanggilnya dari berkas lain. Di HTML, berkas dimuat lewat <script src>, dan type=\"module\" mengaktifkan import dan export.",
    duration: 10000,
    code: [
      "// math.js",
      "export const tambah = (a, b) => a + b;",
      "// app.js",
      'import { tambah } from "./math.js";',
      "console.log(tambah(2, 3));",
    ],
    render: (n) => (
      <Browser tab="Modul">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <FileCard name="math.js" tag={n >= 2 ? "export tambah" : undefined} />
          <span aria-hidden="true" className="font-black text-amber-500">
            {n >= 4 ? "→" : ""}
          </span>
          <FileCard name="app.js" tag={n >= 4 ? "import tambah" : undefined} />
        </div>
        <Out lines={n >= 5 ? ["5"] : []} />
      </Browser>
    ),
  },
  {
    title: "Ringkasan",
    caption:
      "Kamu sudah melihat variabel, fungsi, kondisi, array, perulangan, dan modul. Saatnya berlatih lewat pelajaran di bawah.",
    duration: 6500,
    code: [
      "const let → variabel & tipe",
      "=> if else → fungsi & kondisi",
      "[ ] for → array & perulangan",
      "import export → file & modul",
    ],
    render: (n) => (
      <div className="grid gap-2 rounded-2xl border-2 border-slate-200 p-4">
        {RECAP.map(([tags, label], k) =>
          n >= k + 1 ? (
            <Pop key={tags} className="flex items-center gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 px-3 py-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-500 text-white">
                <Check />
              </span>
              <span className="text-sm font-black text-amber-700">{label}</span>
              <span className="ml-auto font-mono text-xs font-bold text-amber-600">{tags}</span>
            </Pop>
          ) : null
        )}
      </div>
    ),
  },
];
