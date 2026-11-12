// Menambal JSCPP agar input bisa diminta secara interaktif (tanpa membaca seluruh stdin di awal).
// Dipanggil oleh scripts/build-cpp-worker.sh sebelum bundling. Gagal keras bila pola tidak ditemukan.
//
// Kontrak: bila config.stdio.more tersedia, JSCPP memanggilnya saat buffer input habis.
// more() mengembalikan teks baru (satu baris + "\n") atau melempar error untuk menghentikan program
// sambil menunggu masukan pemain.
const fs = require("fs");
const path = require("path");

const lib = path.join(process.argv[2], "node_modules", "JSCPP", "lib", "includes");

function patch(file, edits) {
  const p = path.join(lib, file);
  let s = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
  for (const [from, to, count] of edits) {
    const parts = s.split(from);
    if (parts.length - 1 !== count) throw new Error(`${file}: pola "${from.slice(0, 40)}" ditemukan ${parts.length - 1}x, seharusnya ${count}x`);
    s = parts.join(to);
  }
  fs.writeFileSync(p, s);
}

// iostream (cin): sebelum tiap pembacaan, pastikan buffer berisi data bila sumbernya interaktif.
patch("iostream.js", [
  [
    '"use strict";',
    '"use strict";\nconst __kqBuf = function (rt, _cin, needToken) {\n    const more = rt.config.stdio.more;\n    if (more) {\n        while (needToken ? /^\\s*$/.test(_cin.v.buf) : _cin.v.buf.length === 0) {\n            _cin.v.buf += more();\n        }\n    }\n    return _cin.v.buf;\n};',
    1,
  ],
  // operator >> (angka, char, bool) dan >> ke char[]: butuh token
  ["let b = _cin.v.buf;", "let b = __kqBuf(rt, _cin, true);", 2],
  // getline dan get: cukup butuh satu karakter
  ["const b = _cin.v.buf;", "const b = __kqBuf(rt, _cin, false);", 2],
]);

// cstdio (scanf, getchar, gets): sumber input yang sama.
patch("cstdio.js", [
  [
    "let input_stream = stdio.drain();",
    "let input_stream = stdio.drain();\n        const __kqMore = function (needToken) {\n            if (stdio.more) {\n                while (needToken ? /^\\s*$/.test(input_stream) : input_stream.length === 0) {\n                    input_stream += stdio.more();\n                }\n            }\n        };",
    1,
  ],
  ["let char_return = \"\";", "let char_return = \"\";\n            __kqMore(false);", 1],
  ["let retval;\n            const next_line_break", "let retval;\n            __kqMore(false);\n            const next_line_break", 1],
  ["let tmp = input_stream;", "__kqMore(true);\n            let tmp = input_stream;", 1],
]);
console.log("OK: JSCPP ditambal untuk input interaktif");
