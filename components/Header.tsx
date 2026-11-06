"use client";

import Link from "next/link";
import { useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { BoltIcon, FlameIcon, SettingsIcon } from "./Icons";

function Stat({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-base font-extrabold ${color}`} title={label} aria-label={`${label}: ${value}`}>
      {icon}
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export function Header({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { progress, streakShown, ready } = useProgress();

  return (
    <header className="sticky top-0 z-30 border-b-2 border-slate-100 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" aria-label="Kembali ke halaman utama" className="flex items-center gap-2.5 rounded-xl">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 font-mono text-sm font-black text-white shadow-[0_3px_0_#3730a3]">
            {"</>"}
          </div>
          <span className="hidden text-xl font-black tracking-tight text-indigo-600 sm:block">KodeQuest</span>
        </Link>

        <div className={`flex items-center gap-4 transition-opacity ${ready ? "opacity-100" : "opacity-0"}`}>
          <Stat icon={<FlameIcon size={22} />} value={streakShown} label="Streak hari" color="text-orange-500" />
          <Stat icon={<BoltIcon size={22} />} value={progress.xp} label="XP" color="text-amber-500" />
          <button
            onClick={() => {
              sfx.click();
              onOpenSettings();
            }}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Buka pengaturan"
          >
            <SettingsIcon size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
