"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textArea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateExperiencePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    role: "",
    difficulty: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await axios.post("/api/my-proxy/api/v1/student/interview-experience", {
        ...form,
      });

      toast.success("Experience shared successfully");
      router.push("/student/experiences");
      await queryClient.invalidateQueries({
        queryKey: ["interview-experiences"],
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to post experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Share Interview Experience</h1>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            name="title"
            placeholder="Experience Title"
            value={form.title}
            onChange={handleChange}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="company"
              placeholder="Company"
              value={form.company}
              onChange={handleChange}
            />
            <Input
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
            />
          </div>

          <Select
            value={form.difficulty}
            onValueChange={(v) => setForm({ ...form, difficulty: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Experience</CardTitle>
        </CardHeader>

        <CardContent>
          <Textarea
            name="content"
            placeholder="Describe your overall experience..."
            value={form.content}
            onChange={handleChange}
            className="min-h-[150px]"
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Posting..." : "Post Experience"}
        </Button>
      </div>
    </div>
  );
}
