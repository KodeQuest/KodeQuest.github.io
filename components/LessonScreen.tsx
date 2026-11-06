"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_LESSONS, isLessonUnlocked, languageOfLesson } from "@/lib/data";
import { loadSession } from "@/lib/session";
import { useProgress } from "@/lib/store";
import { LessonPlayer } from "./LessonPlayer";

/** Halaman satu pelajaran (/belajar/<id>/). Memeriksa akses (per bahasa) lalu menampilkan pemutar. */
export function LessonScreen({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const { ready, progress } = useProgress();
  const [allowed, setAllowed] = useState(false);
  const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
  const language = languageOfLesson(lessonId);
  const backTo = language ? `/belajar/bahasa/${language.id}/` : "/belajar/";

  useEffect(() => {
    if (!ready || allowed) return;
    if (!languageOfLesson(lessonId)) {
      router.replace("/belajar/");
      return;
    }
    const resume = loadSession()?.lessonId === lessonId;
    const unlocked = isLessonUnlocked(lessonId, progress.completed);
    if (!resume && !unlocked) {
      router.replace(backTo);
      return;
    }
    setAllowed(true);
  }, [ready, allowed, lessonId, progress.completed, router, backTo]);

  if (!lesson || !allowed) return <div className="min-h-dvh" />;
  return <LessonPlayer lesson={lesson} onExit={() => router.push(backTo)} />;
}
