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

type CertificationForm = {
  id?: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
  isNew?: boolean;
  isEditing?: boolean;
};

export default function EditCertification() {
  const { data, isLoading, error } = useStudentProfile();
  const certifications = data?.profile?.certifications || [];
  const queryClient = useQueryClient();

  const [items, setItems] = useState<CertificationForm[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  /* Prefill */
  useEffect(() => {
    setItems(
      certifications.map((c: any) => ({
        id: c.id,
        name: c.name,
        issuingOrganization: c.issuingOrganization,
        issueDate: c.issueDate ? new Date(c.issueDate).toISOString().split('T')[0] : "",
        expirationDate: c.expirationDate ? new Date(c.expirationDate).toISOString().split('T')[0] : "",
        credentialId: c.credentialId || "",
        credentialUrl: c.credentialUrl || "",
        isEditing: false,
      }))
    );
  }, [certifications]);

  const updateField = (
    index: number,
    field: keyof CertificationForm,
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

    const original = certifications.find((c: any) => c.id === items[index].id);
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        id: original.id,
        name: original.name,
        issuingOrganization: original.issuingOrganization,
        issueDate: original.issueDate ? new Date(original.issueDate).toISOString().split('T')[0] : "",
        expirationDate: original.expirationDate ? new Date(original.expirationDate).toISOString().split('T')[0] : "",
        credentialId: original.credentialId || "",
        credentialUrl: original.credentialUrl || "",
        isEditing: false,
      };
      return copy;
    });
  };

  const addNew = () => {
    setItems((prev) => [
      ...prev,
      {
        name: "",
        issuingOrganization: "",
        issueDate: "",
        expirationDate: "",
        credentialId: "",
        credentialUrl: "",
        isNew: true,
        isEditing: true,
      },
    ]);
  };

  const saveCertification = async (item: CertificationForm, index: number) => {
    setSavingId(item.id || "new");

    try {
      if (item.isNew) {
        await axios.post("/api/my-proxy/api/v1/student/addCertification", {
            name: item.name,
            issuingOrganization: item.issuingOrganization,
            issueDate: item.issueDate ? new Date(item.issueDate).toISOString() : null,
            expirationDate: item.expirationDate ? new Date(item.expirationDate).toISOString() : null,
            credentialId: item.credentialId,
            credentialUrl: item.credentialUrl,
        });
      } else {
        await axios.put(`/api/my-proxy/api/v1/student/certification/${item.id}`, {
            name: item.name,
            issuingOrganization: item.issuingOrganization,
            issueDate: item.issueDate ? new Date(item.issueDate).toISOString() : null,
            expirationDate: item.expirationDate ? new Date(item.expirationDate).toISOString() : null,
            credentialId: item.credentialId,
            credentialUrl: item.credentialUrl,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to save certification");
    } finally {
      setSavingId(null);
    }
  };

  const deleteCertification = async (item: CertificationForm) => {
    if (!item.id) {
      setItems((prev) => prev.filter((i) => i !== item));
      return;
    }

    if (!confirm("Delete this certification?")) return;

    try {
        await axios.delete(`/api/my-proxy/api/v1/student/certification/${item.id}`);
        await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
        });
    } catch (err: any) {
        alert(err.response?.data?.error || "Failed to delete certification");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load certifications</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit certifications</h1>

      <Container className="rounded-xl border !border-gray-300 py-6 px-8 max-w-4xl space-y-8">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="rounded-lg border border-border p-4 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.name}
                  onChange={(e) =>
                    updateField(index, "name", e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <Label>Issuing Organization</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.issuingOrganization}
                  onChange={(e) => updateField(index, "issuingOrganization", e.target.value)}
                  required
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
                  required
                />
              </div>

              <div>
                <Label>Expiration Date</Label>
                <Input
                  type="date"
                  disabled={!item.isEditing}
                  value={item.expirationDate}
                  onChange={(e) =>
                    updateField(index, "expirationDate", e.target.value)
                  }
                />
              </div>
              
              <div>
                <Label>Credential ID</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.credentialId}
                  onChange={(e) =>
                    updateField(index, "credentialId", e.target.value)
                  }
                />
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
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                className="text-red-500"
                onClick={() => deleteCertification(item)}
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
                    onClick={() => saveCertification(item, index)}
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
          Add certification
        </Button>
      </Container>
    </div>
  );
}
