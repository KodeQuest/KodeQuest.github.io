import type { ReactNode } from "react";
import type { Scene } from "./ExplainerPlayer";
import { Browser, Check, Pop } from "./html";

const KEYWORDS = new Set(["SELECT", "FROM", "WHERE", "ORDER", "BY", "DESC", "ASC", "LIMIT", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "AND", "OR", "COUNT"]);
const TOKEN = /('[^']*'?|\b\d+\b|\b(?:SELECT|FROM|WHERE|ORDER|BY|DESC|ASC|LIMIT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|AND|OR|COUNT)\b)/i;

/** Warnai query SQL yang sedang diketik: kata kunci (biru), teks (kuning), angka (teal). */
export function tintMysql(code: string): ReactNode {
  return code.split(TOKEN).map((part, k) => {
    if (!part) return null;
    let cls = "";
    if (part.startsWith("'")) cls = "text-amber-300";
    else if (KEYWORDS.has(part.toUpperCase())) cls = "text-sky-300";
    else if (/^\d+$/.test(part)) cls = "text-teal-300";
    return cls ? (
      <span key={k} className={cls}>
        {part}
      </span>
    ) : (
      <span key={k}>{part}</span>
    );
  });
}

type Row = { id: number; nama: string; umur: number };

const DATA: Row[] = [
  { id: 1, nama: "Budi", umur: 17 },
  { id: 2, nama: "Sari", umur: 16 },
  { id: 3, nama: "Andi", umur: 18 },
  { id: 4, nama: "Rina", umur: 17 },
];

function Tabel({ cols, rows, mark }: { cols: (keyof Row)[]; rows: Row[]; mark?: (r: Row) => boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-slate-200 text-sm font-semibold">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
            {cols.map((c) => (
              <th key={c} className="px-3 py-2">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={`border-t-2 border-slate-100 transition-colors duration-300 ${mark?.(r) ? "bg-orange-100" : ""}`}>
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 text-indigo-950">
                  {r[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Waiting() {
  return (
    <div className="grid min-h-[8rem] place-items-center rounded-xl border-2 border-dashed border-slate-200 text-sm font-bold text-slate-400">
      Menunggu query…
    </div>
  );
}

const RECAP: [string, string][] = [
  ["SELECT FROM", "Ambil data"],
  ["WHERE ORDER BY", "Filter & urutan"],
  ["INSERT UPDATE DELETE", "Ubah data"],
  ["COUNT(*)", "Fungsi"],
];

/** Video penjelasan MySQL: mengikuti 3 pelajaran di data/languages/mysql.json. */
export const mysqlScenes: Scene[] = [
  {
    title: "Apa itu MySQL?",
    caption:
      "MySQL adalah sistem basis data: data disimpan dalam tabel berisi baris dan kolom, lalu diambil dengan bahasa SQL. Tabel contoh kita bernama siswa.",
    duration: 6500,
    code: ["SELECT * FROM siswa;"],
    render: (n) => (
      <Browser tab="MySQL · siswa" status={n >= 1 ? `${DATA.length} baris` : undefined}>
        {n >= 1 ? <Tabel cols={["id", "nama", "umur"]} rows={DATA} /> : <Waiting />}
      </Browser>
    ),
  },
  {
    title: "SELECT dasar",
    caption:
      "SELECT memilih kolom (tanda * berarti semua kolom), FROM menentukan tabel, dan LIMIT membatasi jumlah baris yang dikembalikan.",
    duration: 8500,
    code: ["SELECT nama, umur", "FROM siswa", "LIMIT 2;"],
    render: (n) => {
      const rows = n >= 3 ? DATA.slice(0, 2) : DATA;
      return (
        <Browser tab="MySQL · siswa" status={n >= 2 ? `${rows.length} baris` : undefined}>
          {n >= 2 ? <Tabel cols={["nama", "umur"]} rows={rows} /> : <Waiting />}
        </Browser>
      );
    },
  },
  {
    title: "Filter & urutan",
    caption:
      "WHERE menyaring baris, AND dan OR menggabungkan kondisi, dan ORDER BY mengurutkan hasil. DESC berarti dari yang terbesar.",
    duration: 9000,
    code: ["SELECT * FROM siswa", "WHERE umur > 16", "ORDER BY umur DESC;"],
    render: (n) => {
      let rows = DATA;
      if (n >= 2) rows = rows.filter((r) => r.umur > 16);
      if (n >= 3) rows = [...rows].sort((a, b) => b.umur - a.umur);
      return (
        <Browser tab="MySQL · siswa" status={n >= 1 ? `${rows.length} baris` : undefined}>
          {n >= 1 ? <Tabel cols={["id", "nama", "umur"]} rows={rows} /> : <Waiting />}
        </Browser>
      );
    },
  },
  {
    title: "Tambah & ubah data",
    caption:
      "INSERT INTO menambah baris baru, sedangkan UPDATE ... SET mengubah data yang sudah ada. Selalu pakai WHERE agar hanya baris yang dituju yang berubah.",
    duration: 9500,
    code: ["INSERT INTO siswa (nama, umur)", "VALUES ('Dewi', 17);", "UPDATE siswa SET umur = 19", "WHERE id = 1;"],
    render: (n) => {
      let rows: Row[] = DATA;
      if (n >= 2) rows = [...rows, { id: 5, nama: "Dewi", umur: 17 }];
      if (n >= 4) rows = rows.map((r) => (r.id === 1 ? { ...r, umur: 19 } : r));
      return (
        <Browser tab="MySQL · siswa" status={`${rows.length} baris`}>
          <Tabel cols={["id", "nama", "umur"]} rows={rows} mark={(r) => (n >= 4 && r.id === 1) || (n >= 2 && n < 4 && r.id === 5)} />
        </Browser>
      );
    },
  },
  {
    title: "Hapus & hitung",
    caption:
      "DELETE FROM menghapus baris yang cocok dengan WHERE. COUNT(*) menghitung jumlah baris di tabel.",
    duration: 8000,
    code: ["DELETE FROM siswa", "WHERE id = 3;", "SELECT COUNT(*) FROM siswa;"],
    render: (n) => {
      const base: Row[] = [
        { id: 1, nama: "Budi", umur: 19 },
        { id: 2, nama: "Sari", umur: 16 },
        { id: 3, nama: "Andi", umur: 18 },
        { id: 4, nama: "Rina", umur: 17 },
        { id: 5, nama: "Dewi", umur: 17 },
      ];
      const rows = n >= 2 ? base.filter((r) => r.id !== 3) : base;
      return (
        <Browser tab="MySQL · siswa" status={`${rows.length} baris`}>
          <div className="space-y-3">
            <Tabel cols={["id", "nama", "umur"]} rows={rows} mark={(r) => n < 2 && r.id === 3} />
            {n >= 3 && (
              <Pop className="flex items-center gap-2 font-mono text-sm font-bold text-slate-600">
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black">COUNT(*)</span>
                <span aria-hidden="true">→</span>
                <span className="rounded-lg bg-orange-100 px-2 py-1 text-xs font-black text-orange-700">{rows.length}</span>
              </Pop>
            )}
          </div>
        </Browser>
      );
    },
  },
  {
    title: "Ringkasan",
    caption: "Kamu sudah melihat cara mengambil, menyaring, mengubah, dan menghitung data. Saatnya berlatih lewat pelajaran di bawah.",
    duration: 6000,
    code: ["SELECT FROM → ambil data", "WHERE ORDER BY → filter & urutan", "INSERT UPDATE DELETE → ubah data", "COUNT(*) → fungsi"],
    render: (n) => (
      <div className="grid gap-2 rounded-2xl border-2 border-slate-200 p-4">
        {RECAP.map(([tags, label], k) =>
          n >= k + 1 ? (
            <Pop key={tags} className="flex items-center gap-3 rounded-2xl border-2 border-orange-200 bg-orange-50 px-3 py-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-500 text-white">
                <Check />
              </span>
              <span className="text-sm font-black text-orange-700">{label}</span>
              <span className="ml-auto font-mono text-xs font-bold text-orange-600">{tags}</span>
            </Pop>
          ) : null
        )}
      </div>
    ),
  },
];
