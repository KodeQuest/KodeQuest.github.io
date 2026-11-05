"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { LearningPath } from "@/components/LearningPath";
import { LessonPlayer } from "@/components/LessonPlayer";
import { SettingsModal } from "@/components/SettingsModal";
import { ALL_LESSONS } from "@/lib/data";

export default function Home() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const lesson = activeId ? ALL_LESSONS.find((l) => l.id === activeId) ?? null : null;

  if (lesson) {
    return <LessonPlayer key={lesson.id} lesson={lesson} onExit={() => setActiveId(null)} />;
  }

  return (
    <>
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <main className="mx-auto w-full max-w-xl px-4 pb-24 pt-6">
        <LearningPath onStart={setActiveId} />
      </main>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
