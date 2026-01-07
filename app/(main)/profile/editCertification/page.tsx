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
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type CertificateForm = {
  id?: string;
  title: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl: string;
  isNew?: boolean;
  isEditing?: boolean;
};

export default function EditCertification() {
  const { data, isLoading, error } = useStudentProfile();
  const certificates = data?.profile?.certifications || [];

  const [items, setItems] = useState<CertificateForm[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  /* Prefill */
  useEffect(() => {
    setItems(
      certificates.map((c: any) => ({
        id: c.id,
        title: c.title,
        organization: c.organization,
        issueDate: c.issueDate?.slice(0, 10),
        expiryDate: c.expiryDate?.slice(0, 10) || "",
        credentialId: c.credentialId || "",
        credentialUrl: c.credentialUrl,
        isEditing: false,
      }))
    );
  }, [certificates]);

  const updateField = (
    index: number,
    field: keyof CertificateForm,
    value: string
  ) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const toggleEdit = (index: number, value: boolean) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index].isEditing = value;
      return copy;
    });
  };

  /* Add new */
  const addNew = () => {
    setItems((prev) => [
      ...prev,
      {
        title: "",
        organization: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        credentialUrl: "",
        isNew: true,
        isEditing: true,
      },
    ]);
  };

  /* Save */
  const saveCertificate = async (item: CertificateForm) => {
    setSavingId(item.id || "new");

    try {
      if (item.isNew) {
        await axios.post("/api/my-proxy/api/v1/student/addCertificate", item);
        toast.success("Certificate added successfully");
      } else {
        await axios.put(
          `/api/my-proxy/api/v1/student/certificate/${item.id}`,
          item
        );
        toast.success("Certificate updated successfully");
      }

      await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save certificate");
    } finally {
      setSavingId(null);
    }
  };

  /* Delete */
  const deleteCertificate = async (item: CertificateForm) => {
    if (!item.id) {
      setItems((prev) => prev.filter((i) => i !== item));
      return;
    }

    toast.warning("Delete this certificate?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axios.delete(
              `/api/my-proxy/api/v1/student/certificate/${item.id}`
            );
            toast.success("Certificate deleted successfully");
            await queryClient.invalidateQueries({
              queryKey: ["student-profile"],
            });
          } catch (err: any) {
            toast.error(
              err.response?.data?.error || "Failed to delete certificate"
            );
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load certificates</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit certifications</h1>

      <Container className="rounded-xl border !border-gray-300 py-6 px-8 max-w-4xl space-y-8">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No certifications added yet
          </p>
        )}

        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="rounded-lg border border-border bg-background p-4 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.title}
                  onChange={(e) => updateField(index, "title", e.target.value)}
                />
              </div>

              <div>
                <Label>Organization</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.organization}
                  onChange={(e) =>
                    updateField(index, "organization", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Issue Date</Label>
                <Input
                  type="date"
                  disabled={!item.isEditing}
                  value={item.issueDate}
                  onChange={(e) =>
                    updateField(index, "issueDate", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Expiry Date (optional)</Label>
                <Input
                  type="date"
                  disabled={!item.isEditing}
                  value={item.expiryDate}
                  onChange={(e) =>
                    updateField(index, "expiryDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label>Credential URL</Label>
              <Input
                disabled={!item.isEditing}
                value={item.credentialUrl}
                onChange={(e) =>
                  updateField(index, "credentialUrl", e.target.value)
                }
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                className="text-red-500"
                onClick={() => deleteCertificate(item)}
              >
                <IconTrash className="h-4 w-4 mr-1" />
                Delete
              </Button>

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
                    variant="ghost"
                    onClick={() => toggleEdit(index, false)}
                  >
                    <IconX className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => saveCertificate(item)}
                    disabled={savingId === (item.id || "new")}
                  >
                    {savingId === (item.id || "new") ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        <Button className="w-full" onClick={addNew}>
          <IconPlus className="h-4 w-4 mr-2" />
          Add certificate
        </Button>
      </Container>
    </div>
  );
}
