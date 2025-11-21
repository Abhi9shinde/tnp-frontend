"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

export function SidebarBackdrop() {
  const { open, isMobile, setOpen } = useSidebar();

  useEffect(() => {
    if (open && !isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  if (!open || isMobile) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      aria-hidden="true"
    />
  );
}

