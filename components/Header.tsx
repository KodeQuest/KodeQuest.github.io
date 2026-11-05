"use client";

import { HEART_REGEN_MS, MAX_LIVES, useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";

export function Hearts({ lives, compact = false }: { lives: number; compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 font-extrabold text-rose-500" aria-label={`${lives} hati`}>
        <span aria-hidden>❤️</span>
        {lives}
      </span>
    );
  }
  return (
    <span className="inline-flex gap-0.5" aria-label={`${lives} dari ${MAX_LIVES} hati`}>
      {Array.from({ length: MAX_LIVES }, (_, i) => (
        <span key={i} className={i < lives ? "" : "opacity-25 grayscale"} aria-hidden>
          ❤️
        </span>
      ))}
    </span>
  );
}

function Stat({ icon, value, label, tone }: { icon: string; value: number; label: string; tone: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-sm font-extrabold ${tone}`}
      title={label}
      aria-label={`${label}: ${value}`}
    >
      <span aria-hidden>{icon}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export function Header({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { progress, streakShown, ready } = useProgress();
  const regenMin = Math.max(1, Math.ceil((progress.livesAt + HEART_REGEN_MS - Date.now()) / 60000));

  return (
    <header className="sticky top-0 z-30 border-b border-indigo-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 text-lg font-black text-white shadow">
            {"</>"}
          </div>
          <span className="hidden text-lg font-black tracking-tight text-indigo-950 sm:block">KodeQuest</span>
        </div>

        <div className={`flex items-center gap-2 transition-opacity ${ready ? "opacity-100" : "opacity-0"}`}>
          <Stat icon="🔥" value={streakShown} label="Streak hari" tone="bg-orange-100 text-orange-600" />
          <Stat icon="⚡" value={progress.xp} label="XP" tone="bg-amber-100 text-amber-600" />
          <div
            className="flex items-center gap-1.5 rounded-2xl bg-rose-100 px-3 py-1.5 text-sm font-extrabold text-rose-600"
            title={progress.lives < MAX_LIVES ? `Hati berikutnya sekitar ${regenMin} menit lagi` : "Hati penuh"}
          >
            <span aria-hidden>❤️</span>
            <span className="tabular-nums">{progress.lives}</span>
          </div>
          <button
            onClick={() => {
              sfx.click();
              onOpenSettings();
            }}
            className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-100 text-lg text-indigo-700 transition hover:bg-indigo-200"
            aria-label="Buka pengaturan"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
}
