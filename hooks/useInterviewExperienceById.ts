import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useInterviewExperienceById(id: string) {
  return useQuery({
    queryKey: ["interview-experience", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/my-proxy/api/v1/student/interview-experience/${id}`,
      );
      return data.experience;
    },
  });
}
