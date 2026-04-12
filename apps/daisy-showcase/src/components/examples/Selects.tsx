"use client";

/**
 * Examples of DaisyUI+ReactArea Select component.
 */

// External Modules ----------------------------------------------------------

import { Card } from "@repo/daisy-ui/Card";
import {Select, SelectOption} from "@repo/daisy-ui/Select";
import type { ComponentProps } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function Selects() {
  return (

    <>

      <div className="grid w-full grid-cols-2 gap-2">

        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal Orientation</Card.Title>
          <Card.Body>
            {COLORS.map((color) => (
              <ExampleSelect
                color={color}
                handleChange={() => {alert("Changed!")}}
                label={`Select with color: ${color}`}
                labelClassName="w-60"
                options={OPTIONS}
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
              <ExampleSelect
                color={color}
                handleChange={() => {alert("Changed!")}}
                label={`Select with color: ${color}`}
                name={`input-{color}`}
                options={OPTIONS}
                placeholder={`${color} placeholder`}
                value=""
                key={color}
              />
            ))}
          </Card.Body>
        </Card>

      </div>

      <hr className="my-4"/>

      <div className="grid w-full grid-cols-2 gap-2">

        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal Orientation</Card.Title>
          <Card.Body>
            {SIZES.map((size) => (
              <ExampleSelect
                handleChange={() => {alert("Changed!")}}
                label={`Select with size: ${size}`}
                labelClassName="w-60"
                name={`input-{size}`}
                options={OPTIONS}
                placeholder={`${size} placeholder`}
                size={size}
                value=""
                key={size}
              />
            ))}
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Vertical Orientation</Card.Title>
          <Card.Body>
            {SIZES.map((size) => (
              <ExampleSelect
                handleChange={() => {alert("Changed!")}}
                label={`Select with size: ${size}`}
                name={`input-{size}`}
                options={OPTIONS}
                placeholder={`${size} placeholder`}
                size={size}
                value=""
                key={size}
              />
            ))}
          </Card.Body>
        </Card>

      </div>

    </>

  )
}

// Private Objects -----------------------------------------------------------

type SelectColor = NonNullable<ComponentProps<typeof Select>["color"]>;
const COLORS = [
  "accent",
  "error",
  "info",
  "neutral",
  "primary",
  "secondary",
  "success",
  "warning",
] as const satisfies readonly SelectColor[];

type SelectSize = NonNullable<ComponentProps<typeof Select>["size"]>;
const SIZES = [
  "lg",
  "md",
  "sm",
  "xl",
  "xs",
] as const satisfies readonly SelectSize[];

type ExampleSelectProps = {
  // Should we render a solid border? [false]
  border?: boolean;
  // Base color for this input [neutral]
  color?: SelectColor;
  // Should we render a dashed border? [false]
  dash?: boolean;
  // Present with disabled styling and behavior
  disabled?: boolean;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Extra CSS class(es) for the Select component [none]
  inputClassName?: string;
  // Label for this Select component [Example Select]
  label: string;
  // Label spacing CSS (implies horizontal alignment) [none]
  labelClassName?: string;
  // Name of this Select component
  name: string;
  // Options for this Select component
  options: SelectOption[];
  // Placeholder for this Select component [none]
  placeholder?: string;
  // Size of this input [md]
  size?: SelectSize;
  // Field type [text]
  type?: string;
  // Current input field value
  value: string;
}

const OPTIONS: SelectOption[] = [
  { label: "First Option", value: "first" },
  { disabled: true, label: "Second Option", value: "second" },
  { label: "Third Option", value: "third" },
]

function ExampleSelect({
                        color = "neutral",
                        disabled = false,
                        handleChange,
                        inputClassName = undefined,
                        label,
                        labelClassName = undefined,
                        name,
                        options,
                        placeholder = undefined,
                        size = "md",
                        value,
                      }: ExampleSelectProps) {

  return (
    <Select
      className={inputClassName || undefined}
      color={color}
      disabled={disabled}
      handleChange={handleChange}
      label={label}
      labelClassName={labelClassName}
      name={name}
      options={options}
      placeholder={placeholder}
      size={size}
      value={value}
    />
  )

}
