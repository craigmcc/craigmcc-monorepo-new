"use client";

/**
 * Examples of DaisyUI+ReactArea Input component.
 */

// External Modules ----------------------------------------------------------

import { Card } from "@repo/daisy-ui/Card";
import { Input } from "@repo/daisy-ui/Input";
import type { ComponentProps } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function Inputs() {
  return (

    <>

      <div className="grid w-full grid-cols-2 gap-2">

        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal Orientation</Card.Title>
          <Card.Body>
            {COLORS.map((color) => (
              <ExampleInput
                color={color}
                handleChange={() => {alert("Changed!")}}
                label={`Input with color: ${color}`}
                labelClassName="w-60"
                name={`input-{color}`}
                placeholder={`${color} placeholder`}
                value=""
                key={color}
              />
            ))}
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Vertical Orientation</Card.Title>
          <Card.Body>
            {COLORS.map((color) => (
              <ExampleInput
                color={color}
                handleChange={() => {alert("Changed!")}}
                label={`Input with color: ${color}`}
                name={`input-{color}`}
                placeholder={`${color} placeholder`}
                value=""
                key={color}
              />
            ))}
          </Card.Body>
        </Card>

      </div>

      <hr className="my-4"/>

    </>

  )
}

// Private Objects -----------------------------------------------------------

type InputColor = NonNullable<ComponentProps<typeof Input>["color"]>;
const COLORS = [
  "accent",
  "error",
  "info",
  "neutral",
  "primary",
  "secondary",
  "success",
  "warning",
] as const satisfies readonly InputColor[];

/*
type InputSize = NonNullable<ComponentProps<typeof Input>["size"]>;
const SIZES = [
  "lg",
  "md",
  "sm",
  "xl",
  "xs",
] as const satisfies readonly InputSize[];
*/

type ExampleInputProps = {
  // Should we render a solid border? [false]
  border?: boolean;
  // Base color for this input [neutral]
  color: InputColor;
  // Should we render a dashed border? [false]
  dash?: boolean;
  // Present with disabled styling and behavior
  disabled?: boolean;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Extra CSS class(es) for the Input component [none]
  inputClassName?: string;
  // Label for this Input component [Example Input]
  label: string;
  // Label spacing CSS (implies horizontal alignment) [none]
  labelClassName?: string;
  // Name of this Input component
  name: string;
  // Placeholder for this Input component [none]
  placeholder?: string;
  // Size of this input [md]
//  size: InputSize;
  // Current input field value
  value: string;
}

function ExampleInput({
  color = "neutral",
  disabled = false,
  handleChange,
  inputClassName = undefined,
  label,
  labelClassName = undefined,
  name,
  placeholder = undefined,
//  size = "md",
  value,
}: ExampleInputProps) {

  return (
    <Input
      className={inputClassName || undefined}
      color={color}
      disabled={disabled}
      handleChange={handleChange}
      label={label}
      labelClassName={labelClassName}
      name={name}
      placeholder={placeholder}
//      size={size}
      value={value}
    />
  )

}
