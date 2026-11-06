"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { LanguagePicker } from "@/components/LanguagePicker";
import { SettingsModal } from "@/components/SettingsModal";

/** Halaman pemilihan bahasa pemrograman. */
export default function BelajarPage() {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 lg:pt-12">
        <LanguagePicker onPick={(id) => router.push(`/belajar/bahasa/${id}/`)} />
      </main>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
