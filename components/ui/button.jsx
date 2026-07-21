"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const VARIANTS = {
  default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-subtle",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
  outline: "border border-border bg-transparent hover:bg-secondary",
  ghost: "bg-transparent hover:bg-secondary",
  destructive: "bg-error text-white hover:opacity-90",
  link: "bg-transparent underline-offset-4 hover:underline text-primary p-0 h-auto",
};

const SIZES = {
  default: "h-10 px-4 text-sm",
  sm: "h-8 px-3 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef(
  (
    { className, variant = "default", size = "default", asChild = false, type = "button", ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
