import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "filter";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  let variantClass = "obs-btn-primary";
  if (variant === "secondary") variantClass = "obs-btn-secondary";
  if (variant === "filter") variantClass = "obs-btn-filter";
  
  if (variant === "outline") {
    variantClass = "rounded-2xl border border-brand-border/60 bg-transparent px-4 py-2 text-sm font-semibold text-brand-text-light hover:bg-hover-bg";
  }
  if (variant === "danger") {
    variantClass = "flex items-center justify-center gap-2 rounded-xl border border-error-bg bg-error-bg py-2.5 text-xs font-semibold text-error-text transition hover:bg-error-bg";
  }

  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
