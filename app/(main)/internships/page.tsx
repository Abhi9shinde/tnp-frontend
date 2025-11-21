"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const fontClass = "font-['Nunito_Sans',_'Inter',_system-ui,_sans-serif]";
const surfaceStyles =
  "rounded-2xl border border-zinc-200/70 bg-white/80 p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-900/40";
const textareaStyles =
  "min-h-[120px] w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-black shadow-sm transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white";

interface InternshipEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface CertificationEntry {
  title: string;
  organization: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
}

interface ExperienceFormData {
  internships: InternshipEntry[];
  certifications: CertificationEntry[];
  notes: string;
}

const emptyInternship: InternshipEntry = {
  company: "",
  role: "",
  duration: "",
  description: "",
};

const emptyCertification: CertificationEntry = {
  title: "",
  organization: "",
  issueDate: "",
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
};

const initialState: ExperienceFormData = {
  internships: [{ ...emptyInternship }],
  certifications: [{ ...emptyCertification }],
  notes: "",
};

const InternshipsPage = () => {
  const [formData, setFormData] = useState<ExperienceFormData>(initialState);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updateInternship = <K extends keyof InternshipEntry>(
    index: number,
    field: K,
    value: InternshipEntry[K]
  ) => {
    setFormData((prev) => {
      const next = [...prev.internships];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, internships: next };
    });
  };

  const updateCertification = <K extends keyof CertificationEntry>(
    index: number,
    field: K,
    value: CertificationEntry[K]
  ) => {
    setFormData((prev) => {
      const next = [...prev.certifications];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, certifications: next };
    });
  };

  const addRow = (type: "internships" | "certifications") => {
    setFormData((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        type === "internships" ? { ...emptyInternship } : { ...emptyCertification },
      ],
    }));
  };

  const removeRow = (type: "internships" | "certifications", index: number) => {
    setFormData((prev) => {
      if (prev[type].length === 1) return prev;
      return {
        ...prev,
        [type]: prev[type].filter((_, idx) => idx !== index),
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        "/api/my-proxy/api/v1/student/internships",
        formData
      );

      if (response.status === 200) {
        setStatusMessage("Internship & certification details saved successfully!");
      }
    } catch (error: any) {
      if (error.response?.data?.needsAuth) {
        alert("Please login first to save your internship details");
        window.location.href = error.response.data.loginUrl;
        return;
      }
      setErrorMessage(
        error.response?.data?.error || "Failed to save internship details. Try again."
      );
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-8">
      <div className="w-full max-w-5xl space-y-10">
          <header className="space-y-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
              Experiences
            </p>
            <h1 className="text-3xl font-semibold">Internships & certifications</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Keep your hands-on work and credentials updated so recruiters can verify
              everything at a glance.
            </p>
          </header>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <section className={surfaceStyles}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Internships</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Add a separate entry for each company or role.
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={() => addRow("internships")}>
                  Add internship
                </Button>
              </div>

              <div className="mt-6 space-y-6">
                {formData.internships.map((internship, index) => (
                  <div
                    key={`internship-${index}`}
                    className="rounded-xl border border-zinc-200/70 p-4 dark:border-zinc-800/60"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
                      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Internship #{index + 1}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={formData.internships.length === 1}
                        onClick={() => removeRow("internships", index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`company-${index}`}>Company</Label>
                        <Input
                          id={`company-${index}`}
                          placeholder="TechCorp Pvt Ltd"
                          value={internship.company}
                          onChange={(event) =>
                            updateInternship(index, "company", event.target.value)
                          }
                          required
                        />
                      </div>
                    <div className="space-y-2">
                      <Label htmlFor={`role-${index}`}>Role</Label>
                      <Input
                        id={`role-${index}`}
                        placeholder="Backend Intern"
                        value={internship.role}
                        onChange={(event) =>
                          updateInternship(index, "role", event.target.value)
                        }
                        required
                      />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor={`duration-${index}`}>Duration</Label>
                        <Input
                          id={`duration-${index}`}
                          placeholder="3 months"
                          value={internship.duration}
                          onChange={(event) =>
                            updateInternship(index, "duration", event.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <textarea
                          id={`description-${index}`}
                          className={textareaStyles}
                          placeholder="Key projects, tools used, and impact."
                          value={internship.description}
                          onChange={(event) =>
                            updateInternship(index, "description", event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={surfaceStyles}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Certifications</h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Include MOOCs, professional credentials, or licenses.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addRow("certifications")}
                >
                  Add certification
                </Button>
              </div>

              <div className="mt-6 space-y-6">
                {formData.certifications.map((cert, index) => (
                  <div
                    key={`cert-${index}`}
                    className="rounded-xl border border-zinc-200/70 p-4 dark:border-zinc-800/60"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
                      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Certification #{index + 1}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={formData.certifications.length === 1}
                        onClick={() => removeRow("certifications", index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${index}`}>Title</Label>
                        <Input
                          id={`title-${index}`}
                          placeholder="AWS Certified Cloud Practitioner"
                          value={cert.title}
                          onChange={(event) =>
                            updateCertification(index, "title", event.target.value)
                          }
                          required
                        />
                      </div>
                    <div className="space-y-2">
                      <Label htmlFor={`organization-${index}`}>Organization</Label>
                      <Input
                        id={`organization-${index}`}
                        placeholder="Amazon Web Services"
                        value={cert.organization}
                        onChange={(event) =>
                          updateCertification(index, "organization", event.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`issueDate-${index}`}>Issue Date</Label>
                      <Input
                        id={`issueDate-${index}`}
                        type="date"
                        value={cert.issueDate}
                        onChange={(event) =>
                          updateCertification(index, "issueDate", event.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`expiryDate-${index}`}>Expiry Date</Label>
                      <Input
                        id={`expiryDate-${index}`}
                        type="date"
                        value={cert.expiryDate}
                        onChange={(event) =>
                          updateCertification(index, "expiryDate", event.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`credentialId-${index}`}>Credential ID</Label>
                      <Input
                        id={`credentialId-${index}`}
                        placeholder="ABC-123-XYZ"
                        value={cert.credentialId}
                        onChange={(event) =>
                          updateCertification(index, "credentialId", event.target.value)
                        }
                      />
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor={`credentialUrl-${index}`}>Credential URL</Label>
                        <Input
                          id={`credentialUrl-${index}`}
                          type="url"
                          placeholder="https://www.credly.com/badges/..."
                          value={cert.credentialUrl}
                          onChange={(event) =>
                            updateCertification(index, "credentialUrl", event.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={surfaceStyles}>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional notes (optional)</Label>
                <textarea
                  id="notes"
                  className={textareaStyles}
                  placeholder="Mention hackathons, publications, or links to proof of work."
                  value={formData.notes}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, notes: event.target.value }))
                  }
                />
              </div>
            </section>

            <div className="flex flex-col gap-3 text-center sm:text-left sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                {statusMessage && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {statusMessage}
                  </p>
                )}
                {errorMessage && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                )}
              </div>
              <div className="flex justify-center gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData(initialState);
                    setStatusMessage("");
                  }}
                >
                  Reset
                </Button>
                <Button type="submit">Save Experience Details</Button>
              </div>
            </div>
          </form>
      </div>
    </div>
  );
};

export default InternshipsPage;

