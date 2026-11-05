"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Landing } from "@/components/Landing";
import { LearningPath } from "@/components/LearningPath";
import { LessonPlayer } from "@/components/LessonPlayer";
import { SettingsModal } from "@/components/SettingsModal";
import { Sidebar } from "@/components/Sidebar";
import { ALL_LESSONS } from "@/lib/data";

export default function Home() {
  const [view, setView] = useState<"landing" | "learn">("landing");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const lesson = activeId ? ALL_LESSONS.find((l) => l.id === activeId) ?? null : null;

  const goTo = (v: "landing" | "learn") => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  if (lesson) {
    return <LessonPlayer key={lesson.id} lesson={lesson} onExit={() => setActiveId(null)} />;
  }

  if (view === "landing") {
    return <Landing onStart={() => goTo("learn")} />;
  }

  return (
    <>
      <Header onOpenSettings={() => setSettingsOpen(true)} onHome={() => goTo("landing")} />
      <main className="mx-auto grid w-full max-w-5xl gap-10 px-4 pb-24 pt-6 lg:grid-cols-[34rem_20rem] lg:justify-center lg:pt-8">
        <LearningPath onStart={setActiveId} />
        <aside className="hidden lg:block" aria-label="Ringkasan belajar">
          <Sidebar onStart={setActiveId} onOpenSettings={() => setSettingsOpen(true)} />
        </aside>
      </main>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
