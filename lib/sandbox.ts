import { fixHashColors } from "./colors";

/** Pengaturan dan pembantu untuk halaman /sandbox. */

export type SandboxTab = "web" | "python" | "cpp" | "mysql";
export type WebFile = "html" | "css" | "js";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Lokasi worker (file statis di public/vendor), memperhitungkan base path GitHub Pages. */
export const PY_WORKER_URL = `${BASE_PATH}/vendor/py-worker.js`;
export const CPP_WORKER_URL = `${BASE_PATH}/vendor/cpp-worker.js`;
export const SQL_WORKER_URL = `${BASE_PATH}/vendor/sql-worker.js`;

/** Runtime Python (Pyodide) diunduh dari CDN npm jsDelivr, versi dikunci agar perilaku stabil. */
export const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/npm/pyodide@314.0.7/";

/** Mesin SQL untuk tab MySQL: sql.js (SQLite WebAssembly) dari CDN npm jsDelivr, versi dikunci. */
export const SQLJS_INDEX_URL = "https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/";

export const STARTERS: Record<WebFile | "python" | "cpp" | "mysql", string> = {
  html: `<h1>Halo, KodeQuest!</h1>
<p id="pesan">Klik tombol di bawah.</p>
<button id="tombol">Sapa aku</button>
`,
  css: `h1 {
  color: #4f46e5;
}

button {
  padding: 8px 16px;
  border: 0;
  border-radius: 10px;
  background: #4f46e5;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
`,
  js: `const pesan = document.getElementById("pesan");
const tombol = document.getElementById("tombol");

console.log("Skrip berjalan");

tombol.addEventListener("click", () => {
  pesan.textContent = "Halo juga!";
  console.log("Tombol diklik");
});
`,
  python: `nama = input("Siapa namamu? ")

for i in range(3):
    print(f"{i + 1}. Halo, {nama}!")
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    char nama[30];
    cout << "Siapa namamu? ";
    cin >> nama;

    for (int i = 1; i <= 3; i++) {
        cout << i << ". Halo, " << nama << "!" << endl;
    }
    return 0;
}
`,
  mysql: `CREATE DATABASE sekolah;
USE sekolah;

CREATE TABLE siswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(50) NOT NULL,
  umur INT
);

INSERT INTO siswa (nama, umur) VALUES
  ('Budi', 16),
  ('Sari', 17),
  ('Andi', 16);

SELECT * FROM siswa WHERE umur = 16;
`,
};

/** Gaya dasar dokumen pratinjau (selaras dengan lib/live.ts). */
const PREVIEW_BASE = "body{margin:8px;font:15px/1.4 system-ui,sans-serif;color:#1e1b4b;background:#fff}";

/**
 * Skrip penangkap di dalam iframe: console.log/info/warn/error, error tak tertangkap, dan promise yang ditolak
 * dikirim ke halaman induk lewat postMessage. `__OFF__` diganti jumlah baris sebelum kode pemain
 * supaya nomor baris error sesuai editor.
 */
const CAPTURE = `(function(){var id=__ID__,off=__OFF__,n=0;function fmt(v){if(typeof v==="string")return v;if(v instanceof Error)return v.name+": "+v.message;try{var j=JSON.stringify(v);return j===undefined?String(v):j}catch(e){return String(v)}}function send(l,t){if(n++>300)return;parent.postMessage({kq:id,level:l,text:String(t).slice(0,2000)},"*")}["log","info","warn","error"].forEach(function(l){var o=console[l];console[l]=function(){send(l,[].map.call(arguments,fmt).join(" "));try{o.apply(console,arguments)}catch(e){}}});window.addEventListener("error",function(e){var ln=e.lineno-off;send("error",(e.message||"Error")+(ln>0?" (baris "+ln+")":""))});window.addEventListener("unhandledrejection",function(e){var r=e.reason;send("error","Promise ditolak: "+(r&&r.message?r.message:fmt(r)))})})();`;

/** Susun dokumen pratinjau dari tiga file. `id` dipakai untuk menyaring pesan milik pratinjau yang sedang tampil. */
export function buildWebDoc(html: string, css: string, js: string, id: number): string {
  const safeJs = js.replace(/<\/script/gi, "<\\/script");
  const pre = `<!doctype html><html><head><meta charset="utf-8"><script>${CAPTURE.replace("__ID__", String(id))}</script><style>${PREVIEW_BASE}</style><style>${fixHashColors(css)}</style></head><body>\n${html}\n`;
  const marker = "<script>\n";
  const off = (pre + marker).split("\n").length - 1;
  const head = pre.replace("off=__OFF__", `off=${off}`);
  return `${head}${marker}${safeJs}\n</script></body></html>`;
}

export type ConsoleLevel = "log" | "info" | "warn" | "error";
export type ConsoleLine = { level: ConsoleLevel; text: string };

const KEY = (name: string) => `kq-sandbox:v1:${name}`;

/** Baca kode tersimpan; null bila tidak ada atau penyimpanan tidak tersedia. */
export function loadSaved(name: string): string | null {
  try {
    return localStorage.getItem(KEY(name));
  } catch {
    return null;
  }
}

export function saveCode(name: string, value: string) {
  try {
    localStorage.setItem(KEY(name), value);
  } catch {
    /* penyimpanan penuh atau dimatikan: abaikan */
  }
}

export function clearSaved(names: string[]) {
  try {
    for (const n of names) localStorage.removeItem(KEY(n));
  } catch {
    /* abaikan */
  }
}
