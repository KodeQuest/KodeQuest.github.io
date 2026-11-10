import type { ReactNode } from "react";
import type { Scene } from "./ExplainerPlayer";
import { htmlScenes, tintHtml } from "./html";

export type Explainer = { scenes: Scene[]; tint?: (code: string) => ReactNode };

/** Video penjelasan per bahasa. Bahasa baru: buat file adegannya (lihat html.tsx), lalu daftarkan di sini. */
const EXPLAINERS: Record<string, Explainer> = {
  html: { scenes: htmlScenes, tint: tintHtml },
};

export function getExplainer(langId: string): Explainer | undefined {
  return EXPLAINERS[langId];
}
