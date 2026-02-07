import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Posting } from "@/lib/types";

export function useJobPostings() {
  return useQuery({
    queryKey: ["job-postings"],
    queryFn: async () => {
      const { data } = await axios.get<any>("/api/my-proxy/api/v1/postings");

      let postingsData: Posting[] = [];
      if (data?.postings && Array.isArray(data.postings)) {
        postingsData = data.postings;
      } else if (Array.isArray(data)) {
        postingsData = data;
      }

      return postingsData;
    },
    staleTime: 5 * 60 * 1000,
  });
}
