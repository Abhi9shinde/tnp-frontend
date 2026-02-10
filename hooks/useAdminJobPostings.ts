// This hook is used to fetch the job postings for the admin dashboard.
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Posting } from "@/lib/types";

export function useAdminJobPostings() {
  return useQuery({
    queryKey: ["admin-job-postings"],
    queryFn: async () => {
      const { data } = await axios.get("/api/my-proxy/api/v1/admin/jobs");
      return data.jobs as Posting[];
    },
    staleTime: 30 * 1000,
  });
}
