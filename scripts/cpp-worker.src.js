// Sumber worker C++ untuk /sandbox. Dibundel menjadi public/vendor/cpp-worker.js oleh scripts/build-cpp-worker.sh
// Mesin: JSCPP (interpreter C++ berbasis JavaScript). Mendukung subset C++: iostream, cmath, cstdio, cstdlib, cstring, cctype, ctime, iomanip.
// Tidak mendukung std::string dan STL (vector, map, dll).
import JSCPP from "JSCPP";

const RUN_LIMIT_MS = 8000;

function runCpp(code, input, onOut) {
  return JSCPP.run(code, input, {
    stdio: { write: (s) => onOut(s) },
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
      runCpp("#include <iostream>\nint main(){ return 0; }", "", () => {});
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "fatal", message: String((err && err.message) || err) });
    }
    return;
  }
  if (m.type === "run") {
    let out = "";
    let timer = null;
    const flush = () => {
      timer = null;
      if (out) self.postMessage({ type: "out", id: m.id, text: out, stream: "out" });
      out = "";
    };
    try {
      const code = runCpp(m.code, m.stdin || "", (s) => {
        out += s;
        if (out.length > 4000) flush();
      });
      flush();
      self.postMessage({ type: "done", id: m.id, exit: typeof code === "number" ? code : 0 });
    } catch (err) {
      flush();
      self.postMessage({ type: "error", id: m.id, message: String((err && err.message) || err) });
    }
  }
};
