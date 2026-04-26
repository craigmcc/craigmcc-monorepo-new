"use client";

/**
 * A text input in various styles.
 *
 * By default, the label will be presented vertically above the text field.
 * If the *labelClassName* property is included, the label will be presented
 * horizontally to the left of the text field, and the label will receive
 * the CSS classes in that property.  This can be used to set the width of
 * the label area for multiple fields, no matter how long the label itself is.
 */

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import * as React from "react";
import {
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  TextField as AriaTextField,
} from "react-aria-components";
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
        true: "disabled cursor-not-allowed opacity-50",
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
  // Extra CSS class(es) for the rendered input field
  className?: string;
  // Optional description (help text) displayed below the label, wired to aria-describedby
  description?: string;
  // Optional CSS for any rendered description [text-base-content/60 text-sm]
  descriptionClassName?: string;
  // Optional errors component to display below input field
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
  // Visual label for this input field
  label: string;
  // CSS class(es) to add if horizontal presentation is requested.  This should set the width of the label area to match multiple input fields.
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

type InputNativeProps = Omit<React.ComponentPropsWithoutRef<typeof AriaInput>, "children" | "className" | "disabled" | "onChange" | "size">;

export type InputProps = VariantProps<typeof InputVariants>
  & InputNativeProps
  & InputExtraProps;

export function Input({
  className,
  // Variants
  color,
  disabled,
  description,
  descriptionClassName = "text-base-content/60 text-sm",
  errors,
  errorsClassName = "bg-error text-error-content",
  fieldsetClassName,
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
} : InputProps) {

  const variants =
    InputVariants({color, disabled, ghost, size, className});

  return (
    <fieldset className={twMerge(clsx("fieldset", fieldsetClassName))}>
      <AriaTextField
        className={labelClassName ? "flex flex-row" : "flex flex-col"}
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
        <AriaInput
          className={twMerge(clsx(variants, "w-full"))}
          id={name}
          name={name}
          onBlur={handleBlur}
          type={type}
          {...props}
        />
      </AriaTextField>
      {errors && (
        <div className={errorsClassName}>{errors}</div>
      )}
    </fieldset>
  )

}
