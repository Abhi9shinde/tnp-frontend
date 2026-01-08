"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { IconX, IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { ALL_SKILLS as Skills } from "@/constants/skills";

const ALL_SKILLS = Skills;

export default function EditSkill() {
  const { data, isLoading, error } = useStudentProfile();
  const existingSkills: string[] = data?.profile?.skills || [];

  const [skills, setSkills] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();

  /* Prefill */
  useEffect(() => {
    setSkills(existingSkills);
  }, [existingSkills]);

  /* Filter skills */
  const filteredSkills = useMemo(() => {
    return ALL_SKILLS.filter(
      (skill) =>
        skill.toLowerCase().includes(query.toLowerCase()) &&
        !skills.includes(skill)
    );
  }, [query, skills]);

  const canAddCustom =
    query.trim().length > 0 &&
    !ALL_SKILLS.some((s) => s.toLowerCase() === query.toLowerCase()) &&
    !skills.includes(query);

  const addSkill = (skill: string) => {
    setSkills((prev) => [...prev, skill]);
    setQuery("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const saveSkills = async () => {
    setSaving(true);
    try {
      await axios.put("/api/my-proxy/api/v1/student/editProfile", {
        skills,
      });

      await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });

      toast.success("Skills updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update skills");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load skills</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit skills</h1>

      <Container className="rounded-xl border !border-gray-300 py-6 px-8 max-w-4xl space-y-6">
        {/* Selected skills */}
        <div>
          <Label className="mb-2 block">Your skills</Label>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)}>
                    <IconX className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills added yet</p>
          )}
        </div>

        {/* Search */}
        <div>
          <Label>Add skills</Label>
          <Input
            placeholder="Search or add a skill..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {(filteredSkills.length > 0 || canAddCustom) && (
            <div className="mt-2 rounded-md border bg-background shadow-sm max-h-56 overflow-y-auto">
              {filteredSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                >
                  {skill}
                </button>
              ))}

              {canAddCustom && (
                <button
                  onClick={() => addSkill(query)}
                  className="w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center gap-2"
                >
                  <IconPlus className="h-4 w-4" />
                  Add "{query}"
                </button>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button onClick={saveSkills} disabled={saving}>
            {saving ? "Saving..." : "Save skills"}
          </Button>
        </div>
      </Container>
    </div>
  );
}
