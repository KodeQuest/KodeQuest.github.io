"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { LearningPath } from "@/components/LearningPath";
import { SettingsModal } from "@/components/SettingsModal";
import { Sidebar } from "@/components/Sidebar";

export default function BelajarPage() {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const start = (id: string) => router.push(`/belajar/${id}/`);

  return (
    <>
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 pb-24 pt-6 lg:grid-cols-[34rem_20rem] lg:justify-center lg:pt-8">
        <LearningPath onStart={start} />
        <aside className="hidden lg:block" aria-label="Ringkasan belajar">
          <Sidebar onStart={start} onOpenSettings={() => setSettingsOpen(true)} />
        </aside>
      </main>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
