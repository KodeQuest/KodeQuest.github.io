import type { Scene } from "./ExplainerPlayer";
import { Browser } from "./html";
import { Card, Cells, Chip, Out, Recap, Result, Var, makeTint } from "./kit";

const KEYWORDS = new Set(["echo", "if", "else", "elseif", "for", "foreach", "while", "as", "function", "return", "count"]);

/** Warnai kode PHP: tag (ungu), variabel (teal), kata kunci (biru), teks (kuning), komentar (abu). */
export const tintPhp = makeTint(
  String.raw`<\?php|\?>|\/\/.*|\$\w+|"[^"]*"?|'[^']*'?|\b(?:echo|if|else|elseif|for|foreach|while|as|function|return|count)\b|\b\d+(?:\.\d+)?\b`,
  (t) => {
    if (t === "<?php" || t === "?>") return "text-fuchsia-300";
    if (t.startsWith("//")) return "text-slate-400";
    if (t.startsWith("$")) return "text-teal-300";
    if (/^["']/.test(t)) return "text-amber-300";
    if (KEYWORDS.has(t)) return "text-sky-300";
    if (/^\d/.test(t)) return "text-teal-300";
    return "";
  }
);

const BUAH = ["apel", "jeruk"];

const RECAP: [string, string][] = [
  ["<?php echo", "Dasar PHP"],
  ["$variabel .", "Variabel"],
  ["if elseif else", "Kondisi"],
  ["for while foreach", "Perulangan"],
  ["function [ ] count()", "Fungsi & array"],
];

/** Video penjelasan PHP: mengikuti 3 pelajaran di data/languages/php.json. */
export const phpScenes: Scene[] = [
  {
    title: "Apa itu PHP?",
    caption:
      "PHP berjalan di server dan hasilnya dikirim ke browser sebagai HTML. Kode PHP ditulis di antara <?php dan ?>, dan echo mencetak teks.",
    duration: 8500,
    code: ["<?php", '  echo "Halo";', "?>"],
    render: (n) => (
      <Browser tab="index.php">
        <div className="flex flex-wrap gap-2">
          {n >= 1 && <Chip className="bg-fuchsia-100 text-fuchsia-700">dijalankan di server</Chip>}
          {n >= 2 && <Chip className="bg-teal-100 text-teal-700">dikirim ke browser</Chip>}
        </div>
        <Out lines={n >= 2 ? ["Halo"] : []} label="Keluaran" />
      </Browser>
    ),
  },
  {
    title: "Variabel",
    caption: "Variabel PHP selalu diawali tanda $. Tanda titik (.) menyambung teks, dan setiap perintah diakhiri titik koma.",
    duration: 9000,
    code: ['$nama = "Budi";', "$umur = 20;", 'echo "Halo " . $nama;'],
    render: (n) => (
      <Browser tab="Memori">
        <div className="space-y-2">
          {n >= 1 && <Var name="$nama" value='"Budi"' accent="fuchsia" />}
          {n >= 2 && <Var name="$umur" value="20" accent="fuchsia" />}
        </div>
        <Out lines={n >= 3 ? ["Halo Budi"] : []} label="Keluaran" />
      </Browser>
    ),
  },
  {
    title: "Kondisi",
    caption:
      "if, elseif, dan else memilih blok kode yang dijalankan. === adalah perbandingan ketat: nilai dan tipenya harus sama.",
    duration: 9000,
    code: ["$umur = 17;", "if ($umur >= 17) {", '  echo "Boleh";', "} else {", '  echo "Tidak";', "}"],
    render: (n) => (
      <Browser tab="Kondisi">
        <div className="space-y-2">
          {n >= 1 && <Var name="$umur" value="17" accent="fuchsia" />}
          {n >= 2 && <Result expr="$umur >= 17" value="true" accent="fuchsia" />}
        </div>
        <Out lines={n >= 3 ? ["Boleh"] : []} label="Keluaran" />
      </Browser>
    ),
  },
  {
    title: "Perulangan",
    caption:
      "for mengulang dengan hitungan, while selama kondisinya benar, dan foreach ... as menelusuri isi sebuah array.",
    duration: 8000,
    code: ["for ($i = 0; $i < 3; $i++) {", "  echo $i;", "}"],
    render: (n) => (
      <Browser tab="Perulangan">
        <Out lines={n >= 3 ? ["012"] : []} label="Keluaran" />
      </Browser>
    ),
  },
  {
    title: "Fungsi & array",
    caption:
      "function membuat fungsi dan return mengembalikan nilai. Array ditulis dengan kurung siku, indeksnya mulai dari 0, dan count() menghitung elemennya.",
    duration: 11000,
    code: ["function tambah($a, $b) {", "  return $a + $b;", "}", '$buah = ["apel", "jeruk"];', "echo count($buah);"],
    render: (n) => (
      <Browser tab="Fungsi & array">
        <div className="space-y-2">
          {n >= 3 && <Card title="tambah($a, $b)" note="$a + $b" accent="fuchsia" />}
          {n >= 4 && <Cells items={BUAH} accent="fuchsia" />}
        </div>
        <Out lines={n >= 5 ? ["2"] : []} label="Keluaran" />
      </Browser>
    ),
  },
  {
    title: "Ringkasan",
    caption: "Kamu sudah melihat dasar PHP, variabel, kondisi, perulangan, fungsi, dan array. Saatnya berlatih lewat pelajaran di bawah.",
    duration: 7000,
    code: ["<?php echo → dasar PHP", "$variabel . → variabel", "if elseif else → kondisi", "for while foreach → perulangan", "function count() → fungsi & array"],
    render: (n) => <Recap items={RECAP} n={n} accent="fuchsia" />,
  },
];
