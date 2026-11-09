import type { LiveSpec } from "./data";

/** Samakan spasi: rapikan spasi ganda dan abaikan spasi di sekitar tanda baca. Huruf besar/kecil tetap dibedakan. */
export function normalizeTyped(text: string): string {
  return text.trim().replace(/\s+/g, " ").replace(/\s*([^\w\s])\s*/g, "$1");
}

/** Cocokkan ketikan (sudah dinormalkan) dengan aturan; kembalikan teks hasil atau null. */
export function matchLive(rules: { pattern: string; output: string }[], typed: string): string | null {
  const t = normalizeTyped(typed);
  if (!t) return null;
  for (const r of rules) {
    let m: RegExpExecArray | null = null;
    try {
      m = new RegExp(r.pattern).exec(t);
    } catch {
      continue;
    }
    if (m) return r.output.replace(/\$(\d)/g, (_, n) => m![Number(n)] ?? "");
  }
  return null;
}

const BASE = "body{margin:8px;font:15px/1.4 system-ui,sans-serif;color:#1e1b4b;background:#fff}";

export const htmlDoc = (code: string) => `<!doctype html><meta charset="utf-8"><style>${BASE}</style>${code}`;

export const cssDoc = (css: string, html: string, base = "") =>
  `<!doctype html><meta charset="utf-8"><style>${BASE}${base}</style><style>${css}</style>${html}`;

/** Dokumen yang menjalankan kode di iframe ber-sandbox, lalu mengirim keluaran console.log lewat postMessage. */
export function jsDoc(code: string, id: number): string {
  const payload = JSON.stringify(code).replace(/</g, "\\u003c");
  return `<!doctype html><meta charset="utf-8"><script>(function(){var out=[];function f(v){if(typeof v==="string")return v;try{var j=JSON.stringify(v);return j===undefined?String(v):j}catch(e){return String(v)}}console.log=function(){out.push([].map.call(arguments,f).join(" "))};var ok=true;try{(0,eval)(${payload})}catch(e){ok=false}parent.postMessage({kq:${id},ok:ok,out:out.slice(0,20)},"*")})();</script>`;
}

export function jsCode(spec: Extract<LiveSpec, { kind: "js" }>, typed: string): string {
  return `${spec.before ?? ""}\n${typed}\n${spec.after ?? ""}`;
}
