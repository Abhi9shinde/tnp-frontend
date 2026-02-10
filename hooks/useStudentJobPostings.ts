// This hook fetches job postings for students from the API and returns the data along with loading and error states.
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Posting } from "@/lib/types";

export function useStudentJobPostings() {
  return useQuery({
    queryKey: ["student-job-postings"],
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
