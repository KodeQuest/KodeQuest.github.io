import type { Scene } from "./ExplainerPlayer";
import { Browser, Pop } from "./html";
import { Chip, Out, Recap, Result, Var, makeTint } from "./kit";

const KEYWORDS = new Set(["function", "return", "const", "let", "useState", "useEffect", "map", "console"]);

/** Warnai kode React/JSX: tag (teal-cyan), kata kunci (biru), teks (kuning), angka (teal), komentar (abu). */
export const tintReact = makeTint(
  String.raw`\/\/.*|"[^"]*"?|'[^']*'?|<\/?[A-Za-z][A-Za-z0-9]*|\b(?:function|return|const|let|useState|useEffect|map|console)\b|\b\d+\b`,
  (t) => {
    if (t.startsWith("//")) return "text-slate-400";
    if (/^["']/.test(t)) return "text-amber-300";
    if (/^<\/?[A-Za-z]/.test(t)) return "text-cyan-300";
    if (KEYWORDS.has(t)) return "text-sky-300";
    if (/^\d/.test(t)) return "text-teal-300";
    return "";
  }
);

const BUAH = ["apel", "jeruk"];

const RECAP: [string, string][] = [
  ["function JSX", "Komponen & JSX"],
  ["props", "Props"],
  ["useState onClick", "State"],
  ["useEffect [ ]", "Efek"],
  ["map key &&", "Daftar"],
];

/** Video penjelasan React: mengikuti 3 pelajaran di data/languages/react.json. */
export const reactScenes: Scene[] = [
  {
    title: "Komponen & JSX",
    caption:
      "Komponen adalah fungsi yang namanya diawali huruf besar dan mengembalikan JSX, sintaks mirip HTML di dalam JavaScript. Nilai disisipkan dengan {kurung kurawal}, dan class ditulis className.",
    duration: 10000,
    code: ["function Halo() {", "  return <h1>Halo</h1>;", "}"],
    render: (n) => (
      <Browser tab="Halaman">
        {n >= 3 ? (
          <Pop>
            <h1 className="text-2xl font-black text-indigo-950">Halo</h1>
          </Pop>
        ) : (
          <p className="text-sm font-bold text-slate-400">Komponen belum dibuat…</p>
        )}
      </Browser>
    ),
  },
  {
    title: "Props",
    caption:
      "Props mengirim data dari komponen induk ke komponen anak lewat atribut, seperti nama=\"Ani\". Di dalam anak, datanya dibaca dari props.nama dan tidak boleh diubah.",
    duration: 10000,
    code: ["function Sapa(props) {", "  return <p>Halo, {props.nama}</p>;", "}", '<Sapa nama="Ani" />'],
    render: (n) => (
      <Browser tab="Halaman">
        <div className="space-y-2">
          {n >= 3 && <Result expr="<Sapa />" value="komponen" accent="cyan" />}
          {n >= 4 && <Result expr='nama="Ani"' value="props.nama" accent="cyan" />}
        </div>
        {n >= 4 && (
          <Pop className="mt-3 rounded-xl border-2 border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-700">Halo, Ani</Pop>
        )}
      </Browser>
    ),
  },
  {
    title: "State",
    caption:
      "useState menyimpan data yang bisa berubah, berupa pasangan [nilai, pengubah]. Memanggil setHitung membuat komponen dirender ulang. Event seperti onClick ditulis camelCase.",
    duration: 10000,
    code: ["const [hitung, setHitung] = useState(0);", "<button onClick={tambah}>+</button>"],
    render: (n) => (
      <Browser tab="Halaman">
        <div className="space-y-2">
          {n >= 1 && <Var name="hitung" value="0" type="state" accent="cyan" />}
          {n >= 2 && (
            <Pop className="flex items-center gap-3">
              <span className="rounded-xl border-2 border-slate-200 bg-white px-4 py-1.5 font-black text-indigo-950">+</span>
              <Chip className="bg-cyan-100 text-cyan-700">onClick → tambah()</Chip>
            </Pop>
          )}
        </div>
      </Browser>
    ),
  },
  {
    title: "Efek",
    caption:
      "useEffect menjalankan efek samping, misalnya mengambil data, setelah komponen tampil. Array dependensi [] membuatnya hanya berjalan sekali.",
    duration: 8500,
    code: ["useEffect(() => {", '  console.log("Siap");', "}, []);"],
    render: (n) => (
      <Browser tab="Halaman">
        {n >= 3 && <Chip className="bg-cyan-100 text-cyan-700">[] = sekali saja</Chip>}
        <Out lines={n >= 3 ? ["Siap"] : []} label="Konsol" />
      </Browser>
    ),
  },
  {
    title: "Daftar",
    caption:
      "map mengubah array menjadi daftar elemen, dan setiap item butuh prop key yang unik. Operator && menampilkan elemen hanya bila kondisinya benar.",
    duration: 10000,
    code: ['const buah = ["apel", "jeruk"];', "{buah.map(b => (", "  <li key={b}>{b}</li>", "))}"],
    render: (n) => (
      <Browser tab="Halaman">
        {n >= 4 ? (
          <ul className="space-y-1.5">
            {BUAH.map((b) => (
              <Pop key={b} className="flex items-center gap-2 font-bold text-indigo-950">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cyan-500" />
                {b}
                <Chip className="ml-auto bg-cyan-100 text-cyan-700">key={b}</Chip>
              </Pop>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-bold text-slate-400">Daftar belum dirender…</p>
        )}
      </Browser>
    ),
  },
  {
    title: "Ringkasan",
    caption: "Kamu sudah melihat komponen, props, state, efek, dan daftar. Saatnya berlatih lewat pelajaran di bawah.",
    duration: 7000,
    code: ["function JSX → komponen", "props → kirim data", "useState onClick → state", "useEffect [ ] → efek", "map key && → daftar"],
    render: (n) => <Recap items={RECAP} n={n} accent="cyan" />,
  },
];
