"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textArea";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import axios from "axios";
import {
  IconTrash,
  IconPlus,
  IconPencil,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type ProjectForm = {
  id?: string;
  title: string;
  description: string;
  link: string;
  techStack: string; // comma separated for UI
  isNew?: boolean;
  isEditing?: boolean;
};

export default function EditProject() {
  const { data, isLoading, error } = useStudentProfile();
  const projects = data?.profile?.projects || [];

  const [items, setItems] = useState<ProjectForm[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  /* Prefill */
  useEffect(() => {
    setItems(
      projects.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        link: p.link || "",
        techStack: p.techStack.join(", "),
        isEditing: false,
      }))
    );
  }, [projects]);

  const updateField = (
    index: number,
    field: keyof ProjectForm,
    value: string
  ) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  /* Add new project */
  const addNew = () => {
    setItems((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        link: "",
        techStack: "",
        isNew: true,
        isEditing: true,
      },
    ]);
  };

  /* Toggle edit */
  const toggleEdit = (index: number, value: boolean) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index].isEditing = value;
      return copy;
    });
  };

  /* Save project */
  const saveProject = async (item: ProjectForm) => {
    setSavingId(item.id || "new");

    const payload = {
      title: item.title,
      description: item.description,
      link: item.link,
      techStack: item.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (item.isNew) {
        await axios.post("/api/my-proxy/api/v1/student/addProject", payload);
        toast.success("Project added");
      } else {
        await axios.put(
          `/api/my-proxy/api/v1/student/editProject/${item.id}`,
          payload
        );
        toast.success("Project updated");
      }

      await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save project");
    } finally {
      setSavingId(null);
    }
  };

  /* Delete */
  const deleteProject = async (item: ProjectForm) => {
    if (!item.id) {
      setItems((prev) => prev.filter((i) => i !== item));
      return;
    }

    toast.warning("Delete this project?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axios.delete(
              `/api/my-proxy/api/v1/student/project/${item.id}`
            );
            await queryClient.invalidateQueries({
              queryKey: ["student-profile"],
            });
          } catch (err: any) {
            alert(err.response?.data?.error || "Failed to delete project");
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load projects</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit projects</h1>

      <Container className="rounded-xl border !border-gray-300 py-6 px-8 max-w-4xl space-y-8">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No projects added yet</p>
        )}

        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="rounded-lg border border-border bg-background p-4 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{item.title || "New project"}</h3>

              {!item.isEditing ? (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleEdit(index, true)}
                >
                  <IconPencil className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    onClick={() => saveProject(item)}
                    disabled={savingId === (item.id || "new")}
                  >
                    <IconCheck className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleEdit(index, false)}
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.title}
                  onChange={(e) => updateField(index, "title", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Project link</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.link}
                  onChange={(e) => updateField(index, "link", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                disabled={!item.isEditing}
                value={item.description}
                onChange={(e) =>
                  updateField(index, "description", e.target.value)
                }
                rows={2}
                className="resize-none"
                required
              />
            </div>

            <div>
              <Label>Tech stack (comma separated)</Label>
              <Input
                disabled={!item.isEditing}
                value={item.techStack}
                onChange={(e) =>
                  updateField(index, "techStack", e.target.value)
                }
                required
              />
            </div>

            {/* Delete */}
            <div className="pt-2">
              <Button
                variant="ghost"
                className="text-red-500"
                onClick={() => deleteProject(item)}
              >
                <IconTrash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}

        {/* Add new */}
        <Button className="w-full" onClick={addNew}>
          <IconPlus className="h-4 w-4 mr-2" />
          Add project
        </Button>
      </Container>
    </div>
  );
}
