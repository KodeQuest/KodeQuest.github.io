import type { OrderQuestion } from "./data";

/** Rapikan spasi di sekitar tanda baca CSS agar "a:b" dan "a: b" dianggap sama. */
const squash = (s: string) => s.replace(/\s+/g, " ").replace(/\s*([{}:;])\s*/g, "$1").trim();

type CssRule = { selector: string; decls: string[] };

/**
 * Baca susunan potongan sebagai satu aturan CSS, mis. `.kelas { background-color: white; color: black; }`.
 * Mengembalikan null bila bukan aturan CSS sederhana, atau bila ada properti yang muncul dua kali
 * (urutan bisa berpengaruh pada hasil, jadi tetap dinilai ketat).
 */
function parseRule(pieces: string[]): CssRule | null {
  const m = /^([^{}]+)\{([^{}]*)\}$/.exec(squash(pieces.join(" ")));
  if (!m) return null;
  const decls = m[2].split(";").filter((d) => d !== "");
  if (decls.length < 2) return null;
  const props = decls.map((d) => /^([a-z-]+):./i.exec(d)?.[1]?.toLowerCase());
  if (props.some((p) => !p) || new Set(props).size !== props.length) return null;
  return { selector: m[1].trim(), decls: decls.slice().sort() };
}

/**
 * Menilai soal "susun kode".
 * Susunan harus sama persis dengan `pieces`, KECUALI untuk aturan CSS:
 * urutan deklarasi di dalam { } (mis. background-color dan color) boleh tertukar.
 */
export function isOrderAnswerCorrect(q: OrderQuestion, answer: string[]): boolean {
  if (answer.length === q.pieces.length && answer.every((t, i) => t === q.pieces[i])) return true;
  const want = parseRule(q.pieces);
  const got = parseRule(answer);
  return !!want && !!got && want.selector === got.selector && want.decls.length === got.decls.length && want.decls.every((d, i) => d === got.decls[i]);
}
