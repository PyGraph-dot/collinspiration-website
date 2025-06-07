// components/ui/skeleton.tsx
import React from "react"; // Explicitly import React
import { cn } from "@/lib/utils"; // Assuming you have a cn utility

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
