import React, { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className = "", children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`obs-select-field ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";
