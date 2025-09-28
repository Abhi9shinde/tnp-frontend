export type FormField = {
  id: string;
  label: string;
  placeholder?: string;
  type: "text" | "email" | "date" | "number";
  required?: boolean;
};
