"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLanguage } from "@/lib/data";
import { sfx } from "@/lib/sound";
import { Header } from "./Header";
import { LearningPath } from "./LearningPath";
import { SettingsModal } from "./SettingsModal";
import { Sidebar } from "./Sidebar";

/** Jalur belajar satu bahasa (/belajar/bahasa/<id>/). */
export function LanguagePathScreen({ langId }: { langId: string }) {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const language = getLanguage(langId);
  if (!language) return <div className="min-h-dvh" />;

  const start = (id: string) => router.push(`/belajar/${id}/`);

  return (
    <>
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 pb-24 pt-6 lg:grid-cols-[34rem_20rem] lg:justify-center lg:pt-8">
        <div>
          <Link
            href="/belajar/"
            onClick={() => sfx.click()}
            className="mb-5 inline-flex items-center gap-1 rounded-xl text-sm font-extrabold uppercase tracking-wide text-slate-500 hover:text-indigo-600"
          >
            <span aria-hidden="true">←</span> Pilih bahasa lain
          </Link>
          <LearningPath language={language} onStart={start} />
        </div>
        <aside className="hidden lg:block" aria-label="Ringkasan belajar">
          <Sidebar language={language} onStart={start} onOpenSettings={() => setSettingsOpen(true)} />
        </aside>
      </main>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
