"use client";

/**
 * Examples of DaisyUI+ReactArea Input component.
 */

// External Modules ----------------------------------------------------------

import { Card } from "@repo/daisy-ui/Card";
import { Input } from "@repo/daisy-ui/Input";
import  { ComponentProps } from "react";
import * as React from "react";

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

      <div className="grid w-full grid-cols-2 gap-2">

        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal Orientation</Card.Title>
          <Card.Body>
            {SIZES.map((size) => (
              <ExampleInput
                handleChange={() => {alert("Changed!")}}
                label={`Input with size: ${size}`}
                labelClassName="w-60"
                name={`input-{size}`}
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
              <ExampleInput
                handleChange={() => {alert("Changed!")}}
                label={`Input with size: ${size}`}
                name={`input-{size}`}
                placeholder={`${size} placeholder`}
                size={size}
                value=""
                key={size}
              />
            ))}
          </Card.Body>
        </Card>

      </div>

      <hr className="my-4"/>

      <div className="grid w-full grid-cols-2 gap-2">

        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal / Disabled</Card.Title>
          <Card.Body>
            <ExampleInput
              disabled={true}
              handleChange={() => {alert("Changed!")}}
              label="Disabled Input"
              labelClassName="w-60"
              name="input-disabled-horizontal"
              placeholder="disabled placeholder"
              value=""
            />
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Vertical / Disabled</Card.Title>
          <Card.Body>
            <ExampleInput
              disabled={true}
              handleChange={() => {alert("Changed!")}}
              label="Disabled Input"
              name="input-disabled-vertical"
              placeholder="disabled placeholder"
              value=""
            />
          </Card.Body>
        </Card>

      </div>

      <hr className="my-4"/>

      <div className="grid w-full grid-cols-2 gap-2">

        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal / Invalid</Card.Title>
          <Card.Body>
            <ExampleInput
              handleChange={() => {alert("Changed!")}}
              isInvalid={true}
              label="Invalid Input"
              labelClassName="w-60"
              name="input-invalid-horizontal"
              placeholder="invalid placeholder"
              value="bad value"
            />
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Vertical / Invalid</Card.Title>
          <Card.Body>
            <ExampleInput
              handleChange={() => {alert("Changed!")}}
              isInvalid={true}
              label="Invalid Input"
              name="input-invalid-vertical"
              placeholder="invalid placeholder"
              value="bad value"
            />
          </Card.Body>
        </Card>

      </div>

      <hr className="my-4"/>

      <div className="grid w-full grid-cols-2 gap-2">

        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal / Errors</Card.Title>
          <Card.Body>
            <ExampleInput
              errors={<ExampleErrors />}
              handleChange={() => {alert("Changed!")}}
              isInvalid={true}
              label="Errors Input"
              labelClassName="w-60"
              name="input-errors-horizontal"
              placeholder="errors placeholder"
              value=""
            />
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Vertical / Errors</Card.Title>
          <Card.Body>
            <ExampleInput
              errors={<ExampleErrors />}
              handleChange={() => {alert("Changed!")}}
              isInvalid={true}
              label="Errors Input"
              name="input-errors-vertical"
              placeholder="errors placeholder"
              value=""
            />
          </Card.Body>
        </Card>

      </div>

    </>

  )
}

// Private Objects -----------------------------------------------------------

function ExampleErrors() {
  return (
    <div className="bg-error text-error-content">
      Sample Errors
    </div>
  )
}

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

type InputSize = NonNullable<ComponentProps<typeof Input>["size"]>;
const SIZES = [
  "lg",
  "md",
  "sm",
  "xl",
  "xs",
] as const satisfies readonly InputSize[];

type ExampleInputProps = {
  // Should we render a solid border? [false]
  border?: boolean;
  // Base color for this input [neutral]
  color?: InputColor;
  // Should we render a dashed border? [false]
  dash?: boolean;
  // Present with disabled styling and behavior
  disabled?: boolean;
  // Optional errors component to display below input field
  errors?: React.ReactElement;
  // Errors rendering CSS [bg-error text-error-content]
  errorsClassName?: string;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Extra CSS class(es) for the Input component [none]
  inputClassName?: string;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Label for this Input component [Example Input]
  label: string;
  // Label spacing CSS (implies horizontal alignment) [none]
  labelClassName?: string;
  // Name of this Input component
  name: string;
  // Placeholder for this Input component [none]
  placeholder?: string;
  // Size of this input [md]
  size?: InputSize;
  // Field type [text]
  type?: string;
  // Current input field value
  value: string;
}

function ExampleInput({
  color = "neutral",
  disabled = false,
  errors,
  errorsClassName = "bg-error text-error-content",
  handleChange,
  inputClassName = undefined,
  isInvalid = false,
  label,
  labelClassName = undefined,
  name,
  placeholder = undefined,
  size = "md",
  type = "text",
  value,
}: ExampleInputProps) {

  return (
    <Input
      className={inputClassName || undefined}
      color={color}
      disabled={disabled}
      errors={errors}
      errorsClassName={errorsClassName}
      handleChange={handleChange}
      isInvalid={isInvalid}
      label={label}
      labelClassName={labelClassName}
      name={name}
      placeholder={placeholder}
      size={size}
      type={type}
      value={value}
    />
  )

}
