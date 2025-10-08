"use client";
import SignupFormDemo from "@/components/signup-form-demo";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { auth0 } from "@/lib/auth0";
import { BACKEND_URL } from "@/lib/config";
import axios from "axios";
import React from "react";

type Props = {};

const Profile = async (props: Props) => {
  const fields = [
    {
      name: "firstname",
      label: "First name",
      placeholder: "Pranav",
      group: "name",
    },
    {
      name: "middlename",
      label: "Middle name",
      placeholder: "Prakash",
      group: "name",
    },
    {
      name: "lastname",
      label: "Last name",
      placeholder: "Turkar",
      group: "name",
    },
    {
      name: "personalEmail",
      label: "Email Address",
      type: "email",
      placeholder: "pranav@onlyfans.com",
    },
    {
      name: "phoneNo",
      label: "Phone Number",
      type: "tel",
      placeholder: "9876543210",
    },
    { name: "dob", label: "Date of Birth", type: "date" },
  ];
  const accessToken = await auth0.getAccessToken();

  const onSubmitHandler = async (formsData: any) => {
    console.log("Submitting formsData:", formsData);
    console.log("BACKEND_URL:", BACKEND_URL);
    try {
      const res = await axios.post(
        "/api/my-proxy/api/v1/student/registerStudent",
        formsData
      );
      console.log(res.data);
      alert("Registered successfully!");
    } catch (err: any) {
      console.error("Error:", err);

      // Check if user needs to login
      if (err.response?.data?.needsAuth) {
        alert("Please login first to complete your profile");
        window.location.href = err.response.data.loginUrl;
        return;
      }

      alert(err.response?.data?.error || "Profile completion failed");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-white dark:bg-black"
      style={{
        backgroundImage: `radial-gradient(circle at 0.5px 0.5px, rgba(6,182,212,0.2) 1px,transparent 0)`,
        backgroundSize: "10px 10px",
        backgroundRepeat: "repeat",
      }}
    >
      {/* <BackgroundRippleEffect /> */}
      <div className="relative z-10">
        <SignupFormDemo fields={fields} onSubmit={onSubmitHandler} />
      </div>
    </div>
  );
};

export default Profile;
