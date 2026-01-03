import { useQuery } from "@tanstack/react-query";

export function useStudentProfile() {
  return useQuery({
    queryKey: ["student-profile"],
    queryFn: async () => {
      const res = await fetch("/api/my-proxy/api/v1/student/profile/full");

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
