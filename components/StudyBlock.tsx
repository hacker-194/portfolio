import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StudyBlockProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

/**
 * A labelled block in a case study, for a consistent reading rhythm.
 *
 * Shared by the project card and the case-study page, so the two renderings of
 * the same material never drift apart.
 */
export function StudyBlock({ label, children, className }: StudyBlockProps) {
  return (
    <div className={cn("hairline border-t pt-5", className)}>
      <span className="label-mono font-semibold text-soft">{label}</span>
      <div className="mt-4">{children}</div>
    </div>
  );
}
