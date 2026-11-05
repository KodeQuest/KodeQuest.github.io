"use client";

import { useRouter } from "next/navigation";
import { Landing } from "@/components/Landing";

export default function Home() {
  const router = useRouter();
  return <Landing onStart={() => router.push("/belajar/")} />;
}
