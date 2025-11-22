"use client";

import { createContext, useContext } from "react";

export type UserSession = {
  user: {
    name?: string;
    nickname?: string;
    email?: string;
    picture?: string;
  } | null;
};

const SessionContext = createContext<UserSession | null>(null);

export const useSession = (): UserSession | null => {
  return useContext(SessionContext);
};

export function SessionProvider({
  session,
  children,
}: {
  session: UserSession | null;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
