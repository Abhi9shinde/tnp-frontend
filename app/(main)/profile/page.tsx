"use client";

import SignupFormDemo from "@/components/signup-form-demo";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const fields = [
    {
      name: "firstName",
      label: "First name",
      placeholder: "Pranav",
      group: "name",
    },
    {
      name: "middleName",
      label: "Middle name",
      placeholder: "Prakash",
      group: "name",
    },
    {
      name: "lastName",
      label: "Last name",
      placeholder: "Turkar",
      group: "name",
    },
    {
      name: "personalEmail",
      label: "Email Address",
      type: "email",
      placeholder: "pranav@gmail.com",
    },
    {
      name: "phoneNo",
      label: "Phone Number",
      type: "tel",
      placeholder: "9876543210",
    },
    { name: "dob", label: "Date of Birth", type: "date" },
  ];

  const onSubmitHandler = async (formsData: any) => {
    try {
      const res = await axios.post(
        "/api/my-proxy/api/v1/student/registerStudent",
        formsData
      );
      if (res.status == 200) {
        alert("registered");
        router.push("/education");
      }
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
