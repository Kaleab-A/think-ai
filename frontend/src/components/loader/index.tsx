import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "black" | "white";
}

export const Loader = ({
  className,
  size = "md",
  color = "black",
  ...props
}: LoaderProps) => {
  const dotSize = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  }[size];

  const dotColor = {
    black: "bg-gray-700",
    white: "bg-white",
  }[color];

  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <div className={cn("rounded-full animate-zoom-1", dotSize, dotColor)} />
      <div className={cn("rounded-full animate-zoom-2", dotSize, dotColor)} />
      <div className={cn("rounded-full animate-zoom-3", dotSize, dotColor)} />
    </div>
  );
};
