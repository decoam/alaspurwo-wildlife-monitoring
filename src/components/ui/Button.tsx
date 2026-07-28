import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "filter";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  let variantClass = "obs-btn-primary";
  if (variant === "secondary") variantClass = "obs-btn-secondary";
  if (variant === "filter") variantClass = "obs-btn-filter";
  
  if (variant === "outline") {
    variantClass = "rounded-2xl border border-emerald-900/60 bg-transparent px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-900/40";
  }
  if (variant === "danger") {
    variantClass = "flex items-center justify-center gap-2 rounded-xl border border-rose-900/60 bg-rose-950/20 py-2.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-950/40";
  }

  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
