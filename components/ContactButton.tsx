"use client";

import { useState } from "react";
import { sfx } from "@/lib/sound";
import { CloseIcon, ContactIcon, GithubIcon, WhatsappIcon } from "./Icons";
import { Modal } from "./Modal";

const CONTACTS = [
  { name: "GitHub", detail: "github.com/KodeQuest", href: "https://github.com/KodeQuest", icon: <GithubIcon size={26} />, tone: "bg-indigo-950" },
  { name: "WhatsApp", detail: "0813-8187-989", href: "https://wa.me/628138187989", icon: <WhatsappIcon size={26} />, tone: "bg-teal-500" },
];

/** Ikon kontak di pojok kanan atas; membuka modal berisi tautan GitHub dan WhatsApp. */
export function ContactButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          sfx.click();
          setOpen(true);
        }}
        className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        aria-label="Buka kontak"
        title="Kontak"
      >
        <ContactIcon size={22} />
      </button>

      {open && (
        <Modal label="Kontak" onClose={() => setOpen(false)}>
          {(close) => (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-black text-indigo-950">Kontak</h2>
                <button onClick={close} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Tutup">
                  <CloseIcon size={20} />
                </button>
              </div>
              <p className="mb-4 text-sm font-semibold text-slate-500">Ada pertanyaan atau masukan? Hubungi lewat salah satu di bawah ini.</p>
              <div className="space-y-3">
                {CONTACTS.map((c) => (
                  <a
                    key={c.name}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => sfx.click()}
                    className="btn-3d flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 shadow-[0_4px_0_#e2e8f0] hover:bg-slate-50"
                  >
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white ${c.tone}`}>{c.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-base font-black text-indigo-950">{c.name}</span>
                      <span className="block truncate text-sm font-bold text-slate-500">{c.detail}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
