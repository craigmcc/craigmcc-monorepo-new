"use client";

/**
 * A checkbox in various styles.  NOTE: Checkbox does not have a
 * vertical presentation - it's shown as the checkbox followed by the label.
 */

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { Check } from "lucide-react";
import * as React from "react";
import {
  Checkbox as AriaCheckbox,
  Text as AriaText,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Variant properties for this component.
 */
export const CheckboxVariants = cva(
  "checkbox",
  {
    defaultVariants: {
      color: "neutral",
      disabled: false,
      size: "md",
    },
    variants: {
      // Base color for this component
      color: {
        accent: "checkbox-accent",
        error: "checkbox-error",
        info: "checkbox-info",
        neutral: "checkbox-neutral",
        primary: "checkbox-primary",
        secondary: "checkbox-secondary",
        success: "checkbox-success",
        warning: "checkbox-warning",
      },
      // Present with disabled styling and behavior
      disabled: {
        false: null,
        true: "disabled cursor-not-allowed opacity-50",
      },
      // Basic size of this component
      size: {
        lg: "checkbox-lg",
        md: "checkbox-md",
        sm: "checkbox-sm",
        xl: "checkbox-xl",
        xs: "checkbox-xs",
      },
    },
  }
);

const CHECK_ICON_COLOR_CLASSES: Record<NonNullable<VariantProps<typeof CheckboxVariants>["color"]>, string> = {
  accent: "text-accent-content",
  error: "text-error-content",
  info: "text-info-content",
  neutral: "text-neutral-content",
  primary: "text-primary-content",
  secondary: "text-secondary-content",
  success: "text-success-content",
  warning: "text-warning-content",
};

const CHECK_SELECTED_FILL_CLASSES: Record<NonNullable<VariantProps<typeof CheckboxVariants>["color"]>, string> = {
  accent: "bg-accent border-accent",
  error: "bg-error border-error",
  info: "bg-info border-info",
  neutral: "bg-neutral border-neutral",
  primary: "bg-primary border-primary",
  secondary: "bg-secondary border-secondary",
  success: "bg-success border-success",
  warning: "bg-warning border-warning",
};

const CHECK_ICON_SIZE_PX: Record<NonNullable<VariantProps<typeof CheckboxVariants>["size"]>, number> = {
  lg: 16,
  md: 14,
  sm: 12,
  xl: 18,
  xs: 10,
};

type CheckboxExtraProps = {
  // Extra CSS class(es) for the rendered checkbox indicator
  className?: string;
  // Optional description (help text) displayed below the checkbox, wired to aria-describedby
  description?: string;
  // Optional CSS for any rendered description [text-base-content/60 text-sm]
  descriptionClassName?: string;
  // Optional errors component to display below checkbox field
  errors?: React.ReactElement;
  // Optional CSS for any rendered errors [bg-error text-error-content]
  errorsClassName?: string;
  // Optional CSS for the outer fieldset wrapper
  fieldsetClassName?: string;
  // Optional handler for blur events
  handleBlur?: () => void;
  // Handler for value change events
  handleChange: (newValue: boolean) => void;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Visual label for this checkbox field
  label: string;
  // Checkbox field name (also used as id)
  name: string;
  // Current value (checked or not)
  value?: boolean;
}

type CheckboxNativeProps = Omit<
  React.ComponentPropsWithoutRef<typeof AriaCheckbox>,
  "children" | "className" | "isDisabled" | "isInvalid" | "isSelected" | "name" | "onBlur" | "onChange" | "size" | "value"
>;

export type CheckboxProps = VariantProps<typeof CheckboxVariants>
  & CheckboxNativeProps
  & CheckboxExtraProps;

export function Checkbox({
                        className,
                        errors,
                        errorsClassName = "bg-error text-error-content",
                        description,
                        descriptionClassName = "text-base-content/60 text-sm",
                        fieldsetClassName,
                        // Variants
                        color,
                        disabled,
                        size,
                        // Extra Props
                        handleBlur,
                        handleChange,
                        isInvalid = false,
                        label,
                        name,
                        value = false,
                        ...props
                      } : CheckboxProps) {

  const variants =
    CheckboxVariants({color, disabled, size, className});
  const iconColorClass = CHECK_ICON_COLOR_CLASSES[color ?? "neutral"];
  const selectedFillClass = CHECK_SELECTED_FILL_CLASSES[color ?? "neutral"];
  const iconSizePx = CHECK_ICON_SIZE_PX[size ?? "md"];

  return (
    <fieldset className={twMerge(clsx("fieldset w-full", fieldsetClassName))}>
      <AriaCheckbox
        className="flex flex-row items-center"
        isDisabled={Boolean(disabled)}
        isInvalid={isInvalid}
        isSelected={value}
        name={name}
        onBlur={handleBlur}
        onChange={handleChange}
        {...props}
      >
        {({ isSelected }) => (
          <>
            <span className="relative inline-flex items-center justify-center">
              <span
                className={twMerge(
                  clsx(
                    variants,
                    "inline-flex items-center justify-center",
                    selectedFillClass,
                  ),
                )}
              />
              {isSelected ? (
                <Check
                  aria-hidden="true"
                  className={twMerge(clsx("pointer-events-none absolute inset-0 m-auto", iconColorClass))}
                  size={iconSizePx}
                  strokeWidth={3.25}
                />
              ) : null}
            </span>
            <span className={twMerge(clsx("fieldset-legend", "pl-2"))}>{label}</span>
          </>
        )}
      </AriaCheckbox>
      {description && (
        <AriaText slot="description" className={descriptionClassName}>
          {description}
        </AriaText>
      )}
      {errors && (
        <div className={errorsClassName}>{errors}</div>
      )}
    </fieldset>
  );

}
