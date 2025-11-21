import React from "react";
import { auth0 } from "@/lib/auth0";
import LandingShell from "./landing-shell";

export default async function LandingPage() {
  const session = await auth0.getSession();
  return <LandingShell session={session ?? null} />;
}

