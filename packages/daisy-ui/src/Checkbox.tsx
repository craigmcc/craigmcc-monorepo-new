"use client";

/**
 * A checkbox in various styles.  NOTE: Checkbox does not have a
 * vertical presentation - it's shown as the checkbox followed by the label.
 */

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import * as React from "react";
import {
//  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps
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

type CheckboxExtraProps = {
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

type CheckboxNativeProps = Omit<AriaCheckboxProps, "size" | "value">;

export function Checkbox({
                        className,
                        // Variants
                        color,
                        disabled,
                        size,
                        // Extra Props
                        handleBlur,
                        handleChange,
                        label,
                        name,
                        value = false,
                      } : VariantProps<typeof CheckboxVariants>
                        & CheckboxNativeProps
                        & CheckboxExtraProps) {

  const variants =
    CheckboxVariants({color, disabled, size, className});

    return (
      <fieldset className="fieldset w-full">
        <div className="flex flex-row items-center">
          <input
            checked={value}
            className={twMerge(clsx(variants))}
            id={name}
            name={name}
            onBlur={handleBlur}
            onChange={(e) => handleChange(e.target.checked)}
            type="checkbox"
          />
          <legend
            className={twMerge(clsx("fieldset-legend", "pl-2"))}
          >{label}</legend>
        </div>
      </fieldset>
    );

}
