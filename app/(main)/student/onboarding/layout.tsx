import React from "react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold">Complete your profile</h1>
          <p className="text-sm text-muted-foreground">
            This helps recruiters discover you faster
          </p>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Profile</span>
          <span className="font-medium">→</span>
          <span className="text-muted-foreground">Education</span>
          <span className="font-medium">→</span>
          <span className="text-muted-foreground">Internship</span>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
