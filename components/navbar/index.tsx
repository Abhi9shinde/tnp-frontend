"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSession } from "@/providers/session-provider";

const Navbar = () => {
  const session = useSession();
  const name = session?.user?.name || "Guest";
  const photo = session?.user?.picture;

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full h-16 border-b bg-white flex items-center px-6 relative">
      {/* LOGO */}
      <div className="flex items-center gap-1">
        <Image
          src="/college/collegeLogo.png"
          alt="Logo"
          width={80}
          height={80}
        />
      </div>
      {/* CENTER */}
      <div className="flex-1"></div>
      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="text-gray-500 hover:text-black">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 17h-4m2-14a6 6 0 00-6 6v2a4 4 0 01-2 3h16a4 4 0 01-2-3V9a6 6 0 00-6-6Z"
            />
          </svg>
        </button>

        {/* Profile Photo */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2  "
        >
          <Image
            src={photo || "/default-user.jpg"}
            alt="User"
            width={36}
            height={36}
            className="rounded-full object-cover cursor-pointer"
          />

          <svg
            className="w-4 h-4 text-gray-600 hover:text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </button>
      </div>
      {/* DROPDOWN */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-6 top-16 w-72 bg-white shadow-lg rounded-lg border p-4 z-50"
        >
          {/* Top Row */}
          <div className="flex items-center gap-3">
            <Image
              src={photo || "/default-user.jpg"}
              width={48}
              height={48}
              alt="User"
              className="rounded-full object-cover"
            />
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-sm">{name}</p>
              <p className="text-sm text-gray-500 -mt-1">Ready to interview</p>
            </div>
            <button className="text-blue-600 text-sm ml-auto hover:cursor-pointer">
              Change
            </button>
          </div>

          {/* Divider */}
          <hr className="my-3" />
          <p className="text-xs text-gray-500 mb-1 px-1">Personal</p>

          <button className="w-full text-left text-sm py-2 px-1 rounded hover:bg-gray-100">
            Edit profile
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
