export type FormField = {
  id: string;
  label: string;
  placeholder?: string;
  type: "text" | "email" | "date" | "number";
  required?: boolean;
};

export interface Posting {
  id: string;
  postedById: string;
  role: string;
  company: string;
  companyInfo: string;
  description: string;
  ctc: string;
  deadline: string;
  eligibility?: string;
}
