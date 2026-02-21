import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Job = {
  id: string;
  company: string;
  role: string;
  createdAt: string;
  deadline: string;
};

export function useStudentNotifications() {
  return useQuery<Job[]>({
    queryKey: ["student-notifications"],
    queryFn: async () => {
      const { data } = await axios.get(
        "/api/my-proxy/api/v1/student/notifications"
      );
      return data.jobs;
    },
  });
}