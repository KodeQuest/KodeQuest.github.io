import type { ReactNode } from "react";
import type { Scene } from "./ExplainerPlayer";

/** Warnai tag HTML (teal) dan nilai atribut (kuning) pada kode yang sedang diketik. */
export function tintHtml(code: string): ReactNode {
  return code.split(/(<[^>]*>?)/g).map((part, k) => {
    if (!part.startsWith("<")) return <span key={k}>{part}</span>;
    return (
      <span key={k} className="text-teal-300">
        {part.split(/("[^"]*"?)/g).map((seg, m) =>
          seg.startsWith('"') ? (
            <span key={m} className="text-amber-300">
              {seg}
            </span>
          ) : (
            <span key={m}>{seg}</span>
          )
        )}
      </span>
    );
  });
}

export function Pop({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`anim-pop ${className}`}>{children}</div>;
}

/** Bingkai jendela browser mini untuk menampilkan hasil kode. */
export function Browser({ tab, status, children }: { tab: string; status?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b-2 border-slate-100 bg-slate-50 px-3 py-2">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
        </span>
        <span className="ml-2 truncate rounded-lg bg-white px-3 py-1 text-xs font-bold text-slate-500">{tab}</span>
      </div>
      <div className="min-h-[11rem] p-4 text-indigo-950">{children}</div>
      {status && (
        <div className="border-t-2 border-slate-100 bg-slate-50 px-3 py-1 font-mono text-xs font-bold text-slate-500">{status}</div>
      )}
    </div>
  );
}

export function Check() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

const RECAP: [string, string][] = [
  ["<html>", "Kerangka halaman"],
  ["<h1> <p> <a>", "Teks & tautan"],
  ["<ul> <img>", "Daftar & gambar"],
  ["<form>", "Formulir"],
];

/** Video penjelasan HTML: mengikuti 4 pelajaran di data/languages/html.json. */
export const htmlScenes: Scene[] = [
  {
    title: "Apa itu HTML?",
    caption:
      "HTML (HyperText Markup Language) adalah bahasa penanda yang memberi struktur pada halaman web. Tag seperti <h1> dan <p> memberi tahu browser apa isi tiap bagian.",
    duration: 6000,
    code: ["<h1>Halo, KodeQuest!</h1>", "<p>Ini halaman pertamaku.</p>"],
    render: (n) => (
      <Browser tab="Halamanku">
        {n >= 1 && (
          <Pop>
            <h1 className="text-2xl font-black">Halo, KodeQuest!</h1>
          </Pop>
        )}
        {n >= 2 && (
          <Pop>
            <p className="mt-2 font-semibold text-slate-600">Ini halaman pertamaku.</p>
          </Pop>
        )}
      </Browser>
    ),
  },
  {
    title: "Struktur dasar",
    caption:
      "Dokumen HTML dimulai dari <!DOCTYPE html>, lalu <html> yang membungkus <head> (info halaman, termasuk title di tab) dan <body> (semua yang terlihat).",
    duration: 9000,
    code: [
      "<!DOCTYPE html>",
      "<html>",
      "  <head>",
      "    <title>Halo</title>",
      "  </head>",
      "  <body>",
      "    <p>Selamat belajar</p>",
      "  </body>",
      "</html>",
    ],
    render: (n) => (
      <Browser tab={n >= 4 ? "Halo" : "Tanpa judul"}>
        <div className="space-y-2 font-mono text-xs font-bold">
          {n >= 1 && (
            <Pop>
              <span className="inline-block rounded-lg bg-slate-100 px-2 py-1 text-slate-500">DOCTYPE · HTML5</span>
            </Pop>
          )}
          {n >= 2 && (
            <Pop>
              <div className="rounded-xl border-2 border-dashed border-teal-300 p-2">
                <span className="text-teal-600">html</span>
                <div className="mt-2 grid gap-2">
                  {n >= 3 && (
                    <Pop>
                      <div className="rounded-lg bg-indigo-50 p-2">
                        <span className="text-indigo-600">head</span>
                        {n >= 4 && (
                          <Pop>
                            <span className="mt-1 inline-block rounded-md bg-white px-2 py-0.5 text-slate-500">title: Halo</span>
                          </Pop>
                        )}
                      </div>
                    </Pop>
                  )}
                  {n >= 6 && (
                    <Pop>
                      <div className="rounded-lg bg-amber-50 p-2">
                        <span className="text-amber-600">body</span>
                        {n >= 7 && (
                          <Pop>
                            <p className="mt-1 font-sans text-sm font-semibold text-slate-700">Selamat belajar</p>
                          </Pop>
                        )}
                      </div>
                    </Pop>
                  )}
                </div>
              </div>
            </Pop>
          )}
        </div>
      </Browser>
    ),
  },
  {
    title: "Teks & tautan",
    caption:
      "<h1> untuk judul terbesar, <p> untuk paragraf, <strong> untuk penekanan, dan <a href> untuk tautan ke halaman lain.",
    duration: 7500,
    code: [
      "<h1>KodeQuest</h1>",
      "<p>Belajar <strong>ngoding</strong> seru.</p>",
      '<a href="https://github.com">Buka GitHub</a>',
    ],
    render: (n) => (
      <Browser tab="KodeQuest" status={n >= 3 ? "https://github.com" : undefined}>
        {n >= 1 && (
          <Pop>
            <h1 className="text-2xl font-black">KodeQuest</h1>
          </Pop>
        )}
        {n >= 2 && (
          <Pop>
            <p className="mt-2 font-semibold text-slate-600">
              Belajar <strong className="font-black text-indigo-950">ngoding</strong> seru.
            </p>
          </Pop>
        )}
        {n >= 3 && (
          <Pop>
            <span className="mt-3 inline-block font-bold text-indigo-600 underline">Buka GitHub</span>
          </Pop>
        )}
      </Browser>
    ),
  },
  {
    title: "Daftar & gambar",
    caption:
      "<ul> membuat daftar berbutir dengan <li> untuk tiap item. <img> menampilkan gambar lewat src, dan alt menjadi teks pengganti.",
    duration: 8000,
    code: ["<ul>", "  <li>HTML</li>", "  <li>CSS</li>", "</ul>", '<img src="kucing.png" alt="Kucing lucu">'],
    render: (n) => (
      <Browser tab="Daftar">
        <div className="flex items-start justify-between gap-4">
          <ul className="space-y-2 font-semibold">
            {n >= 2 && (
              <li>
                <Pop className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  HTML
                </Pop>
              </li>
            )}
            {n >= 3 && (
              <li>
                <Pop className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  CSS
                </Pop>
              </li>
            )}
          </ul>
          {n >= 5 && (
            <Pop className="text-center">
              <div className="grid h-20 w-24 place-items-center rounded-xl bg-teal-100">
                <svg viewBox="0 0 48 40" className="h-10 w-12 text-teal-500" fill="currentColor" aria-hidden="true">
                  <circle cx="35" cy="11" r="5" />
                  <path d="M2 36 17 14l9 12 6-8 14 18z" />
                </svg>
              </div>
              <p className="mt-1 text-xs font-bold text-slate-400">alt: Kucing lucu</p>
            </Pop>
          )}
        </div>
      </Browser>
    ),
  },
  {
    title: "Formulir",
    caption:
      "<form> mengumpulkan isian pengguna. <label> menjelaskan kolom, <input> menerima isian, dan <button type=\"submit\"> mengirimnya.",
    duration: 7500,
    code: [
      "<form>",
      '  <label for="nama">Nama</label>',
      '  <input id="nama" type="text">',
      '  <button type="submit">Kirim</button>',
      "</form>",
    ],
    render: (n) => (
      <Browser tab="Daftar">
        <div className="space-y-3">
          {n >= 2 && (
            <Pop>
              <span className="block text-xs font-extrabold uppercase tracking-wide text-slate-500">Nama</span>
            </Pop>
          )}
          {n >= 3 && (
            <Pop>
              <div className="rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-semibold text-slate-400">Ketik namamu…</div>
            </Pop>
          )}
          {n >= 4 && (
            <Pop>
              <span className="btn-3d inline-block rounded-xl bg-teal-500 px-5 py-2 text-xs font-black uppercase tracking-wide text-white shadow-[0_3px_0_#0f766e]">
                Kirim
              </span>
            </Pop>
          )}
        </div>
      </Browser>
    ),
  },
  {
    title: "Ringkasan",
    caption: "Kamu sudah melihat kerangka, teks, tautan, daftar, gambar, dan formulir. Saatnya berlatih lewat pelajaran di bawah.",
    duration: 6000,
    code: ["<html> → kerangka halaman", "<h1> <p> <a> → teks & tautan", "<ul> <img> → daftar & gambar", "<form> → formulir"],
    render: (n) => (
      <div className="grid gap-2 rounded-2xl border-2 border-slate-200 p-4">
        {RECAP.map(([tags, label], k) =>
          n >= k + 1 ? (
            <Pop key={tags} className="flex items-center gap-3 rounded-2xl border-2 border-teal-200 bg-teal-50 px-3 py-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal-500 text-white">
                <Check />
              </span>
              <span className="text-sm font-black text-teal-700">{label}</span>
              <span className="ml-auto font-mono text-xs font-bold text-teal-600">{tags}</span>
            </Pop>
          ) : null
        )}
      </div>
    ),
  },
];
