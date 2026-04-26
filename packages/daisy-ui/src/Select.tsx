"use client";

/**
 * A select input in various styles.
 *
 * By default, the label will be presented vertically above the select field.
 * If the *labelClassName* property is included, the label will be presented
 * horizontally to the left of the select field, and the label will receive
 * the CSS classes in that property.  This can be used to set the width of
 * the label area for multiple fields, no matter how long the label itself is.
*/

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import * as React from "react";
import {
  Button as AriaButton,
  Header,
  Label as AriaLabel,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  Text as AriaText,
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
  // Optional description (help text) displayed below the label, wired to aria-describedby
  description?: string;
  // Optional CSS for any rendered description [text-base-content/60 text-sm]
  descriptionClassName?: string;
  // Optional errors component to display below select field
  errors?: React.ReactElement;
  // Optional CSS for any rendered errors [bg-error text-error-content]
  errorsClassName?: string;
  // CSS class(es) to add to rendered options and sections
  entryClassName?: string;
  // Optional CSS for the outer fieldset wrapper
  fieldsetClassName?: string;
  // Optional handler for blur events
  handleBlur?: () => void;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Visual label for this select field
  label: string;
  // CSS class(es) to add if horizontal presentation is requested.  This should set the width of the label area to match multiple input fields.
  labelClassName?: string;
  // CSS class(es) to add to the rendered ListBox
  listBoxClassName?: string;
  // Select field name (also used as id)
  name: string;
  // Available options for this Select component
  options: SelectCollection;
  // Optional placeholder text when no value is selected
  placeholder?: string;
  // CSS class(es) to add to rendered options
  optionClassName?: string;
  // CSS class(es) to add to the popover wrapper
  popoverClassName?: string;
  // CSS class(es) to add to rendered sections
  sectionClassName?: string;
  // CSS class(es) to add to rendered section headings
  sectionHeadingClassName?: string;
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

export type SelectProps = VariantProps<typeof SelectVariants>
  & SelectNativeProps
  & SelectExtraProps;

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

/**
 * A labeled group of options for a Select component.
 */
export type SelectSection = {
  // Optional stable key for this section (defaults to label)
  id?: string | number;
  // Displayed heading for this section
  label: string;
  // Options rendered within this section
  options: ReadonlyArray<SelectOption>;
}

export type SelectCollectionEntry = SelectOption | SelectSection;

export type SelectCollection = ReadonlyArray<SelectCollectionEntry>;

// Styling constants --------------------------------------------------------

const ITEM_BASE_CLASSES = [
  "rounded-field cursor-default px-3 py-2 outline-none",
  "data-[focused=true]:bg-base-200",
  "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
].join(" ");

const LISTBOX_BASE_CLASSES = "flex flex-col p-1 outline-none";

const POPOVER_BASE_CLASSES =
  "z-50 min-w-[var(--trigger-width)] rounded-box border border-base-300 bg-base-100 shadow-lg";

const SECTION_BASE_CLASSES = "flex flex-col gap-1 py-1";

const SECTION_HEADING_BASE_CLASSES =
  "px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-base-content/60";

// Private Functions ---------------------------------------------------------

function isSelectSection(option: SelectCollectionEntry): option is SelectSection {
  return "options" in option;
}

function renderSelectOption(option: SelectOption, entryClassName?: string, optionClassName?: string) {
  return (
    <AriaListBoxItem
      className={twMerge(clsx(ITEM_BASE_CLASSES, entryClassName, optionClassName))}
      id={option.value}
      isDisabled={option.isDisabled}
      key={option.value}
      textValue={option.textValue ?? option.label}
    >
      {option.label}
    </AriaListBoxItem>
  );
}

function renderSelectCollectionEntry(
  option: SelectCollectionEntry,
  entryClassName?: string,
  optionClassName?: string,
  sectionClassName?: string,
  sectionHeadingClassName?: string,
) {
  if (!isSelectSection(option)) {
    return renderSelectOption(option, entryClassName, optionClassName);
  }

  if (option.options.length === 0) {
    return null;
  }

  const sectionKey = option.id ?? option.label;

  return (
    <ListBoxSection
      className={twMerge(clsx(SECTION_BASE_CLASSES, entryClassName, sectionClassName))}
      id={option.id}
      key={sectionKey}
    >
      <Header className={twMerge(clsx(SECTION_HEADING_BASE_CLASSES, sectionHeadingClassName))}>
        {option.label}
      </Header>
      {option.options.map((sectionOption) =>
        renderSelectOption(sectionOption, entryClassName, optionClassName)
      )}
    </ListBoxSection>
  );
}

// Public Function ------------------------------------------------------------

export function Select({
  className,
  entryClassName,
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
  listBoxClassName,
  name,
  options,
  optionClassName,
  placeholder,
  popoverClassName,
  sectionClassName,
  sectionHeadingClassName,
  value,
  // React Aria Select Props
  ...props
}: SelectProps) {

  const variants = SelectVariants({ color, disabled, ghost, size, className });

  return (
    <fieldset className={twMerge(clsx("fieldset", fieldsetClassName))}>
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
        {description && (
          <AriaText slot="description" className={descriptionClassName}>
            {description}
          </AriaText>
        )}
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
        <AriaPopover className={twMerge(clsx(POPOVER_BASE_CLASSES, popoverClassName))}>
          <AriaListBox className={twMerge(clsx(LISTBOX_BASE_CLASSES, listBoxClassName))}>
            {options.map((option) => renderSelectCollectionEntry(
              option,
              entryClassName,
              optionClassName,
              sectionClassName,
              sectionHeadingClassName,
            ))}
          </AriaListBox>
        </AriaPopover>
      </AriaSelect>
      {errors && (
        <div className={errorsClassName}>{errors}</div>
      )}
    </fieldset>
  );
}
