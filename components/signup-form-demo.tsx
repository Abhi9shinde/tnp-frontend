"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  ref?: React.Ref<HTMLInputElement>;
  group?: string; // optional, for grouping fields (like first/middle/last name row)
};

interface SignupFormDemoProps {
  fields: Field[];
  onSubmit: (data: Record<string, string>) => void;
}

export default function SignupFormDemo({ fields, onSubmit }: SignupFormDemoProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // group fields by their "group" value (so you can have rows like First/Middle/Last name)
  const groupedFields = fields.reduce<Record<string, Field[]>>((acc, field) => {
    const key = field.group || field.name; 
    if (!acc[key]) acc[key] = [];
    acc[key].push(field);
    return acc;
  }, {});

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to P.E.S's MCOE TNP Portal
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Fill in your basic information to get registered
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {Object.values(groupedFields).map((row, idx) => (
          <div
            key={idx}
            className={cn(
              "mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2"
            )}
          >
            {row.map((field) => (
              <LabelInputContainer key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder || ""}
                  ref={field.ref}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                />
              </LabelInputContainer>
            ))}
          </div>
        ))}

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);
