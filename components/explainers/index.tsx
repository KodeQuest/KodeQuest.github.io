import type { ReactNode } from "react";
import type { Scene } from "./ExplainerPlayer";
import { htmlScenes, tintHtml } from "./html";
import { cssScenes, tintCss } from "./css";
import { jsScenes, tintJs } from "./js";
import { mysqlScenes, tintMysql } from "./mysql";

export type Explainer = { scenes: Scene[]; tint?: (code: string) => ReactNode };

/** Video penjelasan per bahasa. Bahasa baru: buat file adegannya (lihat html.tsx), lalu daftarkan di sini. */
const EXPLAINERS: Record<string, Explainer> = {
  html: { scenes: htmlScenes, tint: tintHtml },
  css: { scenes: cssScenes, tint: tintCss },
  js: { scenes: jsScenes, tint: tintJs },
  mysql: { scenes: mysqlScenes, tint: tintMysql },
};

export function getExplainer(langId: string): Explainer | undefined {
  return EXPLAINERS[langId];
}
