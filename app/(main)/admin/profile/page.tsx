"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

type AdminProfileForm = {
  fullName: string;
  phoneNo: string;
  organization: string;
  designation: string;
};

export default function AdminProfilePage() {
  const [form, setForm] = useState<AdminProfileForm>({
    fullName: "",
    phoneNo: "",
    organization: "PES Modern College of Engineering", // default
    designation: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* Fetch profile */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/my-proxy/api/v1/admin/profile");

        if (res.data.profile) {
          setForm(res.data.profile);
        }
      } catch {
        toast.error("Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateField = (field: keyof AdminProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setSaving(true);

    try {
      await axios.post("/api/my-proxy/api/v1/admin/profile", form);
      toast.success("Profile saved successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <Container className="rounded-xl border !border-gray-300 py-6 px-8 mt-12 max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold ">Admin profile</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full name */}
          <div>
            <Label>Full name</Label>
            <Input
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone number</Label>
            <Input
              value={form.phoneNo || ""}
              onChange={(e) => updateField("phoneNo", e.target.value)}
            />
          </div>

          {/* Organization dropdown */}
          <div>
            <Label>Organization</Label>
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.organization}
              onChange={(e) => updateField("organization", e.target.value)}
            >
              <option value="PES Modern College of Engineering">
                PES Modern College of Engineering
              </option>

              {/* Future ready (can add more later) */}
              {/* <option value="Another College">Another College</option> */}
            </select>
          </div>

          {/* Designation */}
          <div>
            <Label>Designation</Label>
            <Input
              value={form.designation}
              onChange={(e) => updateField("designation", e.target.value)}
              placeholder="TPO / Placement Officer / Admin"
              required
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <Button onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </Container>
    </div>
  );
}
