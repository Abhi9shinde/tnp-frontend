import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useStudentNotifications() {
  return useQuery({
    queryKey: ["student-notifications"],
    queryFn: async () => {
      const { data } = await axios.get(
        "/api/my-proxy/api/v1/student/notifications",
        { withCredentials: true }
      );
      return data.jobs;
    },
  });
}