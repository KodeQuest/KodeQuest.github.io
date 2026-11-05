"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_LESSONS } from "@/lib/data";
import { loadSession } from "@/lib/session";
import { useProgress } from "@/lib/store";
import { LessonPlayer } from "./LessonPlayer";

/** Halaman satu pelajaran (/belajar/<id>/). Memeriksa akses lalu menampilkan pemutar. */
export function LessonScreen({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const { ready, progress } = useProgress();
  const [allowed, setAllowed] = useState(false);
  const lesson = ALL_LESSONS.find((l) => l.id === lessonId);

  useEffect(() => {
    if (!ready || allowed) return;
    const i = ALL_LESSONS.findIndex((l) => l.id === lessonId);
    if (i < 0) {
      router.replace("/belajar/");
      return;
    }
    const resume = loadSession()?.lessonId === lessonId;
    const unlocked = i === 0 || !!progress.completed[ALL_LESSONS[i - 1].id];
    if (!resume && (!unlocked || progress.lives <= 0)) {
      router.replace("/belajar/");
      return;
    }
    setAllowed(true);
  }, [ready, allowed, lessonId, progress.completed, progress.lives, router]);

  if (!lesson || !allowed) return <div className="min-h-dvh" />;
  return <LessonPlayer lesson={lesson} onExit={() => router.push("/belajar/")} />;
}
