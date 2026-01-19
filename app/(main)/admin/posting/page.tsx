"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
    role: "",
    company: "",
    companyInfo: "",
    description: "",
    ctc: "",
    deadline: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (
      !formData.role ||
      !formData.company ||
      !formData.description ||
      !formData.ctc ||
      !formData.deadline
    ) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/my-proxy/api/v1/admin/addPostingDetails", {
        ...formData,
        // Ensure ctc is string if backend expects string, though input is already text
        // Ensure deadline is in a format Date constructor can parse
        deadline: new Date(formData.deadline).toISOString(),
      });

      toast.success("Job posting created successfully");
      router.push("/admin/dashboard");
      // Optional: Reset form if staying on page
      // setFormData({ role: "", company: "", ... });
    } catch (error: any) {
      console.error("Error creating posting:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to create job posting";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-primary">
          Create New Job Posting
        </h1>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Enter the details for the new placement drive. Make sure all information is accurate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role">Job Role <span className="text-destructive">*</span></Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="e.g. Software Engineer"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name <span className="text-destructive">*</span></Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctc">CTC (LPA) <span className="text-destructive">*</span></Label>
                <Input
                  id="ctc"
                  name="ctc"
                  placeholder="e.g. 12"
                  value={formData.ctc}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline <span className="text-destructive">*</span></Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyInfo">Company Information</Label>
              <Textarea
                id="companyInfo"
                name="companyInfo"
                placeholder="Brief description about the company..."
                value={formData.companyInfo}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detailed job responsibilities and requirements..."
                value={formData.description}
                onChange={handleChange}
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
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