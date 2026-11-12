// Sumber worker C++ untuk /sandbox. Dibundel menjadi public/vendor/cpp-worker.js oleh scripts/build-cpp-worker.sh
// Mesin: JSCPP (interpreter C++ berbasis JavaScript), ditambal oleh scripts/patch-jscpp.js agar input interaktif.
// Mendukung subset C++: iostream, cmath, cstdio, cstdlib, cstring, cctype, ctime, iomanip.
// Tidak mendukung std::string dan STL (vector, map, dll).
//
// Pesan masuk : {type:"init"} | {type:"run", id, code, inputs:string[]}
// Pesan keluar: {type:"stage"} | {type:"ready"} | {type:"fatal", message}
//               {type:"out", id, text, stream:"out"|"in"} | {type:"need-input", id}
//               {type:"done", id, exit} | {type:"error", id, message}
//
// Input interaktif: program dijalankan ulang dari awal tiap pemain mengirim satu baris. `inputs` berisi semua baris
// yang sudah dikirim. Saat program meminta baris berikutnya yang belum ada, worker menghentikannya dan
// mengirim `need-input`. Baris yang dikonsumsi dikirim sebagai `in` agar tampil seperti terminal.
import JSCPP from "JSCPP";

const RUN_LIMIT_MS = 8000;
const NEED = "__KQ_NEED_INPUT__";

function runCpp(code, stdio) {
  return JSCPP.run(code, "", {
    stdio: Object.assign({ drain: () => "" }, stdio),
    maxTimeout: RUN_LIMIT_MS,
    unsigned_overflow: "warn",
  });
}

self.onmessage = (e) => {
  const m = e.data;
  if (m.type === "init") {
    self.postMessage({ type: "stage", stage: "init" });
    try {
      // Pemanasan: kompilasi program kosong agar parser dan pustaka sudah siap sebelum pemain menekan Jalankan.
      runCpp("#include <iostream>\nint main(){ return 0; }", { write: () => {} });
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "fatal", message: String((err && err.message) || err) });
    }
    return;
  }
  if (m.type === "run") {
    const queue = Array.isArray(m.inputs) ? m.inputs.slice() : [];
    let out = "";
    let outStream = "out";
    let needInput = false;
    const flush = () => {
      if (out) self.postMessage({ type: "out", id: m.id, text: out, stream: outStream });
      out = "";
    };
    const push = (text, stream) => {
      if (stream !== outStream) {
        flush();
        outStream = stream;
      }
      out += text;
      if (out.length > 4000) flush();
    };
    try {
      const code = runCpp(m.code, {
        write: (s) => push(s, "out"),
        more: () => {
          if (queue.length === 0) {
            needInput = true;
            throw new Error(NEED);
          }
          const line = queue.shift();
          push(line + "\n", "in");
          return line + "\n";
        },
      });
      flush();
      self.postMessage({ type: "done", id: m.id, exit: typeof code === "number" ? code : 0 });
    } catch (err) {
      flush();
      if (needInput) self.postMessage({ type: "need-input", id: m.id });
      else self.postMessage({ type: "error", id: m.id, message: String((err && err.message) || err) });
    }
  }
};
