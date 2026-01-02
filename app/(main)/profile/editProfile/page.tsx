"use client";

import { useSession } from "@/providers/session-provider";
import { useEffect, useState } from "react";

export default function EditPage() {
  const session = useSession();
  const loggedIn = Boolean(session);
  const [loading, setLoading] = useState(true);

  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [studentEducation, setStudentEducation] = useState<any>(null);
  const [studentAchievement, setStudentAchievement] = useState<any>(null);
  const [studentProject, setStudentProject] = useState<any>(null);
  const [studentInternship, setStudentInternship] = useState<any>(null);
  const [studentCertificate, setStudentCertificate] = useState<any>(null);
  const [studentSocial, setStudentSocial] = useState<any>(null);

  useEffect(() => {
    if (!loggedIn) return;
    //LOAD PROFILE DATA
    async function loadProfile() {
      try {
        const res = await fetch("/api/my-proxy/api/v1/student/profile");
        const data = await res.json();
        setStudentProfile(data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    //LOAD EDUCATION DATA
    async function loadEducation() {
      try {
        const res = await fetch("/api/my-proxy/api/v1/student/education");
        const data = await res.json();
        setStudentEducation(data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    //LOAD ACHIEVEMENT DATA
    async function loadAchievement() {
      try {
        const res = await fetch("/api/my-proxy/api/v1/student/achievement");
        const data = await res.json();
        setStudentAchievement(data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    //LOAD PROJECT DATA
    async function loadProject() {
      try {
        const res = await fetch("/api/my-proxy/api/v1/student/project");
        const data = await res.json();
        setStudentProject(data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }
    //LOAD INTERNSHIP DATA
    async function loadInternship() {
      try {
        const res = await fetch("/api/my-proxy/api/v1/student/internship");
        const data = await res.json();
        setStudentInternship(data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    //LOAD CERTIFICATE DATA
    async function loadCertificate() {
      try {
        const res = await fetch("/api/my-proxy/api/v1/student/certificate");
        const data = await res.json();
        setStudentCertificate(data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    //LOAD SOCIAL DATA
    async function loadSocial() {
      try {
        const res = await fetch("/api/my-proxy/api/v1/student/social");
        const data = await res.json();
        setStudentSocial(data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    loadProfile();
    loadEducation();
    loadAchievement();
    loadProject();
    loadInternship();
    loadCertificate();
    loadSocial();
    setLoading(false);
  }, [loggedIn]);

  return (
    <>
      {loading ? <p>Loading...</p> : null}
      {studentProfile && (
        <div>
          <h1>Edit Profile</h1>
          <p>Name: {studentProfile?.firstName}</p>
          <p>Email: {studentProfile.email}</p>
        </div>
      )}
    </>
  );
}
