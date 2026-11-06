import type { LanguageColor } from "./data";

/** Kelas Tailwind per warna bahasa (ditulis lengkap agar terdeteksi Tailwind). */
export const LANGUAGE_STYLES: Record<
  LanguageColor,
  { banner: string; node: string; solid: string; shadow: string; text: string; soft: string; bar: string }
> = {
  emerald: { banner: "bg-teal-500 shadow-[0_5px_0_#0f766e]", node: "bg-teal-500 shadow-[0_6px_0_#0f766e]", solid: "bg-teal-500", shadow: "shadow-[0_5px_0_#0f766e]", text: "text-teal-600", soft: "bg-teal-50", bar: "bg-teal-500" },
  indigo: { banner: "bg-indigo-500 shadow-[0_5px_0_#3730a3]", node: "bg-indigo-500 shadow-[0_6px_0_#3730a3]", solid: "bg-indigo-500", shadow: "shadow-[0_5px_0_#3730a3]", text: "text-indigo-600", soft: "bg-indigo-50", bar: "bg-indigo-500" },
  amber: { banner: "bg-amber-500 shadow-[0_5px_0_#b45309]", node: "bg-amber-500 shadow-[0_6px_0_#b45309]", solid: "bg-amber-500", shadow: "shadow-[0_5px_0_#b45309]", text: "text-amber-600", soft: "bg-amber-50", bar: "bg-amber-500" },
  sky: { banner: "bg-sky-500 shadow-[0_5px_0_#0369a1]", node: "bg-sky-500 shadow-[0_6px_0_#0369a1]", solid: "bg-sky-500", shadow: "shadow-[0_5px_0_#0369a1]", text: "text-sky-600", soft: "bg-sky-50", bar: "bg-sky-500" },
  rose: { banner: "bg-rose-500 shadow-[0_5px_0_#be123c]", node: "bg-rose-500 shadow-[0_6px_0_#be123c]", solid: "bg-rose-500", shadow: "shadow-[0_5px_0_#be123c]", text: "text-rose-600", soft: "bg-rose-50", bar: "bg-rose-500" },
  violet: { banner: "bg-violet-500 shadow-[0_5px_0_#5b21b6]", node: "bg-violet-500 shadow-[0_6px_0_#5b21b6]", solid: "bg-violet-500", shadow: "shadow-[0_5px_0_#5b21b6]", text: "text-violet-600", soft: "bg-violet-50", bar: "bg-violet-500" },
};
