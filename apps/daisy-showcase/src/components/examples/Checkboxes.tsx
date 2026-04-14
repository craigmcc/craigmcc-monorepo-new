"use client";

/**
 * Examples of DaisyUI+ReactArea Checkbox component.
 */

// External Modules ----------------------------------------------------------

import { Card } from "@repo/daisy-ui/Card";
import { Checkbox } from "@repo/daisy-ui/Checkbox";
import type { ComponentProps } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function Checkboxes() {
  return (

    <>

      <div className={CHECKBOX_GRID_CLASSES}>
        {COLORS.map((color) => (
          <Card className="w-full" color="base300" key={color}>
            <Card.Title className="justify-center">Colored Checkbox</Card.Title>
            <Card.Body>
              <ExampleCheckbox
                color={color}
                handleChange={() => {alert("Changed!")}}
                label={`Checkbox with color: ${color}`}
                name={`checkbox-{color}`}
                value={true}
              />
            </Card.Body>
          </Card>
        ))}
      </div>

      <hr className="my-4"/>

      <div className={CHECKBOX_GRID_CLASSES}>
        {SIZES.map((size) => (
          <Card className="w-full" color="base300" key={size}>
            <Card.Title className="justify-center">Sized Checkbox</Card.Title>
            <Card.Body>
              <ExampleCheckbox
                handleChange={() => {alert("Changed!")}}
                label={`Checkbox with size: ${size}`}
                name={`checkbox-{size}`}
                size={size}
                value={false}
              />
            </Card.Body>
          </Card>
        ))}
      </div>

      <hr className="my-4"/>

      <div className={CHECKBOX_GRID_CLASSES}>
        {COLORS.map((color) => (
          <Card className="w-full" color="base300" key={color}>
            <Card.Title className="justify-center">Disabled Checkbox</Card.Title>
            <Card.Body>
              <ExampleCheckbox
                color={color}
                disabled={true}
                handleChange={() => {alert("Changed!")}}
                label={`Disabled: ${color}`}
                name={`checkbox-disabled-{color}`}
                value={true}
              />
            </Card.Body>
          </Card>
        ))}
      </div>

      <hr className="my-4"/>

      <div className={CHECKBOX_GRID_CLASSES}>
        {COLORS.map((color) => (
          <Card className="w-full" color="base300" key={color}>
            <Card.Title className="justify-center">Invalid Checkbox</Card.Title>
            <Card.Body>
              <ExampleCheckbox
                color={color}
                handleChange={() => {alert("Changed!")}}
                isInvalid={true}
                label={`Invalid: ${color}`}
                name={`checkbox-invalid-{color}`}
                value={false}
              />
            </Card.Body>
          </Card>
        ))}
      </div>

    </>

  )

}

// Private Objects -----------------------------------------------------------

const CHECKBOX_GRID_CLASSES = "grid w-full grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4";

type CheckboxColor = NonNullable<ComponentProps<typeof Checkbox>["color"]>;
const COLORS = [
  "accent",
  "error",
  "info",
  "neutral",
  "primary",
  "secondary",
  "success",
  "warning",
] as const satisfies readonly CheckboxColor[];

type CheckboxSize = NonNullable<ComponentProps<typeof Checkbox>["size"]>;
const SIZES = [
  "lg",
  "md",
  "sm",
  "xl",
  "xs",
] as const satisfies readonly CheckboxSize[];

type ExampleCheckboxProps = {
  // Base color for this input [neutral]
  color?: CheckboxColor;
  // Present with disabled styling and behavior
  disabled?: boolean;
  // Handler for value change events
  handleChange: (newValue: boolean) => void;
  // Extra CSS class(es) for the Checkbox component [none]
  inputClassName?: string;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Label for this Checkbox component [Example Checkbox]
  label: string;
  // Name of this Checkbox component
  name: string;
  // Size of this input [md]
  size?: CheckboxSize;
  // Current input field value
  value: boolean;
}

function ExampleCheckbox({
                        color = "neutral",
                        disabled = false,
                        handleChange,
                        inputClassName = undefined,
                        isInvalid = false,
                        label,
                        name,
                        size = "md",
                        value,
                      }: ExampleCheckboxProps) {

  return (
    <Checkbox
      className={inputClassName || undefined}
      color={color}
      disabled={disabled}
      handleChange={handleChange}
      isInvalid={isInvalid}
      label={label}
      name={name}
      size={size}
      value={value}
    />
  )

}
