"use client";

import { useStudentProfile } from "@/hooks/useStudentProfile";

export default function EditPage() {
  const { data, isLoading, error } = useStudentProfile();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Failed to load profile</p>;
  }

  const profile = data.profile;

  return (
    <div>
      <h1>Edit Profile</h1>
      <p>
        Name: {profile.firstName} {profile.middleName} {profile.lastName}
      </p>
      <p>Email: {profile.personalEmail}</p>
      <p>Phone: {profile.phoneNo}</p>
      <p>CGPA: {profile.education?.cgpa ?? "Not added"}</p>
      <p>
        Skills:{" "}
        {profile.skills.length > 0
          ? profile.skills.join(", ")
          : "No skills added"}
      </p>
    </div>
  );
}
