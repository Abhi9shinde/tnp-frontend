"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import Container from "@/components/Container";

export default function OverviewPage() {
  const { data, isLoading, error } = useStudentProfile();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load profile</p>;

  const profile = data.profile;

  return (
    <div className="space-y-6">
      {/* Section title */}
      <h1 className="text-2xl font-bold">What recruiters will see</h1>

      {/* Profile Card */}
      <Container className="rounded-xl border !border-gray-300 py-6 px-8 max-w-4xl ">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            {/* Avatar */}
            <Image
              src={"/avatar-placeholder.png"}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full border"
            />

            {/* Name + meta */}
            <div>
              <h2 className="text-xl font-semibold">
                {profile.firstName} {profile.middleName} {profile.lastName}
              </h2>
              <h3 className="text-sm font-normal text-neutral-500">
                {profile.personalEmail} &nbsp; +91 {profile.phoneNo}
              </h3>

              <p className="text-sm text-neutral-600">
                Pune, India · Open to remote
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-neutral-500"
            >
              <IconBrandGithub className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-neutral-500"
            >
              <IconBrandLinkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-10">
          {/* Experience */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-neutral-500">
              Experience
            </p>

            {profile.internships?.length > 0 ? (
              <div className="space-y-4">
                {profile.internships.map((internship: any) => (
                  <div
                    key={internship.id}
                    className="flex items-start justify-between gap-6"
                  >
                    {/* Left */}
                    <div className="text-sm">
                      <p className="font-semibold">{internship.role}</p>
                      <p className="text-neutral-500 font-medium pl-3 pt-0.5">
                        {internship.company}
                      </p>
                      {internship.description && (
                        <p className="max-w-md text-sm font-light text-neutral-400 pl-3">
                          {internship.description}
                        </p>
                      )}
                    </div>

                    {/* Right */}
                    {internship.duration && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {internship.duration}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No experience added yet
              </p>
            )}
          </div>

          {/* Achievements */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-neutral-500">
              Achievements
            </p>

            {profile.achievements?.length > 0 ? (
              <div className="space-y-4">
                {profile.achievements.map((achievement: any) => (
                  <div
                    key={achievement.id}
                    className="flex items-start justify-between gap-6"
                  >
                    {/* Left */}
                    <div className="text-sm">
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-neutral-500 font-medium pl-3 pt-0.5">
                        {achievement.type}
                      </p>
                      {achievement.description && (
                        <p className="max-w-md text-sm font-light text-neutral-400 pl-5">
                          {achievement.description}
                        </p>
                      )}
                    </div>

                    {/* Right */}
                    {achievement.date && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No Achievement added yet
              </p>
            )}
          </div>

          {/* Education*/}
          <div className="mt-6">
            <p className="text-sm font-semibold text-neutral-500 mb-2">
              Education
            </p>
            <div className="flex flex-row justify-between">
              <div className="text-sm">
                <p className="font-semibold">
                  B.E in {profile.education.branch}
                </p>
                <p className="font-normal text-neutral-700 pl-3">
                  P.E.S Modern College of Engineering, Pune •{" "}
                  {profile.education.enrollmentYear} -{" "}
                  {profile.education.passingYear}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">
                  CGPA - {profile.education.cgpa}
                </p>
              </div>
            </div>
          </div>

          {/* Certificates */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-neutral-500">
              Certificates
            </p>

            {profile.achievements?.length > 0 ? (
              <div className="space-y-4">
                {profile.achievements.map((achievement: any) => (
                  <div
                    key={achievement.id}
                    className="flex items-start justify-between gap-6"
                  >
                    {/* Left */}
                    <div className="text-sm">
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-neutral-500 font-medium pl-3 pt-0.5">
                        {achievement.type}
                      </p>
                      {achievement.description && (
                        <p className="max-w-md text-sm font-light text-neutral-400 pl-5">
                          {achievement.description}
                        </p>
                      )}
                    </div>

                    {/* Right */}
                    {achievement.date && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No Achievement added yet
              </p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
