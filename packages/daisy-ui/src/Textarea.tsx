"use client";

/**
 * A textarea input in various styles.
 *
 * By default, the label will be presented vertically above the textarea field.
 * If the *labelClassName* property is included, the label will be presented
 * horizontally to the left of the textarea field, and the label will receive
 * the CSS classes in that property.  This can be used to set the width of
 * the label area for multiple fields, no matter how long the label itself is.
 */

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import * as React from "react";
import {
  Label as AriaLabel,
  TextArea as AriaTextArea,
  Text as AriaText,
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
  // Optional description (help text) displayed below the label, wired to aria-describedby
  description?: string;
  // Optional CSS for any rendered description [text-base-content/60 text-sm]
  descriptionClassName?: string;
  // Optional errors component to display below textarea field
  errors?: React.ReactElement;
  // Optional CSS for any rendered errors [bg-error text-error-content]
  errorsClassName?: string;
  // Optional CSS for the outer fieldset wrapper
  fieldsetClassName?: string;
  // Optional handler for blur events
  handleBlur?: () => void;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Visual label for this textarea field
  label: string;
  // CSS class(es) to add if horizontal presentation is requested.  This should set the width of the label area to match multiple input fields.
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

export type TextareaProps = VariantProps<typeof TextareaVariants>
  & TextareaNativeProps
  & TextareaExtraProps;

export function Textarea({
  className,
  description,
  descriptionClassName = "text-base-content/60 text-sm",
  errors,
  errorsClassName = "bg-error text-error-content",
  fieldsetClassName,
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
}: TextareaProps) {
  const variants = TextareaVariants({ color, disabled, ghost, size, className });

  return (
    <fieldset className={twMerge(clsx("fieldset", fieldsetClassName))}>
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
        {description && (
          <AriaText slot="description" className={descriptionClassName}>
            {description}
          </AriaText>
        )}
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
      {errors && (
        <div className={errorsClassName}>{errors}</div>
      )}
    </fieldset>
  );
}
