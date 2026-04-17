import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface DetailedStatistics {
  generatedAt: string;
  overview: {
    totalStudents: number;
    placedStudents: number;
    unplacedStudents: number;
    placementRate: number;
    totalApplications: number;
    selectedOffers: number;
    selectionRate: number;
  };
  departmentWise: {
    department: string;
    totalStudents: number;
    placedStudents: number;
    unplacedStudents: number;
    selectedOffers: number;
    placementRate: number;
    averageCtcLpa: number | null;
    highestCtcLpa: number | null;
  }[];
  monthlyPlacementTrend: {
    month: string;
    selectedOffers: number;
    uniquePlacedStudents: number;
    cumulativePlacedStudents: number;
  }[];
  companyWiseSelections: {
    company: string;
    selectedOffers: number;
    uniquePlacedStudents: number;
    averageCtcLpa: number | null;
  }[];
  applicationStatusBreakdown: {
    PENDING: number;
    SHORTLISTED: number;
    SELECTED: number;
    REJECTED: number;
  };
  postingInsights: {
    totalPostings: number;
    postingStatusBreakdown: {
      DRAFT: number;
      OPEN: number;
      CLOSED: number;
      ARCHIVED: number;
    };
    monthlyJobPostingTrend: {
      month: string;
      postings: number;
    }[];
  };
  cgpaPlacementInsights: {
    bucket: string;
    totalStudents: number;
    placedStudents: number;
    placementRate: number;
  }[];
  // Note: packageDistribution is not in the detailed API but we might keep it as optional 
  // or handle it with departmentWise ctc data.
  packageDistribution?: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

export function useDetailedStatistics() {
  return useQuery<DetailedStatistics>({
    queryKey: ["detailed-statistics"],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/my-proxy/api/v1/placements/statistics/detailed`
      );
      return data;
    },
  });
}
