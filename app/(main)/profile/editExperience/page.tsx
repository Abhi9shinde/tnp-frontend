"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import axios from "axios";
import {
  IconTrash,
  IconPlus,
  IconPencil,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";

type InternshipForm = {
  id?: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  isNew?: boolean;
  isEditing?: boolean;
};

export default function EditExperience() {
  const { data, isLoading, error } = useStudentProfile();
  const internships = data?.profile?.internships || [];
  const queryClient = useQueryClient();

  const [items, setItems] = useState<InternshipForm[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  /* Prefill */
  useEffect(() => {
    setItems(
      internships.map((i: any) => ({
        id: i.id,
        company: i.company,
        role: i.role,
        duration: i.duration,
        description: i.description,
        isEditing: false,
      }))
    );
  }, [internships]);

  const updateField = (
    index: number,
    field: keyof InternshipForm,
    value: string
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
        ...internships[index],
        isEditing: false,
      };
      return copy;
    });
  };

  const addNew = () => {
    setItems((prev) => [
      ...prev,
      {
        company: "",
        role: "",
        duration: "",
        description: "",
        isNew: true,
        isEditing: true,
      },
    ]);
  };

  const saveInternship = async (item: InternshipForm, index: number) => {
    setSavingId(item.id || "new");

    try {
      if (item.isNew) {
        await axios.post("/api/my-proxy/api/v1/student/addInternship", {
          company: item.company,
          role: item.role,
          duration: item.duration,
          description: item.description,
        });
      } else {
        await axios.put(`/api/my-proxy/api/v1/student/internship/${item.id}`, {
          company: item.company,
          role: item.role,
          duration: item.duration,
          description: item.description,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save internship");
    } finally {
      setSavingId(null);
    }
  };

  const deleteInternship = async (item: InternshipForm) => {
    if (!item.id) {
      setItems((prev) => prev.filter((i) => i !== item));
      return;
    }

    if (!confirm("Delete this internship?")) return;

    await axios.delete(`/api/my-proxy/api/v1/student/internship/${item.id}`);
    await queryClient.invalidateQueries({
      queryKey: ["student-profile"],
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load internships</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit experience</h1>

      <Container className="rounded-xl border !border-gray-300 py-6 px-8 max-w-4xl space-y-8">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="rounded-lg border border-border p-4 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Company</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.company}
                  onChange={(e) =>
                    updateField(index, "company", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Role</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.role}
                  onChange={(e) => updateField(index, "role", e.target.value)}
                />
              </div>

              <div>
                <Label>Duration</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.duration}
                  onChange={(e) =>
                    updateField(index, "duration", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Input
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
                onClick={() => deleteInternship(item)}
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
                    onClick={() => saveInternship(item, index)}
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
          Add internship
        </Button>
      </Container>
    </div>
  );
}
