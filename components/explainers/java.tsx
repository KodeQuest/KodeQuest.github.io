import type { Scene } from "./ExplainerPlayer";
import { Browser } from "./html";
import { Card, Cells, Out, Recap, Result, Var, makeTint } from "./kit";

const KEYWORDS = new Set([
  "public", "class", "static", "void", "int", "double", "boolean", "String", "if", "else", "for", "while", "break", "new", "return", "true", "false", "System",
]);

/** Warnai kode Java: kata kunci (biru), teks (kuning), angka (teal), komentar (abu). */
export const tintJava = makeTint(
  String.raw`\/\/.*|"[^"]*"?|\b(?:public|class|static|void|int|double|boolean|String|if|else|for|while|break|new|return|true|false|System)\b|\b\d+(?:\.\d+)?\b`,
  (t) => {
    if (t.startsWith("//")) return "text-slate-400";
    if (t.startsWith('"')) return "text-amber-300";
    if (KEYWORDS.has(t)) return "text-sky-300";
    if (/^\d/.test(t)) return "text-teal-300";
    return "";
  }
);

const ANGKA = ["1", "2", "3"];

const RECAP: [string, string][] = [
  ["class main()", "Struktur program"],
  ["int double boolean String", "Tipe data"],
  ["if else ==", "Kondisi"],
  ["for while break", "Perulangan"],
  ["int[] length", "Array"],
];

/** Video penjelasan Java: mengikuti 3 pelajaran di data/languages/java.json. */
export const javaScenes: Scene[] = [
  {
    title: "Struktur program",
    caption:
      "Semua kode Java berada di dalam class. Program berjalan dari method main(), dan berkasnya bernama sesuai kelas dengan ekstensi .java, misalnya Halo.java.",
    duration: 10000,
    code: ["public class Halo {", "  public static void main(String[] args) {", '    System.out.println("Halo");', "  }", "}"],
    render: (n) => (
      <Browser tab="Halo.java">
        <div className="space-y-2">
          {n >= 1 && <Card title="class Halo" note="berkas Halo.java" accent="rose" />}
          {n >= 2 && <Card title="  main()" note="titik masuk" accent="rose" />}
        </div>
        <Out lines={n >= 3 ? ["Halo"] : []} />
      </Browser>
    ),
  },
  {
    title: "Tipe data",
    caption:
      "Java mewajibkan tipe saat deklarasi: int (bulat), double (desimal), boolean (true atau false), dan String (teks, huruf S besar).",
    duration: 9500,
    code: ["int umur = 20;", "double tinggi = 1.7;", "boolean aktif = true;", 'String nama = "Sari";'],
    render: (n) => (
      <Browser tab="Memori">
        <div className="space-y-2">
          {n >= 1 && <Var name="umur" value="20" type="int" accent="rose" />}
          {n >= 2 && <Var name="tinggi" value="1.7" type="double" accent="rose" />}
          {n >= 3 && <Var name="aktif" value="true" type="boolean" accent="rose" />}
          {n >= 4 && <Var name="nama" value='"Sari"' type="String" accent="rose" />}
        </div>
      </Browser>
    ),
  },
  {
    title: "Kondisi",
    caption:
      "if-else memilih blok kode yang dijalankan. Bandingkan nilai dengan ==, dan jangan tertukar dengan =, karena itu untuk mengisi nilai.",
    duration: 9000,
    code: ["int nilai = 80;", "if (nilai >= 70) {", '  System.out.println("Lulus");', "} else {", '  System.out.println("Ulang");', "}"],
    render: (n) => (
      <Browser tab="Kondisi">
        <div className="space-y-2">
          {n >= 1 && <Var name="nilai" value="80" type="int" accent="rose" />}
          {n >= 2 && <Result expr="nilai >= 70" value="true" accent="rose" />}
        </div>
        <Out lines={n >= 3 ? ["Lulus"] : []} />
      </Browser>
    ),
  },
  {
    title: "Perulangan",
    caption: "for mengulang dengan awal, syarat, dan langkah. while mengulang selama kondisinya benar, dan break keluar dari perulangan.",
    duration: 8000,
    code: ["for (int i = 0; i < 3; i++) {", "  System.out.println(i);", "}"],
    render: (n) => (
      <Browser tab="Perulangan">
        <Out lines={n >= 3 ? ["0", "1", "2"] : []} />
      </Browser>
    ),
  },
  {
    title: "Array",
    caption:
      "Array menyimpan banyak nilai bertipe sama dengan ukuran tetap. Indeks mulai dari 0, dan angka.length memberi panjangnya, tanpa tanda kurung.",
    duration: 9500,
    code: ["int[] angka = {1, 2, 3};", "int n = angka.length;", "System.out.println(n);"],
    render: (n) => (
      <Browser tab="Array">
        <div className="space-y-3">
          {n >= 1 && <Cells items={ANGKA} accent="rose" />}
          {n >= 2 && <Var name="n" value="3" type="int" accent="rose" />}
        </div>
        <Out lines={n >= 3 ? ["3"] : []} />
      </Browser>
    ),
  },
  {
    title: "Ringkasan",
    caption: "Kamu sudah melihat struktur program, tipe data, kondisi, perulangan, dan array. Saatnya berlatih lewat pelajaran di bawah.",
    duration: 7000,
    code: ["class main() → struktur", "int double String → tipe data", "if else == → kondisi", "for while break → perulangan", "int[] length → array"],
    render: (n) => <Recap items={RECAP} n={n} accent="rose" />,
  },
];
