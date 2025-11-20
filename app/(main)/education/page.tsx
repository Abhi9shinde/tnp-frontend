"use client";

import React from "react";
import { DynamicForm, type DynamicFormValues } from "@/components/dynamic-form";
import { educationFields } from "@/lib/formContents";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

export default function Education(props: Props) {
  const router = useRouter();

  const handleSubmit = async (values: DynamicFormValues) => {
    try {
      // Convert number fields to actual numbers
      const payload = {
        ...values,
        enrollmentYear: values.enrollmentYear ? Number(values.enrollmentYear) : undefined,
        cgpa: values.cgpa ? Number(values.cgpa) : undefined,
        tenthPercent: values.tenthPercent ? Number(values.tenthPercent) : undefined,
        tenthYear: values.tenthYear ? Number(values.tenthYear) : undefined,
        twelfthPercent: values.twelfthPercent ? Number(values.twelfthPercent) : undefined,
        twelfthYear: values.twelfthYear ? Number(values.twelfthYear) : undefined,
        diplomaPercent: values.diplomaPercent ? Number(values.diplomaPercent) : undefined,
        diplomaYear: values.diplomaYear ? Number(values.diplomaYear) : undefined,
        backlogs: values.backlogs ? Number(values.backlogs) : undefined,
      };

      // Remove empty optional fields
      if (!payload.diplomaPercent) delete payload.diplomaPercent;
      if (!payload.diplomaYear) delete payload.diplomaYear;

      console.log("Sending payload:", payload);

      const res = await axios.post(
        "/api/my-proxy/api/v1/student/addEducation",
        payload
      );
      if (res.status === 200) {
        router.push("/home");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      console.error("Error response:", err.response?.data);
      
      if (err.response?.data?.needsAuth) {
        alert("Please login first to complete your profile");
        window.location.href = err.response.data.loginUrl;
        return;
      }
      alert(
        err.response?.data?.error ||
        err.response?.data?.message ||
        `Education details submission failed: ${err.message}`
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-6 md:p-10">
        <DynamicForm
          fields={educationFields}
          legend="Education Details"
          description="Provide your latest academic information so recruiters can understand your background."
          submitLabel="Save & Continue"
          maxWidth="full"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
