"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BRANCHES as branches } from "@/constants/branches";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textArea";
import { Button } from "@/components/ui/button";

export default function Posting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Posting
    role: "",
    company: "",
    companyInfo: "",
    description: "",
    ctc: "",
    deadline: "",

    // Eligibility
    minCGPA: "",
    minTenth: "",
    minTwelfth: "",
    minDiploma: "",
    maxBacklogs: "",
    passingYear: "",
    allowedBranches: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBranch = (branch: string) => {
    setFormData((prev) => ({
      ...prev,
      allowedBranches: prev.allowedBranches.includes(branch)
        ? prev.allowedBranches.filter((b) => b !== branch)
        : [...prev.allowedBranches, branch],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.allowedBranches.length === 0) {
      toast.error("Please select at least one allowed branch");
      setLoading(false);
      return;
    }

    try {
      // 1️Create Job Posting
      await axios.post("/api/my-proxy/api/v1/admin/createJobWithEligibility", {
        job: {
          role: formData.role,
          company: formData.company,
          companyInfo: formData.companyInfo,
          description: formData.description,
          ctc: formData.ctc,
          deadline: new Date(formData.deadline).toISOString(),
        },
        eligibility: {
          minCGPA: Number(formData.minCGPA),
          minTenth: Number(formData.minTenth),
          minTwelfth: Number(formData.minTwelfth),
          minDiploma: Number(formData.minDiploma),
          maxBacklogs: Number(formData.maxBacklogs),
          allowedBranches: formData.allowedBranches,
          passingYear: Number(formData.passingYear),
        },
      });

      toast.success("Job posting created successfully");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to create job posting",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
        Create Job Posting
      </h1>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Basic information about the placement drive
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  Job Role <span className="text-destructive">*</span>
                </Label>
                <Input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  placeholder="Enter Job Role"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  CTC (LPA) <span className="text-destructive">*</span>
                </Label>
                <Input
                  name="ctc"
                  value={formData.ctc}
                  onChange={handleChange}
                  required
                  placeholder="CTC in Lakhs"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Application Deadline{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Company Information <span className="text-destructive">*</span>
              </Label>
              <Textarea
                name="companyInfo"
                value={formData.companyInfo}
                onChange={handleChange}
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>
                Job Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[150px]"
                required
              />
            </div>

            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
                <CardDescription>
                  Academic requirements for applying
                </CardDescription>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Minimum CGPA"
                  name="minCGPA"
                  onChange={handleChange}
                />
                <InputField
                  label="Max Backlogs"
                  name="maxBacklogs"
                  onChange={handleChange}
                />
                <InputField
                  label="Minimum 10th %"
                  name="minTenth"
                  onChange={handleChange}
                />
                <InputField
                  label="Minimum 12th %"
                  name="minTwelfth"
                  onChange={handleChange}
                />
                <InputField
                  label="Minimum Diploma %"
                  name="minDiploma"
                  onChange={handleChange}
                />
                <InputField
                  label="Passing Year"
                  name="passingYear"
                  onChange={handleChange}
                />

                <div className="md:col-span-2 space-y-2">
                  <Label>
                    Allowed Branches <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {branches.map((branch) => (
                      <Button
                        key={branch}
                        type="button"
                        size="sm"
                        variant={
                          formData.allowedBranches.includes(branch)
                            ? "default"
                            : "ghost"
                        }
                        onClick={() => toggleBranch(branch)}
                      >
                        {branch}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Posting
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function InputField({
  label,
  name,
  onChange,
}: {
  label: string;
  name: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label} <span className="text-destructive">*</span>
      </Label>
      <Input type="number" name={name} onChange={onChange} required/>
    </div>
  );
}
