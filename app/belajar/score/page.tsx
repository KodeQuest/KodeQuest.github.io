"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { ScoreBoard } from "@/components/ScoreBoard";
import { SettingsModal } from "@/components/SettingsModal";

/** Papan skor: gabungkan beberapa file JSON progres menjadi daftar peringkat. */
export default function ScorePage() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 lg:pt-12">
        <Link href="/belajar/" className="text-sm font-extrabold text-indigo-600 hover:underline">
          ← Pilih bahasa
        </Link>
        <h1 className="mb-6 mt-3 text-3xl font-black text-indigo-950">Papan skor</h1>
        <ScoreBoard />
      </main>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
