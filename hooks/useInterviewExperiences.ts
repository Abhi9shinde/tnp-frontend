import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useInterviewExperiences() {
  return useQuery({
    queryKey: ["interview-experiences"],
    queryFn: async () => {
      const { data } = await axios.get(
        "/api/my-proxy/api/v1/student/interview-experiences",
      );
      return data.experiences;
    },
  });
}
