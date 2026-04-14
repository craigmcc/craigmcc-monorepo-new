"use client";

/**
 * A select input in various styles.
 */

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import * as React from "react";
import {
  Button as AriaButton,
  Label as AriaLabel,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
} from "react-aria-components";
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
  // Extra CSS class(es) for the trigger button
  className?: string;
  // Optional handler for blur events
  handleBlur?: () => void;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Visual label for this select field
  label: string;
  // CSS class(es) to add if horizontal presentation is requested
  // (should set the width of the label area to match multiple select fields)
  labelClassName?: string;
  // Select field name (also used as id)
  name: string;
  // Available options for this Select component
  options: SelectOption[];
  // Optional placeholder text when no value is selected
  placeholder?: string;
  // Current selected value (empty string means no selection / show placeholder)
  value: string;
}

type SelectNativeProps = Omit<
  React.ComponentPropsWithoutRef<typeof AriaSelect>,
  | "children"
  | "className"
  | "isDisabled"
  | "isInvalid"
  | "name"
  | "onBlur"
  | "onChange"
  | "onSelectionChange"
  | "selectedKey"
  | "value"
>;

/**
 * An option for a Select component.
 */
export type SelectOption = {
  // Is this option disabled? [false]
  isDisabled?: boolean;
  // Displayed label for this option
  label: string;
  // Plain-text value for type-ahead search (defaults to label if omitted)
  textValue?: string;
  // Value returned when this option is selected (used as the item key)
  value: string;
}

// Styling constants --------------------------------------------------------

const ITEM_BASE_CLASSES = [
  "rounded-field cursor-default px-3 py-2 outline-none",
  "data-[focused=true]:bg-base-200",
  "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
].join(" ");

const POPOVER_BASE_CLASSES =
  "z-50 min-w-[var(--trigger-width)] rounded-box border border-base-300 bg-base-100 shadow-lg";

// Public Function ------------------------------------------------------------

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
  placeholder,
  value,
  // React Aria Select Props
  ...props
}: VariantProps<typeof SelectVariants>
  & SelectNativeProps
  & SelectExtraProps) {

  const variants = SelectVariants({ color, disabled, ghost, size, className });

  return (
    <fieldset className="fieldset">
      <AriaSelect
        className={labelClassName ? "flex flex-row items-center" : "flex flex-col"}
        isDisabled={Boolean(disabled)}
        isInvalid={isInvalid}
        name={name}
        onBlur={handleBlur}
        onChange={(key) => handleChange(key !== null ? String(key) : "")}
        value={value || null}
        {...props}
      >
        <AriaLabel className={twMerge(clsx("fieldset-legend", labelClassName))}>
          {label}
        </AriaLabel>
        <AriaButton
          className={twMerge(clsx(variants, "w-full flex items-center justify-between"))}
          id={name}
        >
          <AriaSelectValue>
            {({ defaultChildren, isPlaceholder }) =>
              isPlaceholder ? (placeholder ?? null) : defaultChildren
            }
          </AriaSelectValue>
        </AriaButton>
        <AriaPopover className={POPOVER_BASE_CLASSES}>
          <AriaListBox className="flex flex-col p-1 outline-none">
            {options.map((option) => (
              <AriaListBoxItem
                className={ITEM_BASE_CLASSES}
                id={option.value}
                isDisabled={option.isDisabled}
                key={option.value}
                textValue={option.textValue ?? option.label}
              >
                {option.label}
              </AriaListBoxItem>
            ))}
          </AriaListBox>
        </AriaPopover>
      </AriaSelect>
    </fieldset>
  );
}
