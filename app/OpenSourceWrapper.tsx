"use client";

import dynamic from "next/dynamic";
import type { Repo, ActivityDay } from "@/lib/github";

const OpenSource = dynamic(
  () => import("@/components/OpenSource").then((mod) => mod.OpenSource),
  { ssr: false, loading: () => null },
);

interface OpenSourceWrapperProps {
  repos: Repo[];
  activity: ActivityDay[] | null;
}

export default function OpenSourceWrapper({ repos, activity }: OpenSourceWrapperProps) {
  return <OpenSource repos={repos} activity={activity} />;
}