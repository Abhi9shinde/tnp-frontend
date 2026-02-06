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

type AchievementForm = {
  id?: string;
  title: string;
  description: string;
  date?: string;
  type?: string;
  isNew?: boolean;
  isEditing?: boolean;
};

export default function EditAchievements() {
  const { data, isLoading, error } = useStudentProfile();
  const achievements = data?.profile?.achievements || [];
  const queryClient = useQueryClient();

  const [items, setItems] = useState<AchievementForm[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  /* Prefill */
  useEffect(() => {
    setItems(
      achievements.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description || "",
        date: a.date ? a.date.split("T")[0] : "",
        type: a.type || "",
        isEditing: false,
      })),
    );
  }, [achievements]);

  const updateField = (
    index: number,
    field: keyof AchievementForm,
    value: string,
  ) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const enableEdit = (index: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index].isEditing = true;
      return copy;
    });
  };

  const cancelEdit = (index: number) => {
    if (items[index].isNew) {
      setItems((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...achievements[index],
        description: achievements[index].description || "",
        date: achievements[index].date
          ? achievements[index].date.split("T")[0]
          : "",
        type: achievements[index].type || "",
        isEditing: false,
      };
      return copy;
    });
  };

  const addNew = () => {
    setItems((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        date: "",
        type: "",
        isNew: true,
        isEditing: true,
      },
    ]);
  };

  const saveAchievement = async (item: AchievementForm) => {
    setSavingId(item.id || "new");

    try {
      if (item.isNew) {
        await axios.post("/api/my-proxy/api/v1/student/addAchievement", {
          title: item.title,
          description: item.description,
          date: item.date,
          type: item.type,
        });
        toast.success("Achievement added");
      } else {
        await axios.put(
          `/api/my-proxy/api/v1/student/editAchievement/${item.id}`,
          {
            title: item.title,
            description: item.description,
            date: item.date,
            type: item.type,
          },
        );
        toast.success("Achievement updated");
      }

      await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save achievement");
    } finally {
      setSavingId(null);
    }
  };

  const deleteAchievement = async (item: AchievementForm) => {
    if (!item.id) {
      setItems((prev) => prev.filter((i) => i !== item));
      return;
    }

    toast.warning("Delete Achievement?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axios.delete(
              `/api/my-proxy/api/v1/student/achievement/${item.id}`,
            );

            await queryClient.invalidateQueries({
              queryKey: ["student-profile"],
            });

            toast.success("Achievement deleted");
          } catch (err: any) {
            toast.error(
              err.response?.data?.error || "Failed to delete achievement",
            );
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load achievements</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit achievements</h1>

      <Container className="rounded-xl border !border-gray-300 py-6 px-8 max-w-4xl space-y-8">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="rounded-lg border border-border p-4 space-y-4"
          >
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
                <Label>Type</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.type}
                  onChange={(e) => updateField(index, "type", e.target.value)}
                  placeholder="Award, Competition, Scholarship"
                />
              </div>

              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  disabled={!item.isEditing}
                  value={item.date}
                  onChange={(e) => updateField(index, "date", e.target.value)}
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
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                className="text-red-500"
                onClick={() => deleteAchievement(item)}
              >
                <IconTrash className="h-4 w-4 mr-1" />
                Delete
              </Button>

              {!item.isEditing ? (
                <Button variant="ghost" onClick={() => enableEdit(index)}>
                  <IconPencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => cancelEdit(index)}>
                    <IconX className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>

                  <Button
                    onClick={() => saveAchievement(item)}
                    disabled={savingId === (item.id || "new")}
                  >
                    <IconCheck className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        <Button className="w-full" onClick={addNew}>
          <IconPlus className="h-4 w-4 mr-2" />
          Add achievement
        </Button>
      </Container>
    </div>
  );
}
