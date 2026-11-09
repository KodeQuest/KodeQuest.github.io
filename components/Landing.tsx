"use client";

import type { ReactNode } from "react";
import { ALL_LESSONS, LANGUAGES } from "@/lib/data";
import { LANGUAGE_STYLES } from "@/lib/theme";
import { useProgress } from "@/lib/store";
import { sfx } from "@/lib/sound";
import { BoltIcon, CheckIcon, CodeIcon, DownloadIcon, FlameIcon, LayoutIcon, LockIcon, StarIcon, UnitIcon } from "./Icons";

function PrimaryButton({ children, onClick, className = "" }: { children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`btn-3d rounded-2xl bg-indigo-600 px-8 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_5px_0_#3730a3] hover:bg-indigo-500 ${className}`}
    >
      {children}
    </button>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-[0_8px_0_#e2e8f0]">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-2/3 rounded-full bg-teal-500" />
          </div>
        </div>
        <p className="text-xs font-extrabold uppercase tracking-wide text-indigo-400">Susun kode</p>
        <p className="mb-4 mt-1 text-lg font-black text-indigo-950">Susun sebuah tautan.</p>
        <div className="mb-4 flex min-h-[3.5rem] flex-wrap gap-2 rounded-2xl border-2 border-dashed border-indigo-200 p-3">
          {['<a href="#">', "Buka"].map((t) => (
            <span key={t} className="rounded-xl border-2 border-indigo-300 bg-indigo-50 px-3 py-1.5 font-mono text-sm font-bold text-indigo-800 shadow-[0_3px_0_#a5b4fc]">
              {t}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {["</a>", "<br>"].map((t) => (
            <span key={t} className="rounded-xl border-2 border-slate-200 bg-white px-3 py-1.5 font-mono text-sm font-bold text-slate-700 shadow-[0_3px_0_#e2e8f0]">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-indigo-600 py-3 text-center text-sm font-black uppercase tracking-wide text-white shadow-[0_4px_0_#3730a3]">Periksa</div>
      </div>

      <div className="absolute -left-4 -top-5 flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-orange-500 shadow-[0_4px_0_#e2e8f0] sm:-left-10">
        <FlameIcon size={18} /> 7 hari
      </div>
      <div className="absolute -bottom-5 -right-3 flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-amber-500 shadow-[0_4px_0_#e2e8f0] sm:-right-8">
        <BoltIcon size={18} /> +60 XP
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: <LayoutIcon size={26} />, title: "Jalur belajar terarah", text: "Pilih bahasa favoritmu, lalu ikuti jalurnya. Setiap pelajaran terbuka setelah yang sebelumnya selesai.", tone: "bg-indigo-500" },
  { icon: <CodeIcon size={26} />, title: "Tiga jenis latihan", text: "Pilihan ganda, menyusun blok kode, dan mengisi bagian rumpang. Kamu benar-benar bermain dengan sintaks.", tone: "bg-teal-500" },
  { icon: <BoltIcon size={26} />, title: "XP, bintang, dan streak", text: "Kumpulkan XP tiap jawaban benar, raih tiga bintang, dan bangun kebiasaan belajar harian.", tone: "bg-amber-500" },
  { icon: <DownloadIcon size={26} />, title: "Progres aman", text: "Tersimpan otomatis di browser, dan bisa diekspor atau diimpor sebagai file JSON untuk pindah perangkat.", tone: "bg-rose-500" },
];

export function Landing({ onStart }: { onStart: () => void }) {
  const { progress, ready } = useProgress();
  const returning = ready && (progress.xp > 0 || Object.keys(progress.completed).length > 0);
  const cta = returning ? "Lanjutkan belajar" : "Mulai belajar";
  const go = () => {
    sfx.click();
    onStart();
  };

  return (
    <div className="min-h-dvh bg-white">
      {/* Navigasi */}
      <nav className="sticky top-0 z-30 border-b-2 border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 font-mono text-sm font-black text-white shadow-[0_3px_0_#3730a3]">{"</>"}</div>
            <span className="text-xl font-black tracking-tight text-indigo-600">KodeQuest</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <a href="#fitur" className="hidden text-sm font-extrabold uppercase tracking-wide text-slate-500 hover:text-indigo-600 md:block">Fitur</a>
            <a href="#materi" className="hidden text-sm font-extrabold uppercase tracking-wide text-slate-500 hover:text-indigo-600 md:block">Materi</a>
            <button
              onClick={go}
              className="btn-3d rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-indigo-600 shadow-[0_3px_0_#e2e8f0] hover:bg-slate-50"
            >
              {cta}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 lg:grid-cols-2 lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="text-center lg:text-left">
          <p className="mb-4 inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-indigo-600">
            Gratis · Tanpa akun · Langsung di browser
          </p>
          <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-indigo-950 sm:text-5xl lg:text-6xl">
            Belajar koding, <span className="text-indigo-600">satu langkah</span> demi satu langkah.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-500 lg:mx-0">
            Pilih bahasa pemrograman, mulai dari HTML, CSS, JavaScript, React, Python, Java, hingga C++, lalu belajar lewat latihan singkat yang seru. Kumpulkan XP dan bangun streak harianmu.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <PrimaryButton onClick={go} className="w-full sm:w-auto">{cta}</PrimaryButton>
            <a
              href="#materi"
              className="btn-3d w-full rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-center text-base font-black uppercase tracking-wide text-indigo-600 shadow-[0_5px_0_#e2e8f0] hover:bg-slate-50 sm:w-auto"
            >
              Lihat materi
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 border-t-2 border-slate-100 pt-8 text-center lg:text-left">
            {[
              [String(ALL_LESSONS.length), "pelajaran"],
              [String(ALL_LESSONS.reduce((n, l) => n + l.questions.length, 0)), "soal latihan"],
              [String(LANGUAGES.length), "bahasa pemrograman"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-3xl font-black text-indigo-950">{v}</dt>
                <dd className="text-sm font-bold text-slate-500">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </header>

      {/* Fitur */}
      <section id="fitur" className="scroll-mt-16 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-black text-indigo-950 sm:text-4xl">Dirancang agar kamu betah belajar</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center font-medium text-slate-500">Latihan pendek, umpan balik instan, dan progres yang selalu terlihat.</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-[0_5px_0_#e2e8f0]">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl text-white ${f.tone}`}>{f.icon}</div>
                <h3 className="mt-5 text-lg font-black text-indigo-950">{f.title}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materi */}
      <section id="materi" className="scroll-mt-16 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-3xl font-black text-indigo-950 sm:text-4xl">Apa yang akan kamu pelajari</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center font-medium text-slate-500">Pilih bahasa pemrogramanmu. Tiap bahasa punya jalur pelajaran dan soal latihannya sendiri.</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {LANGUAGES.map((u) => {
              const c = LANGUAGE_STYLES[u.color];
              return (
                <div key={u.id} className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white">
                  <div className={`flex items-center justify-between px-5 py-4 text-white ${c.solid}`}>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-white/80">Bahasa</p>
                      <h3 className="text-xl font-black">{u.title}</h3>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/20">
                      <UnitIcon unit={u.color} size={24} />
                    </div>
                  </div>
                  <p className="px-5 pt-4 text-sm font-semibold text-slate-500">{u.subtitle}</p>
                  <ul className="space-y-2.5 px-5 pb-5 pt-3">
                    {u.lessons.map((l) => (
                      <li key={l.id} className="flex items-center gap-3 text-sm font-bold text-indigo-950">
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${c.soft} ${c.text}`}>
                          <CheckIcon size={14} />
                        </span>
                        {l.title}
                        <span className="ml-auto text-xs font-semibold text-slate-400">{l.questions.length} soal</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black text-indigo-950 sm:text-4xl">XP dan streak membuat latihan terasa seperti permainan</h2>
            <ul className="mt-8 space-y-5">
              {[
                [<StarIcon key="s" size={22} />, "text-amber-400", "Tiga bintang", "Jawaban yang salah tidak mengurangi apa pun, tapi akan diulang di akhir. Makin akurat, makin banyak bintang."],
                [<BoltIcon key="b" size={22} />, "text-amber-500", "XP tiap jawaban benar", "Selesaikan pelajaran tanpa salah untuk bonus XP dan tiga bintang."],
                [<FlameIcon key="f" size={22} />, "text-orange-500", "Streak harian", "Belajar sehari sekali untuk menjaga streak tetap menyala."],
              ].map(([icon, tone, title, text]) => (
                <li key={title as string} className="flex gap-4">
                  <span className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border-2 border-slate-200 bg-white ${tone as string}`}>{icon as ReactNode}</span>
                  <div>
                    <p className="font-black text-indigo-950">{title as string}</p>
                    <p className="text-sm font-medium leading-relaxed text-slate-500">{text as string}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6" aria-hidden="true">
            {[
              { x: 0, state: "done" },
              { x: 44, state: "active" },
              { x: 0, state: "locked" },
            ].map((n, i) => (
              <div
                key={i}
                style={{ transform: `translateX(${n.x}px)` }}
                className={`grid h-[72px] w-[72px] place-items-center rounded-full text-white ${
                  n.state === "done"
                    ? "bg-amber-400 shadow-[0_6px_0_#b45309]"
                    : n.state === "active"
                    ? "bg-indigo-500 shadow-[0_6px_0_#3730a3]"
                    : "bg-slate-200 shadow-[0_6px_0_#cbd5e1]"
                }`}
              >
                {n.state === "done" ? <StarIcon size={32} /> : n.state === "active" ? <CodeIcon size={30} /> : <LockIcon size={28} className="text-slate-400" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA akhir */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-indigo-600 px-6 py-14 text-center text-white shadow-[0_8px_0_#3730a3] sm:px-12">
          <h2 className="text-3xl font-black sm:text-4xl">Siap menulis kode pertamamu?</h2>
          <p className="mx-auto mt-3 max-w-xl font-medium text-indigo-100">Tidak perlu daftar atau memasang apa pun. Buka, pilih bahasa, dan mulai.</p>
          <button
            onClick={go}
            className="btn-3d mt-8 rounded-2xl bg-white px-8 py-4 text-base font-black uppercase tracking-wide text-indigo-600 shadow-[0_5px_0_#c7d2fe] hover:bg-indigo-50"
          >
            {cta}
          </button>
        </div>
      </section>

      <footer className="border-t-2 border-slate-100 py-8 text-center text-sm font-semibold text-slate-400">KodeQuest · Belajar fundamental pemrograman dari berbagai bahasa</footer>
    </div>
  );
}
