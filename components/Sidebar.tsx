"use client";

import { UNITS } from "@/lib/data";
import { MAX_LIVES, useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { BoltIcon, DownloadIcon, FlameIcon, HeartIcon } from "./Icons";

function Row({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className={tone}>{icon}</span>
      <span className="flex-1 text-sm font-bold text-slate-500">{label}</span>
      <span className="text-base font-black tabular-nums text-indigo-950">{value}</span>
    </li>
  );
}

export function Sidebar({ onStart, onOpenSettings }: { onStart: (id: string) => void; onOpenSettings: () => void }) {
  const { progress, streakShown } = useProgress();

  const all = UNITS.flatMap((u) => u.lessons.map((l) => ({ l, unit: u })));
  const done = all.filter((x) => progress.completed[x.l.id]).length;
  const next = all.find((x) => !progress.completed[x.l.id]);
  const pct = Math.round((done / all.length) * 100);

  return (
    <div className="sticky top-24 space-y-5">
      <section className="rounded-3xl border-2 border-slate-200 p-5">
        <h2 className="font-black text-indigo-950">Statistikmu</h2>
        <ul className="mt-1 divide-y-2 divide-slate-100">
          <Row icon={<FlameIcon size={22} />} label="Streak hari" value={String(streakShown)} tone="text-orange-500" />
          <Row icon={<BoltIcon size={22} />} label="Total XP" value={String(progress.xp)} tone="text-amber-500" />
          <Row icon={<HeartIcon size={22} />} label="Hati" value={`${progress.lives}/${MAX_LIVES}`} tone="text-rose-500" />
        </ul>
      </section>

      <section className="rounded-3xl border-2 border-slate-200 p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-black text-indigo-950">Progres</h2>
          <span className="text-sm font-extrabold text-teal-600">{pct}%</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          {done} dari {all.length} pelajaran selesai
        </p>

        {next ? (
          <div className="mt-5 border-t-2 border-slate-100 pt-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Berikutnya</p>
            <p className="mt-1 font-black text-indigo-950">{next.l.title}</p>
            <p className="text-sm font-semibold text-slate-500">{next.unit.title}</p>
            <button
              disabled={progress.lives <= 0}
              onClick={() => {
                sfx.click();
                onStart(next.l.id);
              }}
              className="btn-3d mt-4 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#3730a3] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-[0_4px_0_#cbd5e1]"
            >
              {progress.lives <= 0 ? "Hati habis" : "Lanjutkan"}
            </button>
          </div>
        ) : (
          <p className="mt-4 border-t-2 border-slate-100 pt-4 text-sm font-bold text-teal-600">Semua pelajaran selesai. Ulangi kapan saja untuk berlatih.</p>
        )}
      </section>

      <section className="rounded-3xl border-2 border-slate-200 p-5">
        <h2 className="font-black text-indigo-950">Cadangkan progres</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Progres tersimpan di browser ini. Ekspor sebagai file JSON agar tidak hilang.</p>
        <button
          onClick={() => {
            sfx.click();
            onOpenSettings();
          }}
          className="btn-3d mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-extrabold text-indigo-600 shadow-[0_3px_0_#e2e8f0]"
        >
          <DownloadIcon size={18} /> Buka pengaturan
        </button>
      </section>
    </div>
  );
}
