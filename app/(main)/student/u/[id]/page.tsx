"use client";

import React, { use } from "react";
import Image from "next/image";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandLeetcode,
  IconBrandMedium,
  IconLink,
  IconArrowNarrowRight,
  IconExternalLink,
  IconUser,
  IconBriefcase,
  IconTrophy,
  IconFileCode,
  IconCertificate,
  IconSchool,
  IconCpu
} from "@tabler/icons-react";
import Container from "@/components/Container";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = usePublicProfile(id);

  if (isLoading) {
    return (
      <Container className="py-10 space-y-8 max-w-4xl">
        <div className="flex gap-6 items-center">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </Container>
    );
  }

  if (error || !data?.profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold text-muted-foreground">Profile not found</h2>
        <Button asChild variant="outline">
          <Link href="/student/search">Back to Search</Link>
        </Button>
      </div>
    );
  }

  const profile = data.profile;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <Container className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden max-w-4xl mx-auto">
        {/* Header/Banner Area */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        
        <div className="px-8 pb-10">
            {/* Top Section with Avatar */}
            <div className="relative flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-12 mb-10">
                <div className="relative h-24 w-24 rounded-2xl bg-background border-4 border-card shadow-lg flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
                    <IconUser className="h-12 w-12 opacity-20" />
                    {/* Placeholder for actual image if added to public profile later */}
                </div>
                <div className="space-y-1 pb-1">
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        {profile.firstName} {profile.middleName} {profile.lastName}
                    </h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <IconSchool className="h-4 w-4" />
                        {profile.education?.branch || "Student"} • Batch of {profile.education?.passingYear || "N/A"}
                    </p>
                </div>
                
                {/* Social Links */}
                {profile.socials?.length > 0 && (
                    <div className="sm:ml-auto flex gap-2">
                        {profile.socials.map((social: any, index: any) => (
                            <Link href={social.url} key={index} target="_blank">
                                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-primary/5">
                                    {social.platform === "github" ? (
                                        <IconBrandGithub className="h-5 w-5" />
                                    ) : social.platform === "linkedin" ? (
                                        <IconBrandLinkedin className="h-5 w-5" />
                                    ) : social.platform === "leetcode" ? (
                                        <IconBrandLeetcode className="h-5 w-5" />
                                    ) : (
                                        <IconLink className="h-5 w-5" />
                                    )}
                                </Button>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left Column - Meta Info & Skills */}
                <div className="md:col-span-1 space-y-10">
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary/60 flex items-center gap-2">
                            <IconCpu className="h-4 w-4" />
                            Core Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills?.map((skill: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="px-3 py-1 rounded-lg font-medium bg-primary/5 border-primary/10 hover:bg-primary/10 transition-colors">
                                    {skill}
                                </Badge>
                            )) || <p className="text-sm text-muted-foreground italic">No skills listed</p>}
                        </div>
                    </section>
                </div>

                {/* Right Column - Main Content */}
                <div className="md:col-span-2 space-y-12">
                    {/* Experience */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-2">
                            <IconBriefcase className="h-5 w-5 text-primary" />
                            Experience
                        </h3>
                        <div className="space-y-6">
                            {profile.internships?.length > 0 ? (
                                profile.internships.map((internship: any) => (
                                    <div key={internship.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-primary/20">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-base">{internship.role}</h4>
                                            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">{internship.duration}</span>
                                        </div>
                                        <p className="text-sm font-semibold text-primary/80 mb-2">{internship.company}</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-muted pl-3">
                                            {internship.description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No internship experience listed</p>
                            )}
                        </div>
                    </section>

                    {/* Projects */}
                    <section className="space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-2">
                            <IconFileCode className="h-5 w-5 text-primary" />
                            Projects
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {profile.projects?.length > 0 ? (
                                profile.projects.map((project: any) => (
                                    <div key={project.id} className="p-4 rounded-xl border border-border bg-muted/30 hover:border-primary/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-base flex items-center gap-2">
                                                {project.title}
                                                {project.link && (
                                                    <Link href={project.link} target="_blank">
                                                        <IconExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                    </Link>
                                                )}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.techStack?.map((tech: string, i: number) => (
                                                <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 bg-background px-2 py-0.5 rounded border border-border">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No projects listed</p>
                            )}
                        </div>
                    </section>

                    {/* Achievements */}
                    {profile.achievements?.length > 0 && (
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-2">
                                <IconTrophy className="h-5 w-5 text-primary" />
                                Achievements
                            </h3>
                            <div className="space-y-4">
                                {profile.achievements.map((achievement: any) => (
                                    <div key={achievement.id} className="flex gap-4 items-start">
                                        <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                                            <IconTrophy className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold">{achievement.title}</h4>
                                            <p className="text-xs text-muted-foreground">{achievement.type} • {achievement.date ? new Date(achievement.date).getFullYear() : "N/A"}</p>
                                            {achievement.description && <p className="text-xs text-muted-foreground mt-1 italic">{achievement.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {profile.certifications?.length > 0 && (
                        <section className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border pb-2">
                                <IconCertificate className="h-5 w-5 text-primary" />
                                Certifications
                            </h3>
                            <div className="space-y-4">
                                {profile.certifications.map((cert: any) => (
                                    <div key={cert.id} className="flex justify-between items-center p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                                        <div className="flex gap-3 items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                                                <IconCertificate className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold">{cert.title}</h4>
                                                <p className="text-xs text-muted-foreground">{cert.organization}</p>
                                            </div>
                                        </div>
                                        {cert.credentialUrl && (
                                            <Link href={cert.credentialUrl} target="_blank">
                                                <Button size="icon" variant="ghost" className="rounded-full">
                                                    <IconArrowNarrowRight className="h-5 w-5" />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
      </Container>
    </div>
  );
}