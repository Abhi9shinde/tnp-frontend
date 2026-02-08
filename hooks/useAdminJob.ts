import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAdminJob(jobId: string) {
  return useQuery({
    queryKey: ["admin-job", jobId],
    enabled: !!jobId,
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/my-proxy/api/v1/admin/jobs/${jobId}`,
      );
      return data;
    },
  });
}
