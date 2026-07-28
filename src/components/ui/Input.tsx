import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // bisa tambah props tambahan seperti icon dll.
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`obs-input-field ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";
