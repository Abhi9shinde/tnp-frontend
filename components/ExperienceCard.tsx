"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  experience: any;
};

export function ExperienceCard({ experience }: Props) {
  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + "..." : str;
  };
  const router = useRouter();

  return (
    <Card className="hover:shadow-md transition cursor-pointer">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{experience.title}</h3>
          <Badge variant="secondary">{experience.difficulty}</Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {experience.company} • {experience.role}
        </p>

        <p className="text-xs text-muted-foreground">
          By {experience.author.firstName} {experience.author.lastName}
        </p>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {truncate(experience.content, 150)}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {new Date(experience.createdAt).toISOString().substring(0, 10)}
          </p>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/student/experiences/${experience.id}`)}
          >
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
