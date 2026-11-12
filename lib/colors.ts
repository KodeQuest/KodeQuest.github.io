/** Nama warna CSS yang umum dipakai di materi, beserta nilai hex 6 digitnya. */
const NAMED: Record<string, string> = {
  black: "000000", white: "ffffff", red: "ff0000", lime: "00ff00", blue: "0000ff", yellow: "ffff00",
  cyan: "00ffff", aqua: "00ffff", magenta: "ff00ff", fuchsia: "ff00ff", silver: "c0c0c0", gray: "808080",
  grey: "808080", maroon: "800000", olive: "808000", green: "008000", purple: "800080", teal: "008080",
  navy: "000080", orange: "ffa500", pink: "ffc0cb", brown: "a52a2a", gold: "ffd700", indigo: "4b0082",
  violet: "ee82ee", coral: "ff7f50", crimson: "dc143c", tomato: "ff6347", salmon: "fa8072",
  skyblue: "87ceeb", lightblue: "add8e6", lightgreen: "90ee90", lightgray: "d3d3d3", lightgrey: "d3d3d3",
  darkgray: "a9a9a9", darkgrey: "a9a9a9", darkblue: "00008b", darkgreen: "006400", darkred: "8b0000",
  orchid: "da70d6", turquoise: "40e0d0", tan: "d2b48c", beige: "f5f5dc", ivory: "fffff0", khaki: "f0e68c",
  lavender: "e6e6fa", plum: "dda0dd", chocolate: "d2691e",
};

const NAME_RE = new RegExp(`(?<=[:\\s,(])(${Object.keys(NAMED).join("|")})(?=[;}\\s,)]|$)`, "gi");
const HEX_RE = /#([0-9a-f]{6}|[0-9a-f]{3})(?![\w-])/gi;

/**
 * Samakan penulisan warna agar jawaban dinilai sama: `red`, `#f00`, dan `#ff0000` semuanya menjadi `#ff0000`.
 * Nama warna hanya diganti di posisi nilai (setelah `:`, spasi, koma, atau `(`), jadi selektor seperti `.red` tidak ikut berubah.
 * Dipanggil pada teks yang sudah dinormalkan spasinya (lihat normalizeTyped).
 */
export function canonColors(text: string): string {
  return text
    .replace(HEX_RE, (_, h: string) => {
      const x = h.toLowerCase();
      return "#" + (x.length === 3 ? x.replace(/./g, (c) => c + c) : x);
    })
    .replace(NAME_RE, (n) => "#" + NAMED[n.toLowerCase()]);
}
