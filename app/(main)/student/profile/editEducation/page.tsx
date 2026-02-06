"use client";

import { useEffect, useState, FormEvent } from "react";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import axios from "axios";
import { BRANCHES as branches } from "@/constants/branches";
import { useQueryClient } from "@tanstack/react-query";

export default function EditEducation() {
  const { data, isLoading, error } = useStudentProfile();
  const education = data?.profile?.education;

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    branch: "",
    enrollmentYear: "",
    cgpa: "",
    backlogs: "",
    tenthPercent: "",
    tenthYear: "",
    twelfthPercent: "",
    twelfthYear: "",
    diplomaPercent: "",
    diplomaYear: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  /* Prefill education */
  useEffect(() => {
    if (!education) return;

    setFormData({
      branch: education.branch ?? "",
      enrollmentYear: education.enrollmentYear?.toString() || "",
      cgpa: education.cgpa?.toString() || "",
      backlogs: education.backlogs?.toString() || "",
      tenthPercent: education.tenthPercent?.toString() || "",
      tenthYear: education.tenthYear?.toString() || "",
      twelfthPercent: education.twelfthPercent?.toString() || "",
      twelfthYear: education.twelfthYear?.toString() || "",
      diplomaPercent: education.diplomaPercent?.toString() || "",
      diplomaYear: education.diplomaYear?.toString() || "",
    });
  }, [education]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await axios.put("/api/my-proxy/api/v1/student/editEducation", {
        branch: formData.branch,
        enrollmentYear: Number(formData.enrollmentYear),
        cgpa: Number(formData.cgpa),
        backlogs: Number(formData.backlogs),
        tenthPercent: formData.tenthPercent
          ? Number(formData.tenthPercent)
          : null,
        tenthYear: formData.tenthYear ? Number(formData.tenthYear) : null,

        twelfthPercent: formData.twelfthPercent
          ? Number(formData.twelfthPercent)
          : null,
        twelfthYear: formData.twelfthYear ? Number(formData.twelfthYear) : null,

        diplomaPercent: formData.diplomaPercent
          ? Number(formData.diplomaPercent)
          : 0,
        diplomaYear: formData.diplomaYear ? Number(formData.diplomaYear) : 0,
      });

      await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });

      setMessage("Education details saved successfully");
      toast.success("Education details saved successfully");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to save education");
      toast.error(err.response?.data?.error || "Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const BRANCHES = branches; //from constants

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load education</p>;

  console.log(formData.branch);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit education details</h1>

      <Container className="rounded-xl border !border-gray-300 py-6 px-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Degree Info */}
          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-500">
              Degree Information
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Branch</Label>
                <Select
                  key={formData.branch}
                  value={formData.branch || undefined}
                  onValueChange={(value) => updateField("branch", value)}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Enrollment Year</Label>
                <Input
                  type="number"
                  value={formData.enrollmentYear}
                  min={0}
                  onChange={(e) =>
                    updateField("enrollmentYear", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <Label>CGPA</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={formData.cgpa}
                  onChange={(e) => updateField("cgpa", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Backlogs</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.backlogs}
                  onChange={(e) => updateField("backlogs", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Schooling */}
          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-500">
              Schooling
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>10th Percentage</Label>
                <Input
                  value={formData.tenthPercent}
                  min={0}
                  onChange={(e) => updateField("tenthPercent", e.target.value)}
                />
              </div>

              <div>
                <Label>10th Passing Year</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.tenthYear}
                  onChange={(e) => updateField("tenthYear", e.target.value)}
                />
              </div>

              <div>
                <Label>12th Percentage</Label>
                <Input
                  value={formData.twelfthPercent}
                  min={0}
                  onChange={(e) =>
                    updateField("twelfthPercent", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>12th Passing Year</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.twelfthYear}
                  onChange={(e) => updateField("twelfthYear", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Diploma */}
          <div>
            <p className="mb-3 text-sm font-semibold text-neutral-500">
              Diploma (Optional)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Diploma Percentage</Label>
                <Input
                  value={formData.diplomaPercent}
                  min={0}
                  onChange={(e) =>
                    updateField("diplomaPercent", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Diploma Passing Year</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.diplomaYear}
                  onChange={(e) => updateField("diplomaYear", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save education"}
            </Button>
            {message && <p className="text-sm text-neutral-500">{message}</p>}
          </div>
        </form>
      </Container>
    </div>
  );
}
