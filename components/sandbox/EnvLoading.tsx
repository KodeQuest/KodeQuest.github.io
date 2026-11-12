"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "../Icons";

function Spinner({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-indigo-500 motion-safe:animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Layar "menyiapkan environment": judul, penghitung detik, bilah tak tentu, dan daftar langkah. */
export function EnvLoading({ title, steps, active, hint, className = "" }: { title: string; steps: string[]; active: number; hint: string; className?: string }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div role="status" aria-live="polite" className={`overflow-auto rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-5 ${className}`}>
      <div className="flex items-center gap-3">
        <Spinner />
        <div className="min-w-0 flex-1">
          <p className="font-black text-indigo-950">{title}</p>
          <p className="text-xs font-bold tabular-nums text-indigo-400">{secs} detik</p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-100" aria-hidden="true">
        <div className="anim-indeterminate h-full w-1/3 rounded-full bg-indigo-500" />
      </div>

      <ol className="mt-4 space-y-2.5">
        {steps.map((s, i) => {
          const done = i < active;
          const now = i === active;
          return (
            <li key={s} className={`flex items-center gap-2.5 text-sm font-bold ${done ? "text-teal-700" : now ? "text-indigo-900" : "text-slate-400"}`}>
              <span className="grid h-5 w-5 shrink-0 place-items-center">
                {done ? <CheckIcon size={18} /> : now ? <Spinner size={16} /> : <span className="h-2.5 w-2.5 rounded-full border-2 border-slate-300" />}
              </span>
              {s}
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-xs font-semibold text-slate-500">{hint}</p>
    </div>
  );
}
