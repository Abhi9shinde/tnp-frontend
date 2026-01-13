import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Application {
    id: string;
    jobPostId: string;
    studentId: string;
    status: string;
    appliedAt: string;
}

export function useStudentApplications() {
    return useQuery({
        queryKey: ["student-applications"],
        queryFn: async () => {
            const { data } = await axios.get<Application[]>(
                "/api/my-proxy/api/v1/student/applications"
            );
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
