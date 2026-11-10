import type { Scene } from "./ExplainerPlayer";
import { Browser } from "./html";
import { Cells, Card, Out, Recap, Result, Var, makeTint } from "./kit";

const KEYWORDS = new Set(["def", "return", "if", "elif", "else", "for", "while", "in", "range", "print", "len", "append", "True", "False"]);

/** Warnai kode Python: kata kunci (biru), teks (kuning), angka (teal), komentar (abu). */
export const tintPython = makeTint(
  String.raw`#.*|"[^"]*"?|'[^']*'?|\b(?:def|return|if|elif|else|for|while|in|range|print|len|append|True|False)\b|\b\d+(?:\.\d+)?\b`,
  (t) => {
    if (t.startsWith("#")) return "text-slate-400";
    if (/^["']/.test(t)) return "text-amber-300";
    if (KEYWORDS.has(t)) return "text-sky-300";
    if (/^\d/.test(t)) return "text-teal-300";
    return "";
  }
);

const BUAH = ["apel", "jeruk"];

const RECAP: [string, string][] = [
  ["print() # =", "Dasar Python"],
  ["if elif else", "Kondisi"],
  ["for while range", "Perulangan"],
  ["def return", "Fungsi"],
  ["[ ] append len", "List"],
];

/** Video penjelasan Python: mengikuti 3 pelajaran di data/languages/python.json. */
export const pythonScenes: Scene[] = [
  {
    title: "Apa itu Python?",
    caption: "Python terkenal dengan sintaks yang ringkas dan mudah dibaca. Fungsi print() menampilkan teks ke layar.",
    duration: 6000,
    code: ['print("Halo, KodeQuest!")'],
    render: (n) => (
      <Browser tab="Terminal">
        <Out lines={n >= 1 ? ["Halo, KodeQuest!"] : []} />
      </Browser>
    ),
  },
  {
    title: "Variabel & tipe",
    caption:
      "Variabel dibuat dengan tanda =, tanpa kata kunci khusus. Tipe datanya: str (teks), int (bilangan bulat), dan float (desimal). Komentar diawali tanda #.",
    duration: 10000,
    code: ["# variabel", 'nama = "Budi"', "umur = 16", "tinggi = 1.7", "print(nama)"],
    render: (n) => (
      <Browser tab="Memori">
        <div className="space-y-2">
          {n >= 2 && <Var name="nama" value='"Budi"' type="str" accent="sky" />}
          {n >= 3 && <Var name="umur" value="16" type="int" accent="sky" />}
          {n >= 4 && <Var name="tinggi" value="1.7" type="float" accent="sky" />}
        </div>
        <Out lines={n >= 5 ? ["Budi"] : []} />
      </Browser>
    ),
  },
  {
    title: "Kondisi",
    caption:
      "if menjalankan blok kode bila kondisinya benar, elif dan else untuk cabang lain. Python menandai blok dengan indentasi, yaitu spasi di awal baris.",
    duration: 9000,
    code: ["umur = 17", "if umur >= 17:", '    print("Boleh")', "else:", '    print("Belum")'],
    render: (n) => (
      <Browser tab="Kondisi">
        <div className="space-y-2">
          {n >= 1 && <Var name="umur" value="17" type="int" accent="sky" />}
          {n >= 2 && <Result expr="umur >= 17" value="True" accent="sky" />}
        </div>
        <Out lines={n >= 3 ? ["Boleh"] : []} />
      </Browser>
    ),
  },
  {
    title: "Perulangan",
    caption: "for i in range(3) mengulang tiga kali dengan i bernilai 0, 1, lalu 2. while mengulang selama kondisinya masih benar.",
    duration: 7500,
    code: ["for i in range(3):", "    print(i)"],
    render: (n) => (
      <Browser tab="Perulangan">
        <Out lines={n >= 2 ? ["0", "1", "2"] : []} />
      </Browser>
    ),
  },
  {
    title: "Fungsi & list",
    caption:
      "def membuat fungsi dan return mengembalikan hasilnya. List menyimpan banyak nilai: append menambah di akhir, len memberi jumlah elemen, dan indeks mulai dari 0.",
    duration: 11000,
    code: ["def tambah(a, b):", "    return a + b", 'buah = ["apel"]', 'buah.append("jeruk")', "print(len(buah))"],
    render: (n) => (
      <Browser tab="Fungsi & list">
        <div className="space-y-2">
          {n >= 2 && <Card title="tambah(a, b)" note="a + b" accent="sky" />}
          {n >= 3 && <Cells items={n >= 4 ? BUAH : BUAH.slice(0, 1)} accent="sky" />}
        </div>
        <Out lines={n >= 5 ? ["2"] : []} />
      </Browser>
    ),
  },
  {
    title: "Ringkasan",
    caption: "Kamu sudah melihat dasar Python, kondisi, perulangan, fungsi, dan list. Saatnya berlatih lewat pelajaran di bawah.",
    duration: 7000,
    code: ["print() # = → dasar", "if elif else → kondisi", "for while range → perulangan", "def return → fungsi", "[ ] append len → list"],
    render: (n) => <Recap items={RECAP} n={n} accent="sky" />,
  },
];
