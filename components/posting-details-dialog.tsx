"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Posting } from "@/lib/types";
import { Building, IndianRupee, Briefcase, Calendar, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface PostingDetailsDialogProps {
  posting: Posting | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EligibilityCriteria {
  id: string;
  course: string;
  tenthPercentage: number;
  twelfthPercentage: number;
  cgpa: number;
  backlogsAllowed: number;
  jobId: string;
}

interface StudentEducation {
  branch: string;
  enrollmentYear: number;
  passingYear: number;
  cgpa: number;
  tenthPercent: number;
  tenthYear: number;
  twelfthPercent: number;
  twelfthYear: number;
  diplomaPercent: number;
  diplomaYear: number;
  backlogs: number;
}

export function PostingDetailsDialog({
  posting,
  isOpen,
  onClose,
}: PostingDetailsDialogProps) {
  const [eligibility, setEligibility] = useState<EligibilityCriteria | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Student data for comparison (ideally fetched from API)
  const [studentEducation, setStudentEducation] = useState<StudentEducation | null>(null);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [ineligibilityReasons, setIneligibilityReasons] = useState<string[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);

  useEffect(() => {
    if (isOpen && posting) {
      fetchEligibility(posting.id);
      fetchStudentData(); // We need to implement this
    } else {
        // Reset state when closed
        setEligibility(null);
        setError(null);
        setIneligibilityReasons([]);
        setIsEligible(false);
    }
  }, [isOpen, posting]);

  useEffect(() => {
    if (eligibility && studentEducation) {
        checkEligibility(eligibility, studentEducation);
    }
  }, [eligibility, studentEducation]);

  const fetchEligibility = async (jobId: string) => {
    console.log("Fetching eligibility for job ID:", jobId);
    try {
      setLoading(true);
      const response = await axios.get<EligibilityCriteria>(`/api/my-proxy/api/v1/admin/getEligibilityCriteria/${jobId}`);
      console.log("Eligibility Response:", response.data);
      if (response.data) {
          setEligibility(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch eligibility criteria:", err);
      // Don't show error to user immediately, just log it. Data might be missing.
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async () => {
       try {
           setStudentLoading(true);
           // Try to find an endpoint. If not, maybe use a mock or try to deduce from profile/education pages?
           // Based on `education/page.tsx`, we know the structure of education data.
           // Assuming a GET endpoint exists or we need to rely on what we can find.
           // Let's try /api/my-proxy/api/v1/student/getEducation first (common pattern)
           const response = await axios.get<StudentEducation>('/api/my-proxy/api/v1/student/education'); 
           setStudentEducation(response.data);
       } catch (err) {
           console.error("Failed to fetch student education:", err);
           // If 404, maybe student hasn't filled education?
       } finally {
           setStudentLoading(false);
       }
  };

  const checkEligibility = (criteria: EligibilityCriteria, student: StudentEducation) => {
      const reasons: string[] = [];
      
      if (student.cgpa < criteria.cgpa) {
          reasons.push(`CGPA is ${student.cgpa}, required ${criteria.cgpa}`);
      }
      
      if (student.tenthPercent < criteria.tenthPercentage) {
          reasons.push(`10th % is ${student.tenthPercent}, required ${criteria.tenthPercentage}`);
      }
      
      if (student.twelfthPercent < criteria.twelfthPercentage) {
          reasons.push(`12th % is ${student.twelfthPercent}, required ${criteria.twelfthPercentage}`);
      }
      
      if (student.backlogs > criteria.backlogsAllowed) {
           reasons.push(`Backlogs: ${student.backlogs}, max allowed ${criteria.backlogsAllowed}`);
      }
      
      // Course/Branch check could be complex due to string matching, skipping for now or doing simple check
      if (criteria.course && !student.branch.toLowerCase().includes(criteria.course.toLowerCase()) && criteria.course !== "All") {
          // Very basic check. 'course' in criteria might be comma separated or single string.
          // reasons.push(`Branch mismatch (Required: ${criteria.course})`); 
          // Keeping it lenient for now unless we know exact format
      }

      setIneligibilityReasons(reasons);
      setIsEligible(reasons.length === 0);
  };

  const deadlineDate = posting ? new Date(posting.deadline).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "";

  if (!posting) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{posting.role}</DialogTitle>
          <DialogDescription className="text-base flex items-center gap-2 mt-2">
            <Building className="w-4 h-4" />
            <span className="font-medium text-foreground">{posting.company}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4 text-primary" />
                <span>{posting.companyInfo}</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Deadline: {deadlineDate}</span>
             </div>
             <div className="flex items-center gap-2 font-medium">
                <IndianRupee className="w-4 h-4 text-green-600" />
                <span>{posting.ctc}</span>
             </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Job Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {posting.description}
            </p>
          </div>

          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold text-lg">Eligibility Criteria</h3>
            {loading ? (
                 <div className="space-y-2">
                     <Skeleton className="h-4 w-3/4" />
                     <Skeleton className="h-4 w-1/2" />
                 </div>
            ) : eligibility ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Min CGPA:</span>
                        <span className="font-medium">{eligibility.cgpa}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">10th Percentage:</span>
                        <span className="font-medium">{eligibility.tenthPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">12th Percentage:</span>
                        <span className="font-medium">{eligibility.twelfthPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Backlogs:</span>
                        <span className="font-medium">{eligibility.backlogsAllowed}</span>
                    </div>
                    <div className="flex justify-between md:col-span-2">
                         <span className="text-muted-foreground">Eligible Courses:</span>
                         <span className="font-medium">{eligibility.course}</span>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground italic">
                    {posting.eligibility || "No specific eligibility criteria defined."}
                </p>
            )}
            
            {/* Eligibility Status */}
            {studentEducation && eligibility && (
                <div className={`mt-4 p-3 rounded-md flex items-start gap-2 ${isEligible ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {isEligible ? (
                        <>
                             <Check className="w-5 h-5 shrink-0" />
                             <span className="font-medium">You are eligible for this role!</span>
                        </>
                    ) : (
                        <>
                             <X className="w-5 h-5 shrink-0" />
                             <div className="space-y-1">
                                <span className="font-medium">You are not eligible:</span>
                                <ul className="list-disc pl-4 text-xs space-y-1">
                                    {ineligibilityReasons.map((reason, i) => (
                                        <li key={i}>{reason}</li>
                                    ))}
                                </ul>
                             </div>
                        </>
                    )}
                </div>
            )}
            
            {!studentEducation && !studentLoading && (
                 <p className="text-xs text-amber-600 mt-2">
                    * Could not verify eligibility (Education details missing or API unavailable).
                 </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={() => alert("Application submitted successfully!")} 
            disabled={loading || studentLoading || (!!eligibility && !!studentEducation && !isEligible)}
            className={isEligible ? "bg-primary" : ""}
          >
            {isEligible ? "Apply Now" : "Not Eligible"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
