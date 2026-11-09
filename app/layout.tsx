import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ProgressProvider } from "@/lib/store";
import { NoContextMenu } from "@/components/NoContextMenu";

export const metadata: Metadata = {
  title: "KodeQuest · Belajar koding seperti bermain",
  description: "Platform belajar fundamental pemrograman (HTML, CSS, JavaScript, React, Python, Java, C++) dengan XP dan streak.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        <NoContextMenu />
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
