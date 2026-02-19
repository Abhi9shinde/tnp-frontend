"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandLeetcode,
  IconBrandMedium,
  IconLink,
  IconArrowNarrowRight,
  IconExternalLink,
  IconSchool,
  IconBriefcase,
  IconFileCode,
  IconCpu,
  IconCertificate,
  IconTrophy,
} from "@tabler/icons-react";
import Container from "@/components/Container";
import { useSession } from "@/providers/session-provider";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function OverviewPage() {
  const { data, isLoading, error } = useStudentProfile();
  const session = useSession(); //For profile pic

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
              src={session?.user?.picture || "/default-user.jpg"}
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
          {profile.socials.length > 0 && (
            <div className="flex gap-2">
              {profile.socials.map((social: any, index: any) => (
                <Link href={social.url} key={index} target="_blank">
                  <Button
                    size="icon"
                    variant="ghost"
                    key={social.id}
                    className="capitalize"
                  >
                    {social.platform == "github" ? (
                      <IconBrandGithub className="h-4 w-4" />
                    ) : social.platform == "linkedin" ? (
                      <IconBrandLinkedin className="h-4 w-4" />
                    ) : social.platform == "leetcode" ? (
                      <IconBrandLeetcode className="h-4 w-4" />
                    ) : social.platform == "medium" ? (
                      <IconBrandMedium className="h-4 w-4" />
                    ) : (
                      <IconLink className="h-4 w-4" />
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-10 mt-12">
          {/* Experience */}
          <div className="mt-6">
            <span className="flex flex-row gap-2">
              <IconBriefcase className="h-5 w-5 text-primary" />
              <p className="mb-2 text-sm font-semibold text-neutral-500">
                Experience
              </p>
            </span>
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
            <span className="flex flex-row gap-2">
              <IconTrophy className="h-4 w-4" />
              <p className="mb-2 text-sm font-semibold text-neutral-500">
                Achievements
              </p>
            </span>
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

          {/* Projects */}
          <div className="mt-6">
            <span className="flex flex-row gap-2">
              <IconFileCode className="h-5 w-5 text-primary" />
              <p className="mb-2 text-sm font-semibold text-neutral-500">
                Projects
              </p>
            </span>

            {profile.projects?.length > 0 ? (
              <div className="space-y-4">
                {profile.projects.map((project: any) => (
                  <div
                    key={project.id}
                    className="flex items-start justify-between gap-6"
                  >
                    {/* Left */}
                    <div className="text-sm">
                      <p className="font-semibold">
                        {project.title}{" "}
                        {project.link && (
                          <span>
                            <Link href={project.link}>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                className="capitalize"
                              >
                                <IconExternalLink className="" />
                              </Button>
                            </Link>
                          </span>
                        )}
                      </p>
                      <p className="text-neutral-500 font-medium pl-3 pt-0.5"></p>
                      {project.description && (
                        <p className="max-w-md text-sm font-normal text-neutral-500 pl-5">
                          {project.description}
                        </p>
                      )}
                      <div className="pl-3">
                        {project.techStack &&
                          project.techStack.map((tech: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="default"
                              className="mt-2 mx-0.5"
                            >
                              {tech}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    {/* Right */}
                    {project.date && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(project.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No Projects added yet
              </p>
            )}
          </div>
          {/* Education*/}
          <div className="mt-6">
            <span className="flex flex-row gap-2">
              <IconSchool className="h-4 w-4" />
              <p className="text-sm font-semibold text-neutral-500 mb-2">
                Education
              </p>
            </span>
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

          {/* Skills */}
          <div className="mt-6">
            <span className="flex flex-row gap-2">
              <IconCpu className="h-4 w-4" />
              <p className="mb-2 text-sm font-semibold text-neutral-500">
                Skills
              </p>
            </span>

            {profile.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="default" className="capitalize">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No skills added yet
              </p>
            )}
          </div>

          {/* Certificates */}
          <div className="mt-6">
            <span className="flex flex-row gap-2">
              <IconCertificate className="h-4 w-4" />
              <p className="mb-2 text-sm font-semibold text-neutral-500">
                Certificates
              </p>
            </span>

            {profile.certifications?.length > 0 ? (
              <div className="space-y-4">
                {profile.certifications.map((certification: any) => (
                  <div
                    key={certification.id}
                    className="flex items-start justify-between gap-6"
                  >
                    {/* Left */}
                    <div className="text-sm">
                      <p className="font-semibold">{certification.title}</p>
                      <p className="text-neutral-500 font-medium pl-3 pt-0.5">
                        Platform : {certification.organization}
                      </p>
                      {certification.issueDate && (
                        <p className="max-w-md text-sm font-light text-neutral-400 pl-5 mt-1">
                          {new Date(
                            certification.issueDate,
                          ).toLocaleDateString()}{" "}
                          - Issued Date
                        </p>
                      )}
                    </div>

                    {/* Right */}
                    {certification.credentialUrl && (
                      <Link href={certification.credentialUrl}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-xs text-neutral-500 mt-1 group"
                        >
                          <IconArrowNarrowRight className="h-4 w-4 group-hover:-rotate-45 transition-transform duration-200" />
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No Certificates added yet
              </p>
            )}
          </div>
        </div>
        <Button
          className="mt-6"
          onClick={() => {
            window.location.href =
              "/api/my-proxy/api/v1/student/download-resume";
          }}
        >
          Download Resume (Word)
        </Button>
      </Container>
    </div>
  );
}
