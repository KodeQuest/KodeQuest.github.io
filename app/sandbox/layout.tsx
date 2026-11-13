import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sandbox · KodeQuest",
  description: "Coba HTML, CSS, JavaScript, Python, C++, dan MySQL langsung di browser dengan pratinjau hasil.",
};

export default function SandboxLayout({ children }: { children: ReactNode }) {
  return children;
}
