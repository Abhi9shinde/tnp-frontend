import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function usePlacementOverview() {
  return useQuery({
    queryKey: ["placement-overview"],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/my-proxy/api/v1/placements/statistics`,
      );
      return data;
    },
  });
}
