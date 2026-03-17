"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex max-w-xl flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 rounded-full bg-muted p-6">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>

        {/* 404 text */}
        <h1 className="text-6xl font-bold tracking-tight">404</h1>

        <h2 className="mt-2 text-xl font-semibold">Page not found</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or was removed.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>

          <Button asChild variant="ghost">
            <Link href="#" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
