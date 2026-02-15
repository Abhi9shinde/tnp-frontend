import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useNotifyEligibleStudents(jobId: string) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        `/api/my-proxy/api/v1/admin/jobs/${jobId}/notify`
      );

      return data;
    },
  });
}
