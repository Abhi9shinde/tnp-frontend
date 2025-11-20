"use client";

import { createContext, useContext } from "react";

const SessionContext = createContext(null);

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ session, children }: any) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
