"use client";

/**
 * A text input in various styles.
 */

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Variant properties for this component.
 */
export const InputVariants = cva(
  "input",
  {
    defaultVariants: {
      color: "neutral",
      disabled: false,
      error: false,
      ghost: false,
      size: "md",
    },
    variants: {
      // Base color for this component
      color: {
        accent: "input-accent",
        error: "input-error",
        info: "input-info",
        neutral: "input-neutral",
        primary: "input-primary",
        secondary: "input-secondary",
        success: "input-success",
        warning: "input-warning",
      },
      // Present with disabled styling and behavior
      disabled: {
        false: null,
        true: "input-disabled cursor-not-allowed opacity-50",
      },
      // Present with error styling and behavior
      error: {
        false: null,
        true: "input-error",
      },
      // Present with ghost styling
      ghost: {
        false: null,
        true: "input-ghost",
      },
      // Basic size of this component
      size: {
        lg: "input-lg",
        md: "input-md",
        sm: "input-sm",
        xl: "input-xl",
        xs: "input-xs",
      },
    },
  }
);

type InputExtraProps = {
  // Optional handler for blur events
  handleBlur?: () => void;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Visual label for this input field
  label: string;
  // CSS class(es) to add if horizontal presentation is requested
  // (should set the width of the label area to match multiple input fields)
  labelClassName?: string;
  // Input field name (also used as id)
  name: string;
  // Optional placeholder for empty value
  placeholder?: string;
  // Input field type [text]
  type?: string;
  // Current input field value
  value: string;
}

export function Input({
  className,
  // Variants
  color,
  disabled,
  error,
  ghost,
  size,
  // Extra Props
  handleBlur,
  handleChange,
  isInvalid = false,
  label,
  labelClassName,
  name,
  type,
  value,
  // Input Element Props
  ...props
} : VariantProps<typeof InputVariants>
    & React.ComponentPropsWithoutRef<"input">
    & InputExtraProps) {

  const variants =
    InputVariants({color, disabled, error, ghost, size, className});

  if (labelClassName) {
    // Horizontal presentation
    return (
      <fieldset className="fieldset">
        <div className="flex flex-row">
          <legend
            className={twMerge(clsx("fieldset-legend", labelClassName))}
          >{label}</legend>
          <input
            className={twMerge(clsx(variants, "w-full"))}
            aria-invalid={isInvalid}
            id={name}
            name={name}
            onBlur={handleBlur}
            onChange={(e) => handleChange(e.target.value)}
            type={type}
            value={value}
            {...props}
          />
        </div>
      </fieldset>
    )
  } else {
    // Vertical presentation
    return (
      <fieldset className="fieldset">
        <div className="flex flex-col">
          <legend className="fieldset-legend">{label}</legend>
          <input
            className={twMerge(clsx(variants, "w-full"))}
            aria-invalid={isInvalid}
            id={name}
            name={name}
            onBlur={handleBlur}
            onChange={(e) => handleChange(e.target.value)}
            type={type}
            value={value}
            {...props}
          />
        </div>
      </fieldset>
    )
  }
}
