"use client";

import type { Language } from "@/lib/data";
import { Modal } from "../Modal";
import { ExplainerPlayer } from "./ExplainerPlayer";
import type { Explainer } from "./index";

/** Modal layar penuh berisi video penjelasan satu bahasa. Langsung diputar saat dibuka. */
export function ExplainerModal({ language, explainer, onClose }: { language: Language; explainer: Explainer; onClose: () => void }) {
  return (
    <Modal full label={`Video penjelasan ${language.title}`} onClose={onClose}>
      {(close) => <ExplainerPlayer language={language} scenes={explainer.scenes} tint={explainer.tint} onClose={close} />}
    </Modal>
  );
}
