"use client";

import { useState } from "react";
import Link from "next/link";
import { sfx } from "@/lib/sound";
import type { SandboxTab } from "@/lib/sandbox";
import { Header } from "./Header";
import { SettingsModal } from "./SettingsModal";
import { RuntimePlayground } from "./sandbox/RuntimePlayground";
import { WebPlayground } from "./sandbox/WebPlayground";

const TABS: { id: SandboxTab; label: string; sub: string }[] = [
  { id: "web", label: "Web", sub: "HTML · CSS · JS" },
  { id: "python", label: "Python", sub: "Pyodide" },
  { id: "cpp", label: "C++", sub: "JSCPP" },
];

/** Halaman /sandbox. Tab Python dan C++ baru memuat environment saat pertama kali dibuka, lalu tetap hidup di latar belakang. */
export function SandboxScreen() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tab, setTab] = useState<SandboxTab>("web");
  const [visited, setVisited] = useState<Set<SandboxTab>>(() => new Set<SandboxTab>(["web"]));

  const choose = (t: SandboxTab) => {
    sfx.click();
    setTab(t);
    setVisited((v) => (v.has(t) ? v : new Set(v).add(t)));
  };

  const panel = (id: SandboxTab) => (tab === id ? "" : "hidden");

  return (
    <>
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 lg:pt-8">
        <Link href="/belajar/" onClick={() => sfx.click()} className="text-sm font-extrabold text-indigo-600 hover:underline">
          ← Kembali belajar
        </Link>
        <h1 className="mb-1 mt-3 text-3xl font-black text-indigo-950">Sandbox</h1>
        <p className="mb-6 max-w-2xl text-sm font-semibold text-slate-500">Coba kode bebas tanpa memengaruhi XP atau progres. Semuanya berjalan di browsermu dan kodenya tersimpan otomatis di perangkat ini.</p>

        <div className="mb-6 flex flex-wrap gap-3" role="tablist" aria-label="Bahasa">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => choose(t.id)}
              className={`btn-3d rounded-2xl border-2 px-5 py-2.5 text-left ${
                tab === t.id ? "border-indigo-500 bg-indigo-50 text-indigo-800 shadow-[0_4px_0_#818cf8]" : "border-slate-200 bg-white text-slate-600 shadow-[0_4px_0_#e2e8f0] hover:bg-slate-50"
              }`}
            >
              <span className="block text-base font-black leading-tight">{t.label}</span>
              <span className="block text-xs font-bold text-slate-400">{t.sub}</span>
            </button>
          ))}
        </div>

        <div id="panel-web" role="tabpanel" aria-labelledby="tab-web" className={panel("web")}>
          <WebPlayground />
        </div>
        {visited.has("python") && (
          <div id="panel-python" role="tabpanel" aria-labelledby="tab-python" className={panel("python")}>
            <RuntimePlayground kind="python" />
          </div>
        )}
        {visited.has("cpp") && (
          <div id="panel-cpp" role="tabpanel" aria-labelledby="tab-cpp" className={panel("cpp")}>
            <RuntimePlayground kind="cpp" />
          </div>
        )}
      </main>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
