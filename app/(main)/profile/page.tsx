"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ProfileFormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  personalEmail: string;
  phoneNo: string;
  dob: string;
};

const fontClass = "font-['Nunito_Sans',_'Inter',_system-ui,_sans-serif]";
const surfaceStyles =
  "rounded-2xl border border-zinc-200/70 bg-white/80 p-6 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-900/40";

const initialState: ProfileFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  personalEmail: "",
  phoneNo: "",
  dob: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData>(initialState);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "/api/my-proxy/api/v1/student/registerStudent",
        formData
      );

      if (response.status === 200) {
        setStatusMessage("Profile saved. Redirecting to education form...");
        router.push("/education");
      }
    } catch (error: any) {
      if (error.response?.data?.needsAuth) {
        alert("Please login first to complete your profile");
        window.location.href = error.response.data.loginUrl;
        return;
      }
      setErrorMessage(
        error.response?.data?.error || "Profile completion failed. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-8">
      <div className="w-full max-w-3xl space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-500">
            Profile
          </p>
          <h1 className="text-3xl font-semibold">Tell us about yourself</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            The placement cell uses these details to verify your identity.
            Please complete every field carefully.
          </p>
        </header>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <section className={surfaceStyles}>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Personal details</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Names should match your official documents exactly.
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Pranav"
                  value={formData.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  placeholder="Prakash"
                  value={formData.middleName}
                  onChange={(event) =>
                    updateField("middleName", event.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Turkar"
                  value={formData.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(event) => updateField("dob", event.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          <section className={surfaceStyles}>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Contact</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Use personal channels that you check regularly.
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="personalEmail">Personal Email</Label>
                <Input
                  id="personalEmail"
                  type="email"
                  placeholder="pranav@gmail.com"
                  value={formData.personalEmail}
                  onChange={(event) =>
                    updateField("personalEmail", event.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNo">Phone Number</Label>
                <Input
                  id="phoneNo"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phoneNo}
                  onChange={(event) =>
                    updateField("phoneNo", event.target.value)
                  }
                  required
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 text-center sm:text-left sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              {statusMessage && (
                <p className="text-emerald-600 dark:text-emerald-400">
                  {statusMessage}
                </p>
              )}
              {errorMessage && (
                <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
              )}
            </div>
            <div className="flex justify-center gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData(initialState);
                  setStatusMessage("");
                  setErrorMessage("");
                }}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
