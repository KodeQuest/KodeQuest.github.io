/* Worker Python untuk /sandbox (Pyodide = CPython di WebAssembly). Harus dibuat sebagai module worker: new Worker(url, {type:"module"}).
 * Pesan masuk : {type:"init", indexURL} | {type:"run", id, code, stdin}
 * Pesan keluar: {type:"stage", stage:"download"|"init"} | {type:"ready"} | {type:"fatal", message}
 *               {type:"out", id, text, stream:"out"|"err"} | {type:"done", id} | {type:"error", id, message}
 */
let pyodide = null;

function post(msg) {
  self.postMessage(msg);
}

/** Buang bingkai internal Pyodide dari traceback agar yang tampil hanya kode pemain. */
function cleanTraceback(text) {
  const lines = String(text).split("\n");
  const i = lines.findIndex((l) => l.includes('File "<exec>"'));
  if (i === -1) return lines.filter((l) => !l.includes("_pyodide") && !l.includes("/lib/python")).join("\n").trim();
  return ["Traceback (most recent call last):"].concat(lines.slice(i)).join("\n").trim();
}

self.onmessage = async (e) => {
  const m = e.data;

  if (m.type === "init") {
    try {
      post({ type: "stage", stage: "download" });
      const mod = await import(m.indexURL + "pyodide.mjs");
      post({ type: "stage", stage: "init" });
      pyodide = await mod.loadPyodide({ indexURL: m.indexURL });
      await pyodide.runPythonAsync("1 + 1"); // pemanasan
      post({ type: "ready" });
    } catch (err) {
      post({ type: "fatal", message: String((err && err.message) || err) });
    }
    return;
  }

  if (m.type === "run" && pyodide) {
    const lines = String(m.stdin || "").split("\n");
    if (lines.length && lines[lines.length - 1] === "") lines.pop();
    pyodide.setStdin({ stdin: () => (lines.length ? lines.shift() : undefined) });
    // Handler `write` menerima potongan apa adanya, jadi print(..., end="") dan prompt input() langsung tampil.
    const sink = (stream) => {
      const dec = new TextDecoder();
      return { write: (buf) => { post({ type: "out", id: m.id, text: dec.decode(buf, { stream: true }), stream }); return buf.length; } };
    };
    pyodide.setStdout(sink("out"));
    pyodide.setStderr(sink("err"));
    let globals = null;
    try {
      globals = pyodide.globals.get("dict")(); // namespace baru tiap run, jadi variabel run sebelumnya tidak bocor
      await pyodide.runPythonAsync(m.code, { globals });
      await pyodide.runPythonAsync("import sys\nsys.stdout.flush()\nsys.stderr.flush()");
      post({ type: "done", id: m.id });
    } catch (err) {
      try { await pyodide.runPythonAsync("import sys\nsys.stdout.flush()"); } catch (_) {}
      post({ type: "error", id: m.id, message: cleanTraceback((err && err.message) || err) });
    } finally {
      if (globals) globals.destroy();
    }
  }
};
