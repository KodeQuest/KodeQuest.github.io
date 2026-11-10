import type { Scene } from "./ExplainerPlayer";
import { Browser } from "./html";
import { Card, Chip, Out, Recap, Result, Var, makeTint } from "./kit";

const KEYWORDS = new Set(["int", "double", "void", "return", "if", "else", "for", "while", "std", "string", "cout", "cin", "endl", "main"]);

/** Warnai kode C++: kata kunci (biru), header (ungu), teks (kuning), angka (teal), komentar (abu). */
export const tintCpp = makeTint(
  String.raw`\/\/.*|#include|<iostream>|"[^"]*"?|\b(?:int|double|void|return|if|else|for|while|std|string|cout|cin|endl|main)\b|\b\d+(?:\.\d+)?\b`,
  (t) => {
    if (t.startsWith("//")) return "text-slate-400";
    if (t === "#include" || t === "<iostream>") return "text-fuchsia-300";
    if (t.startsWith('"')) return "text-amber-300";
    if (KEYWORDS.has(t)) return "text-sky-300";
    if (/^\d/.test(t)) return "text-teal-300";
    return "";
  }
);

const RECAP: [string, string][] = [
  ["#include main()", "Struktur program"],
  ["int double string cin", "Variabel & input"],
  ["if else", "Kondisi"],
  ["for while", "Perulangan"],
  ["int tambah() void", "Fungsi"],
];

/** Video penjelasan C++: mengikuti 3 pelajaran di data/languages/cpp.json. */
export const cppScenes: Scene[] = [
  {
    title: "Struktur program",
    caption:
      "Program C++ dimulai dari fungsi main(). #include <iostream> memuat cout untuk mencetak ke layar, dan setiap perintah diakhiri titik koma.",
    duration: 10000,
    code: ["#include <iostream>", "int main() {", '  std::cout << "Halo" << std::endl;', "  return 0;", "}"],
    render: (n) => (
      <Browser tab="main.cpp">
        <div className="flex flex-wrap gap-2">
          {n >= 1 && (
            <Chip className="bg-fuchsia-100 text-fuchsia-700">header iostream</Chip>
          )}
          {n >= 2 && <Chip className="bg-violet-100 text-violet-700">main()</Chip>}
          {n >= 4 && <Chip className="bg-teal-100 text-teal-700">return 0 = sukses</Chip>}
        </div>
        <Out lines={n >= 3 ? ["Halo"] : []} />
      </Browser>
    ),
  },
  {
    title: "Variabel & input",
    caption:
      "C++ meminta tipe saat deklarasi: int (bulat), double (desimal), dan std::string (teks). std::cin >> x membaca input keyboard ke variabel x.",
    duration: 10000,
    code: ["int umur = 20;", 'std::string nama = "Ani";', "double tinggi = 1.7;", "std::cin >> umur;"],
    render: (n) => (
      <Browser tab="Memori">
        <div className="space-y-2">
          {n >= 1 && <Var name="umur" value="20" type="int" accent="violet" />}
          {n >= 2 && <Var name="nama" value='"Ani"' type="string" accent="violet" />}
          {n >= 3 && <Var name="tinggi" value="1.7" type="double" accent="violet" />}
          {n >= 4 && <Result expr="cin >> umur" value="baca keyboard" accent="violet" />}
        </div>
      </Browser>
    ),
  },
  {
    title: "Kondisi",
    caption: "if (kondisi) { ... } else { ... } memilih blok yang dijalankan. Kondisi selalu ditulis di dalam tanda kurung.",
    duration: 9000,
    code: ["int x = 5;", "if (x > 0) {", '  std::cout << "Positif";', "} else {", '  std::cout << "Bukan";', "}"],
    render: (n) => (
      <Browser tab="Kondisi">
        <div className="space-y-2">
          {n >= 1 && <Var name="x" value="5" type="int" accent="violet" />}
          {n >= 2 && <Result expr="x > 0" value="true" accent="violet" />}
        </div>
        <Out lines={n >= 3 ? ["Positif"] : []} />
      </Browser>
    ),
  },
  {
    title: "Perulangan",
    caption:
      "for punya tiga bagian: awal (int i = 0), syarat (i < 3), dan langkah (i++). while mengulang selama kondisinya benar.",
    duration: 8000,
    code: ["for (int i = 0; i < 3; i++) {", "  std::cout << i;", "}"],
    render: (n) => (
      <Browser tab="Perulangan">
        <Out lines={n >= 3 ? ["012"] : []} />
      </Browser>
    ),
  },
  {
    title: "Fungsi",
    caption:
      "Fungsi punya tipe kembalian, nama, dan parameter. void berarti tidak mengembalikan nilai. Ingat: pembagian dua int menghasilkan int, jadi 10 / 3 = 3.",
    duration: 10000,
    code: ["int tambah(int a, int b) {", "  return a + b;", "}", "void sapa() { }"],
    render: (n) => (
      <Browser tab="Fungsi">
        <div className="space-y-2">
          {n >= 3 && <Card title="tambah(int a, int b)" note="→ int" accent="violet" />}
          {n >= 4 && <Card title="sapa()" note="→ void" accent="violet" />}
        </div>
      </Browser>
    ),
  },
  {
    title: "Ringkasan",
    caption: "Kamu sudah melihat struktur program, variabel, kondisi, perulangan, dan fungsi. Saatnya berlatih lewat pelajaran di bawah.",
    duration: 7000,
    code: ["#include main() → struktur", "int double cin → variabel & input", "if else → kondisi", "for while → perulangan", "int tambah() void → fungsi"],
    render: (n) => <Recap items={RECAP} n={n} accent="violet" />,
  },
];
