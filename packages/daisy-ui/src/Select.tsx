"use client";

/**
 * A select input in various styles.
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
export const SelectVariants = cva(
  "select",
  {
    defaultVariants: {
      color: "neutral",
      disabled: false,
      ghost: false,
      size: "md",
    },
    variants: {
      // Base color for this component
      color: {
        accent: "select-accent",
        error: "select-error",
        info: "select-info",
        neutral: "select-neutral",
        primary: "select-primary",
        secondary: "select-secondary",
        success: "select-success",
        warning: "select-warning",
      },
      // Present with disabled styling and behavior
      disabled: {
        false: null,
        true: "disabled cursor-not-allowed opacity-50",
      },
      // Present with ghost styling
      ghost: {
        false: null,
        true: "select-ghost",
      },
      // Basic size of this component
      size: {
        lg: "select-lg",
        md: "select-md",
        sm: "select-sm",
        xl: "select-xl",
        xs: "select-xs",
      },
    },
  }
);

type SelectExtraProps = {
  // Optional handler for blur events
  handleBlur?: () => void;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Visual label for this select field
  label: string;
  // CSS class(es) to add if horizontal presentation is requested
  // (should set the width of the label area to match multiple input fields)
  labelClassName?: string;
  // Select field name (also used as id)
  name: string;
  // Available options for this Select component
  options: SelectOption[];
  // Optional placeholder for empty value
  placeholder?: string;
  // Current input field value
  value: string;
}

type SelectNativeProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">;

/**
 * An option for a Select component.
 */
export type SelectOption = {
  // Is this option disabled? [false]
  disabled?: boolean;
  // Displayed label for this option
  label: string;
  // Value returned when this option is selected
  value: string;
}

export function Select({
                         className,
                         // Variants
                         color,
                         disabled,
                         ghost,
                         size,
                         // Extra Props
                         handleBlur,
                         handleChange,
                         isInvalid = false,
                         label,
                         labelClassName,
                         name,
                         options,
                         value,
                         // Select Element Props
                         ...props
                       } : VariantProps<typeof SelectVariants>
  & SelectNativeProps
  & SelectExtraProps) {

  const variants =
    SelectVariants({color, disabled, ghost, size, className});

  return (
    <fieldset className="fieldset">
      <div className={labelClassName ? "flex flex-row" : "flex flex-col"}>
        <legend className={twMerge(clsx("fieldset-legend", labelClassName))}>
          {label}
        </legend>
        <select
          className={twMerge(clsx(variants, "w-full"))}
          aria-invalid={isInvalid}
          id={name}
          name={name}
          onBlur={handleBlur}
          onChange={(e) => handleChange(e.target.value)}
          value={value}
          {...props}
        >
          {options.map((option) => (
            <option disabled={option.disabled} key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}
