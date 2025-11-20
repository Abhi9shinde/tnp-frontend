"use client";

import SignupFormDemo from "@/components/signup-form-demo";
// import { BACKEND_URL } from "@/lib/config";
import axios from "axios";

export default function ProfileClient({
  accessToken,
}: {
  accessToken: string;
}) {
  const fields = [
    {
      name: "firstName",
      label: "First name",
      placeholder: "Name",
      group: "name",
    },
    {
      name: "middleName",
      label: "Middle name",
      placeholder: "Middle Name",
      group: "name",
    },
    {
      name: "lastName",
      label: "Last name",
      placeholder: "Last Name",
      group: "name",
    },
    {
      name: "personalEmail",
      label: "Email Address",
      type: "email",
      placeholder: "Personal Email",
    },
    {
      name: "phoneNo",
      label: "Phone Number",
      type: "tel",
      placeholder: "Phone Number",
    },
    { name: "dob", label: "Date of Birth", type: "date" },
  ];

  const onSubmitHandler = async (formsData: any) => {
    try {
      const res = await axios.post(
        "/api/my-proxy/api/v1/student/registerStudent",
        formsData
      );
      alert("Registered successfully!");
    } catch (err: any) {
      if (err.response?.data?.needsAuth) {
        alert("Please login first to complete your profile");
        window.location.href = err.response.data.loginUrl;
        return;
      }
      alert(err.response?.data?.error || "Profile completion failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-black">
      <SignupFormDemo fields={fields} onSubmit={onSubmitHandler} />
    </div>
  );
}
