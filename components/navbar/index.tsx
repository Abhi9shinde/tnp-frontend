"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "@/providers/session-provider";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const session = useSession();
  const userName =
    session?.user?.name ||
    session?.user?.nickname ||
    session?.user?.email ||
    "Guest";
  const avatarSrc = session?.user?.picture;

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="rounded-md border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white" />
        <a href="/home" className="text-lg font-semibold text-zinc-900 dark:text-white" >
          Centralized Placement System
        </a>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white/80 px-1 py-1 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/70"
        >
          {session ? (
            <Image
              src={avatarSrc || "/default-user.jpg"}
              alt={userName}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          ) : (
            <Image
              src="/default-user.jpg"
              alt="User"
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          )}
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-3 w-48 rounded-xl border border-zinc-200 bg-white p-2 text-left shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800/60"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile page
                </Link>
                <Link
                  href="/auth/logout"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-400/10"
                  onClick={() => setMenuOpen(false)}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800/60"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/login"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800/60"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
