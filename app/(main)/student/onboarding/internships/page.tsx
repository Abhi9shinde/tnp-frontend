"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const surfaceStyles = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const textareaStyles =
  "min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-sm transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none";

interface InternshipEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

const emptyInternship: InternshipEntry = {
  company: "",
  role: "",
  duration: "",
  description: "",
};

export default function InternshipsPage() {
  const router = useRouter();

  const [internships, setInternships] = useState<InternshipEntry[]>([
    { ...emptyInternship },
  ]);

  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (
    index: number,
    field: keyof InternshipEntry,
    value: string,
  ) => {
    setInternships((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addInternship = () => {
    setInternships((prev) => [...prev, { ...emptyInternship }]);
  };

  const removeInternship = (index: number) => {
    if (internships.length === 1) return;

    setInternships((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");

    try {
      for (const internship of internships) {
        await axios.post(
          "/api/my-proxy/api/v1/student/addInternship",
          internship,
        );
      }

      setStatusMessage("Internships saved successfully!");
      router.push("/student/home"); // or next onboarding step
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error ||
          "Failed to save internship details. Try again.",
      );
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-8">
      <div className="w-full max-w-5xl space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
            Experience
          </p>
          <h1 className="text-3xl font-semibold">Internships</h1>
          <p className="text-sm text-muted-foreground">
            Add your real-world experience (you can skip if none yet).
          </p>
        </header>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <section className={surfaceStyles}>
            <div className="space-y-6">
              {internships.map((internship, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex justify-between items-center pb-4">
                    <p className="text-sm font-semibold">
                      Internship #{index + 1}
                    </p>

                    <Button
                      type="button"
                      variant="ghost"
                      disabled={internships.length === 1}
                      onClick={() => removeInternship(index)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={internship.company}
                        placeholder="TechCorp Pvt Ltd"
                        onChange={(e) =>
                          updateField(index, "company", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={internship.role}
                        placeholder="Frontend Intern"
                        onChange={(e) =>
                          updateField(index, "role", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        value={internship.duration}
                        placeholder="3 months"
                        onChange={(e) =>
                          updateField(index, "duration", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label>Description</Label>
                      <textarea
                        className={textareaStyles}
                        value={internship.description}
                        placeholder="Work done, tech used, impact..."
                        onChange={(e) =>
                          updateField(index, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button type="button" variant="secondary" onClick={addInternship}>
                Add another internship
              </Button>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div>
              {statusMessage && (
                <p className="text-emerald-600">{statusMessage}</p>
              )}
              {errorMessage && <p className="text-red-600">{errorMessage}</p>}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/student/home")}
              >
                Skip
              </Button>

              <Button type="submit">Save & Continue</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
