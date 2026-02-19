"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInterviewExperienceById } from "@/hooks/useInterviewExperienceById";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { IconTrash } from "@tabler/icons-react";

const initialFormState = {
  title: "",
  company: "",
  role: "",
  difficulty: "",
  content: "",
};

const EditExperience = () => {
  const { experienceId } = useParams<{ experienceId: string }>();

  const { data, isLoading } = useInterviewExperienceById(experienceId);
  const { data: userData } = useStudentProfile();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        company: data.company || "",
        role: data.role || "",
        difficulty: data.difficulty || "",
        content: data.content || "",
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.put(
        `/api/my-proxy/api/v1/student/interview-experience/${experienceId}`,
        {
          ...form,
        },
      );
      toast.success("Experience updated successfully");
      await queryClient.invalidateQueries({
        queryKey: ["interview-experience", experienceId],
      });
      router.push("/student/experiences");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update experience");
    } finally {
      setLoading(false);
    }
  };

  const deleteInternship = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/my-proxy/api/v1/student/interview-experience/${experienceId}`,
      );
      toast.success("Experience deleted successfully");
      router.push("/student/experiences");
      await queryClient.invalidateQueries({
        queryKey: ["interview-experiences"],
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    userData?.profile.id === data?.author.id && (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold">Edit Interview Experience</h1>

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

        <div className="flex justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              className="text-red-500"
              onClick={() => deleteInternship()}
              disabled={loading}
            >
              <IconTrash className="h-4 w-4 mr-1" />
              Delete Experience
            </Button>
          </div>
          <div>
            <Button variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Updating..." : "Save Experience"}
            </Button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditExperience;
