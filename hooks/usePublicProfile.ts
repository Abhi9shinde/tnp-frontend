import { useQuery } from "@tanstack/react-query";

export function usePublicProfile(userId: string) {
    return useQuery({
        queryKey: ["public-profile", userId],
        queryFn: async () => {
            const res = await fetch(`/api/my-proxy/api/v1/student/publicProfile/${userId}`);

            if (!res.ok) {
                throw new Error("Failed to fetch public profile");
            }

            return res.json();
        },
        enabled: !!userId,
    });
}
