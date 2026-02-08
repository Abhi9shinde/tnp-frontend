import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useJobApplications(jobId: string) {
  return useQuery({
    queryKey: ["job-applications", jobId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/my-proxy/api/v1/admin/jobs/${jobId}/applications`,
      );
      return data.applications;
    },
    enabled: !!jobId,
  });
}
