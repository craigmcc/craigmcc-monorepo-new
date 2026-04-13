"use client";

/**
 * A textarea input in various styles.
 */

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import * as React from "react";
import {
  Label as AriaLabel,
  TextArea as AriaTextArea,
  TextField as AriaTextField,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Variant properties for this component.
 */
export const TextareaVariants = cva(
  "textarea",
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
        accent: "textarea-accent",
        error: "textarea-error",
        info: "textarea-info",
        neutral: "textarea-neutral",
        primary: "textarea-primary",
        secondary: "textarea-secondary",
        success: "textarea-success",
        warning: "textarea-warning",
      },
      // Present with disabled styling and behavior
      disabled: {
        false: null,
        true: "disabled cursor-not-allowed opacity-50",
      },
      // Present with ghost styling
      ghost: {
        false: null,
        true: "textarea-ghost",
      },
      // Basic size of this component
      size: {
        lg: "textarea-lg",
        md: "textarea-md",
        sm: "textarea-sm",
        xl: "textarea-xl",
        xs: "textarea-xs",
      },
    },
  }
);

type TextareaExtraProps = {
  // Extra CSS class(es) for the rendered textarea
  className?: string;
  // Optional handler for blur events
  handleBlur?: () => void;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Visual label for this textarea field
  label: string;
  // CSS class(es) to add if horizontal presentation is requested
  // (should set the width of the label area to match multiple fields)
  labelClassName?: string;
  // Textarea field name (also used as id)
  name: string;
  // Optional placeholder for empty value
  placeholder?: string;
  // Number of visible text rows [3]
  rows?: number;
  // Current textarea field value
  value: string;
}

type TextareaNativeProps = Omit<
  React.ComponentPropsWithoutRef<typeof AriaTextArea>,
  "children" | "className" | "disabled" | "onChange" | "rows" | "size"
>;

export function Textarea({
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
  placeholder,
  rows = 3,
  value,
  // TextArea Element Props
  ...props
}: VariantProps<typeof TextareaVariants> &
  TextareaNativeProps &
  TextareaExtraProps) {
  const variants = TextareaVariants({ color, disabled, ghost, size, className });

  return (
    <fieldset className="fieldset">
      <AriaTextField
        className={labelClassName ? "flex flex-row items-center" : "flex flex-col"}
        isDisabled={Boolean(disabled)}
        isInvalid={isInvalid}
        onChange={handleChange}
        value={value}
      >
        <AriaLabel className={twMerge(clsx("fieldset-legend", labelClassName))}>
          {label}
        </AriaLabel>
        <AriaTextArea
          className={twMerge(clsx(variants, "w-full"))}
          id={name}
          name={name}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          {...props}
        />
      </AriaTextField>
    </fieldset>
  );
}

