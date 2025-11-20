import { DynamicField } from "@/components/dynamic-form";

export const educationFields: DynamicField[] = [
  {
    name: "branch",
    label: "Branch / Major",
    placeholder: "Computer Engineering",
    required: true,
  },
  {
    name: "enrollmentYear",
    label: "Enrollment Year",
    type: "number",
    placeholder: "2022",
    required: true,
  },
  {
    name: "cgpa",
    label: "Current CGPA",
    type: "number",
    placeholder: "8.5",
    required: true,
    helperText: "Enter your latest cumulative CGPA.",
  },
  {
    name: "tenthPercent",
    label: "10th Percentage",
    type: "number",
    placeholder: "92",
    required: true,
  },
  {
    name: "tenthYear",
    label: "10th Passing Year",
    type: "number",
    placeholder: "2019",
    required: true,
  },
  {
    name: "twelfthPercent",
    label: "12th Percentage",
    type: "number",
    placeholder: "88",
    required: true,
  },
  {
    name: "twelfthYear",
    label: "12th Passing Year",
    type: "number",
    placeholder: "2021",
    required: true,
  },
  {
    name: "diplomaPercent",
    label: "Diploma Percentage",
    type: "number",
    placeholder: "75",
    helperText: "Leave blank if not applicable.",
  },
  {
    name: "diplomaYear",
    label: "Diploma Passing Year",
    type: "number",
    placeholder: "2020",
    helperText: "Leave blank if not applicable.",
  },
  {
    name: "backlogs",
    label: "Backlogs (Current / Total)",
    type: "number",
    placeholder: "0",
    required: true,
  },
];
