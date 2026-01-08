"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  PLATFORMS as platforms,
  PLATFORM_URL_REGEX as platform_regex,
} from "@/constants/socials";

type SocialForm = {
  id?: string;
  platform:
    | "github"
    | "linkedin"
    | "leetcode"
    | "kaggle"
    | "hackster"
    | "grabCad"
    | "medium"
    | "";
  url: string;
  isNew?: boolean;
  isEditing?: boolean;
};

const PLATFORMS = platforms; //from constants

const PLATFORM_URL_REGEX: Record<string, RegExp> = platform_regex; //from constants

export default function EditSocial() {
  const { data, isLoading, error } = useStudentProfile();
  const socials = data?.profile?.socials || [];

  const [items, setItems] = useState<SocialForm[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  /* Prefill */
  useEffect(() => {
    setItems(
      socials.map((s: any) => ({
        id: s.id,
        platform: s.platform,
        url: s.url,
        isEditing: false,
      }))
    );
  }, [socials]);

  const usedPlatforms = items.map((i) => i.platform);

  const updateField = (
    index: number,
    field: keyof SocialForm,
    value: string
  ) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  /* Add new */
  const addNew = () => {
    setItems((prev) => [
      ...prev,
      {
        platform: "",
        url: "",
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

  /* Save */
  const saveSocial = async (item: SocialForm) => {
    const error = validateSocialUrl(item.platform, item.url);

    if (error) {
      toast.error(error);
      return;
    }

    setSavingId(item.id || "new");

    try {
      if (item.isNew) {
        await axios.post("/api/my-proxy/api/v1/student/addSocial", {
          platform: item.platform,
          url: item.url,
        });
        toast.success("Social added");
      } else {
        await axios.put(`/api/my-proxy/api/v1/student/social/${item.id}`, {
          url: item.url,
        });
        toast.success("Social updated");
      }

      await queryClient.invalidateQueries({
        queryKey: ["student-profile"],
      });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save social");
    } finally {
      setSavingId(null);
    }
  };

  /* Delete */
  const deleteSocial = async (item: SocialForm) => {
    if (!item.id) {
      setItems((prev) => prev.filter((i) => i !== item));
      return;
    }

    toast.warning("Delete this social link?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axios.delete(
              `/api/my-proxy/api/v1/student/social/${item.id}`
            );

            await queryClient.invalidateQueries({
              queryKey: ["student-profile"],
            });

            toast.success("Social link deleted");
          } catch (err: any) {
            toast.error(
              err.response?.data?.error || "Failed to delete social link"
            );
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load socials</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit social links</h1>

      <Container className="rounded-xl border !border-gray-300 py-6 px-8 max-w-4xl space-y-6">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No social links added yet
          </p>
        )}

        {items.map((item, index) => (
          <div
            key={item.id || index}
            className="rounded-lg border border-border bg-background p-4 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="font-semibold capitalize">
                {item.platform || "New social"}
              </p>

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
                    onClick={() => saveSocial(item)}
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
                <Label>Platform</Label>
                <Select
                  disabled={!item.isNew}
                  value={item.platform}
                  onValueChange={(value) =>
                    updateField(index, "platform", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.filter(
                      (p) =>
                        !usedPlatforms.includes(p.value) ||
                        p.value === item.platform
                    ).map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Profile URL</Label>
                <Input
                  disabled={!item.isEditing}
                  value={item.url}
                  onChange={(e) => updateField(index, "url", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Delete */}
            <div className="pt-2">
              <Button
                variant="ghost"
                className="text-red-500"
                onClick={() => deleteSocial(item)}
              >
                <IconTrash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}

        {/* Add */}
        {usedPlatforms.length < PLATFORMS.length && (
          <Button className="w-full" onClick={addNew}>
            <IconPlus className="h-4 w-4 mr-2" />
            Add social link
          </Button>
        )}
      </Container>
    </div>
  );
}

function validateSocialUrl(platform: string, url: string): string | null {
  if (!platform) return "Select platform first";

  const regex = PLATFORM_URL_REGEX[platform];
  if (!regex) return null;

  return regex.test(url)
    ? null
    : `Invalid ${platform.toUpperCase()} profile URL`;
}
