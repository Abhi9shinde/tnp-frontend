"use client";
import LandingPage from "@/components/landing/landing-page";
import { redirect } from "next/navigation";
import { useSession } from "@/providers/session-provider";

// If Geist Sans is not available, fallback to Inter or system-ui

// Use a more elegant, modern font stack
// const fontClass = "font-['Nunito_Sans',_'Inter',_system-ui,_sans-serif]";

export default function Home() {
  const session = useSession();
  if (!session) {
    redirect("/home");
  }

  return (
    <main>
      <LandingPage />
    </main>
  );
}
