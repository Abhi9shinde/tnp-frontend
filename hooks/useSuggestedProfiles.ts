import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface SuggestedProfile {
    id: string;
    name: string;
    branch: string;
    userId: string;
    avatar?: string;
    mutualFriends?: number;
}

export function useSuggestedProfiles() {
    return useQuery({
        queryKey: ["suggested-profiles"],
        queryFn: async () => {
            const { data } = await axios.get<{ students: SuggestedProfile[] }>("/api/my-proxy/api/v1/student/suggested-profiles");
            return data.students || [];
        },
        staleTime: 0, // Keep it fresh to get random profiles on refresh
    });
}
