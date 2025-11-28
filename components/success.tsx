"use client";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const Success = (props: Props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <BackgroundRippleEffect />
      <div className="relative z-10 shadow-input mx-auto w-full max-w-md rounded-none bg-card p-4 md:rounded-2xl md:p-8 flex flex-col items-center justify-center gap-6">
        <h2 className="text-xl font-bold text-foreground text-center">
          Congratulations! 🎉
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground text-center">
          You have successfully logged in with your college email. Welcome to
          our platform!
        </p>
        <div className="flex items-center justify-center mb-4">
          <Image
            className="animate-pop drop-shadow-lg"
            src="/icons8-success-240.svg"
            alt="Success icon"
            width={120}
            height={120}
            priority
          />
        </div>
        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          onClick={() => {
            router.push("/profile");
          }}
        >
          Setup Your Profile →
          <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
          <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </button>
      </div>
      <style jsx global>{`
        @keyframes pop {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
          70% {
            transform: scale(0.98);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pop {
          animation: pop 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Success;
