import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get("/api/my-proxy/api/v1/user/me");
      return res.data.user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: false,
  });
};
