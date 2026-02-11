"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Posting } from "@/lib/types";
import {
  Building,
  IndianRupee,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Percent,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { toast } from "sonner";

interface PostingDetailsDialogProps {
  posting: Posting | null;
  isOpen: boolean;
  onClose: () => void;
}

interface EligibilityCriteria {
  id: string;
  allowedBranches: string[];
  minTenth: number;
  minTwelfth: number;
  minCGPA: number;
  maxBacklogs: number;
  jobPostId: string;
  passingYear: number;
  minDiploma: number;
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
  const [eligibility, setEligibility] = useState<EligibilityCriteria | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const { data, isLoading, error } = useStudentProfile();

  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (isOpen && posting) {
      fetchEligibility(posting.id);
      checkApplicationStatus(posting.id);
    } else {
      setEligibility(null);
      setHasApplied(false);
    }
  }, [isOpen, posting]);

  const studentEducation = data?.profile?.education ?? null;

  const fetchEligibility = async (jobId: string) => {
    try {
      setLoading(true);
      const response = await axios.get<EligibilityCriteria>(
        `/api/my-proxy/api/v1/student/getEligibilityCriteria/${jobId}`,
      );
      if (response.data) {
        setEligibility(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch eligibility criteria:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async (jobId: string) => {
    try {
      const response = await axios.get(
        `/api/my-proxy/api/v1/student/applications`,
      );
      const applications = response.data;
      console.log(applications);
      const application = applications.find(
        (app: any) => app.jobPostId === posting?.id,
      );
      if (application) {
        setHasApplied(true);
      }
    } catch (error) {
      console.log("Could not verify application status", error);
    }
  };

  const eligibilityResult = useMemo(() => {
    if (!eligibility || !studentEducation) {
      return { isEligible: false, reasons: [] as string[] };
    }

    const reasons: string[] = [];

    if (studentEducation.cgpa < eligibility.minCGPA) {
      reasons.push(`Minimum CGPA required is ${eligibility.minCGPA}`);
    }

    if (studentEducation.tenthPercent < eligibility.minTenth) {
      reasons.push(`Minimum 10th % required is ${eligibility.minTenth}`);
    }

    if (
      studentEducation.twelfthPercent
        ? studentEducation.twelfthPercent < eligibility.minTwelfth
        : studentEducation.diplomaPercent < eligibility.minDiploma
    ) {
      reasons.push(
        studentEducation.twelfthPercent
          ? `Minimum 12th % required is ${eligibility.minTwelfth}`
          : `Minimum Diploma % required is ${eligibility.minDiploma}`,
      );
    }
    if (
      eligibility.passingYear &&
      studentEducation.passingYear !== eligibility.passingYear
    ) {
      reasons.push(
        `Only ${eligibility.passingYear} batch students are eligible`,
      );
    }
    if (studentEducation.backlogs > eligibility.maxBacklogs) {
      reasons.push(`Max allowed backlogs is ${eligibility.maxBacklogs}`);
    }

    if (
      eligibility.allowedBranches?.length &&
      !eligibility.allowedBranches.some(
        (b) =>
          b === "All" ||
          studentEducation.branch.toLowerCase().includes(b.toLowerCase()),
      )
    ) {
      reasons.push(`Role not open for ${studentEducation.branch} students`);
    }

    return {
      isEligible: reasons.length === 0,
      reasons,
    };
  }, [eligibility, studentEducation]);

  const { isEligible, reasons: ineligibilityReasons } = eligibilityResult;

  const handleApply = async () => {
    if (!posting) return;
    try {
      setIsApplying(true);
      console.log("Posting ID:", posting.id);
      await axios.post("/api/my-proxy/api/v1/student/applyforJob", {
        postingId: posting.id,
      });
      toast.success("Applied successfully");
      setHasApplied(true);
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  const deadlineDate = posting
    ? new Date(posting.deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  if (!posting) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 [&>button]:hidden">
        {/* Header Section */}
        <DialogHeader className="p-0 border-b bg-muted/20 text-left">
          <div className="flex flex-col gap-4 p-6 pb-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5 flex-1">
                <DialogTitle className="text-2xl font-bold text-primary leading-tight">
                  {posting.role}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-4 h-4" />
                    {posting.company}
                  </span>
                  <span className="hidden sm:inline text-muted-foreground/40 text-xs">
                    •
                  </span>
                  <span className="text-sm font-normal flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {posting.companyInfo}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-black/10 -mr-2 -mt-2 shrink-0"
                onClick={onClose}
              >
                <XCircle className="w-6 h-6 text-muted-foreground/70 hover:text-foreground transition-colors" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="px-2.5 py-1 text-sm font-semibold flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
              >
                <IndianRupee className="w-3.5 h-3.5" />
                {posting.ctc} LPA
              </Badge>
              <Badge
                variant="outline"
                className="px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 bg-background shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Deadline:{" "}
                <span className="text-foreground font-semibold">
                  {deadlineDate}
                </span>
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* Job Description */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Job Description
            </h3>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg border border-border/50">
              {posting.description}
            </div>
          </div>

          {/* Eligibility Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              Eligibility Criteria
            </h3>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : eligibility ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EligibilityCard
                  label="Minimum CGPA"
                  value={eligibility.minCGPA}
                  icon={<GraduationCap className="w-4 h-4" />}
                  status={
                    studentEducation
                      ? studentEducation.cgpa >= eligibility.minCGPA
                        ? "pass"
                        : "fail"
                      : "neutral"
                  }
                  studentValue={studentEducation?.cgpa.toString()}
                />
                <EligibilityCard
                  label="10th Percentage"
                  value={`${eligibility.minTenth}%`}
                  icon={<Percent className="w-4 h-4" />}
                  status={
                    studentEducation
                      ? studentEducation.tenthPercent >= eligibility.minTenth
                        ? "pass"
                        : "fail"
                      : "neutral"
                  }
                  studentValue={
                    studentEducation
                      ? `${studentEducation.tenthPercent}%`
                      : undefined
                  }
                />
                <EligibilityCard
                  label="12th Percentage"
                  value={`${eligibility.minTwelfth}%`}
                  icon={<Percent className="w-4 h-4" />}
                  status={
                    studentEducation
                      ? studentEducation.twelfthPercent >=
                        eligibility.minTwelfth
                        ? "pass"
                        : "fail"
                      : "neutral"
                  }
                  studentValue={
                    studentEducation
                      ? `${studentEducation.twelfthPercent}%`
                      : undefined
                  }
                />
                <EligibilityCard
                  label="Diploma Percentage"
                  value={
                    eligibility.minDiploma != null
                      ? `${eligibility.minDiploma}%`
                      : "N/A"
                  }
                  icon={<Percent className="w-4 h-4" />}
                  status={
                    studentEducation
                      ? studentEducation.diplomaPercent >=
                        eligibility.minDiploma
                        ? "pass"
                        : "fail"
                      : "neutral"
                  }
                  studentValue={
                    studentEducation?.diplomaPercent != null
                      ? `${studentEducation.diplomaPercent}%`
                      : "N/A"
                  }
                />
                <EligibilityCard
                  label="Max Backlogs"
                  value={eligibility.maxBacklogs}
                  icon={<AlertCircle className="w-4 h-4" />}
                  status={
                    studentEducation
                      ? studentEducation.backlogs <= eligibility.maxBacklogs
                        ? "pass"
                        : "fail"
                      : "neutral"
                  }
                  studentValue={studentEducation?.backlogs.toString()}
                />
              </div>
            ) : (
              <div className="bg-muted p-4 rounded-lg text-sm text-center italic text-muted-foreground">
                {posting.eligibility ||
                  "No specific automated criteria provided."}
              </div>
            )}

            {/* Overall Eligibility Status Message */}
            {studentEducation && eligibility && (
              <div
                className={`mt-4 p-4 rounded-lg border flex items-start gap-3 transition-colors ${
                  isEligible
                    ? "bg-green-50/50 border-green-200 text-green-800"
                    : "bg-destructive/5 border-destructive/20 text-destructive"
                }`}
              >
                {isEligible ? (
                  <>
                    <div className="p-1 bg-green-100 rounded-full shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">You are eligible!</h4>
                      <p className="text-sm opacity-90">
                        Your profile meets all the requirements for this role.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-1 bg-red-100 rounded-full shrink-0">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Not Eligible</h4>
                      <ul className="list-disc list-inside text-sm mt-1 opacity-90 space-y-0.5">
                        {ineligibilityReasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-6 pt-2 border-t bg-muted/20 sm:justify-between items-center">
          <div className="text-xs text-muted-foreground hidden sm:block">
            {isLoading && "Checking eligibility..."}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Close
            </Button>
            <Button
              onClick={handleApply}
              disabled={
                loading ||
                isLoading ||
                isApplying ||
                hasApplied ||
                (!!eligibility && !!studentEducation && !isEligible)
              }
              variant={hasApplied ? "secondary" : "default"}
              className={`flex-1 sm:flex-none font-semibold ${
                isEligible || hasApplied ? "bg-primary hover:bg-primary/90" : ""
              }`}
            >
              {isApplying
                ? "Applying..."
                : hasApplied
                  ? "Applied"
                  : isEligible
                    ? "Apply Now"
                    : "Not Eligible"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EligibilityCard({
  label,
  value,
  icon,
  status,
  studentValue,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  status: "pass" | "fail" | "neutral";
  studentValue?: string;
}) {
  const statusColors = {
    pass: "bg-green-50 border-green-100 text-green-700",
    fail: "bg-red-50 border-red-100 text-red-700",
    neutral: "bg-card border-border text-foreground",
  };

  const iconColors = {
    pass: "text-green-600",
    fail: "text-red-500",
    neutral: "text-muted-foreground",
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all ${statusColors[status]} flex items-center justify-between`}
    >
      <div className="space-y-1">
        <span className="text-xs font-medium opacity-70 uppercase tracking-wider">
          {label}
        </span>
        <div className="text-xl font-bold flex items-baseline gap-1">
          {value}
        </div>
        {studentValue && status !== "neutral" && (
          <div className="text-xs opacity-80 flex items-center gap-1">
            Your score: <span className="font-semibold">{studentValue}</span>
          </div>
        )}
      </div>
      <div
        className={`p-2 rounded-full bg-white/50 backdrop-blur-sm ${iconColors[status]}`}
      >
        {status === "pass" ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : status === "fail" ? (
          <XCircle className="w-5 h-5" />
        ) : (
          icon
        )}
      </div>
    </div>
  );
}
