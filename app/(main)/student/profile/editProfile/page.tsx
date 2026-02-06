"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useSession } from "@/providers/session-provider";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function EditProfilePage() {
  const { data, isLoading, error } = useStudentProfile();
  const session = useSession();

  const profile = data?.profile;

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    personalEmail: "",
    phoneNo: "",
    dob: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!profile) return;

    setFormData({
      firstName: profile.firstName || "",
      middleName: profile.middleName || "",
      lastName: profile.lastName || "",
      personalEmail: profile.personalEmail || "",
      phoneNo: profile.phoneNo || "",
      dob: profile.dob ? profile.dob.split("T")[0] : "",
    });
  }, [profile]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await axios.put("/api/my-proxy/api/v1/student/editProfile", formData);
      setMessage("Profile updated successfully");
      toast.success("Profile updated successfully");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Update failed");
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load profile</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit your profile</h1>

      <Container className="rounded-xl border !border-gray-300 py-6 px-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-6">
          <Image
            src={session?.user?.picture || "/default-user.jpg"}
            alt="Profile"
            width={64}
            height={64}
            className="rounded-full border"
          />
          <div>
            <h2 className="text-lg font-semibold">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-sm text-neutral-500">
              Update how recruiters see you
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 mt-10">
          {/* Personal Info */}
          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-500">
              Personal Information
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </div>
              <div>
                <Label>Middle Name</Label>
                <Input
                  value={formData.middleName}
                  onChange={(e) => updateField("middleName", e.target.value)}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-500">
              Contact Details
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) => updateField("personalEmail", e.target.value)}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phoneNo}
                  onChange={(e) => updateField("phoneNo", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* DOB */}
          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-500">
              Date of Birth
            </p>

            <div className="relative max-w-sm">
              <Input
                type="date"
                value={formData.dob}
                onChange={(e) => updateField("dob", e.target.value)}
                className="pl-10"
              />

              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            {message && <p className="text-sm text-neutral-500">{message}</p>}
          </div>
        </form>
      </Container>
    </div>
  );
}
