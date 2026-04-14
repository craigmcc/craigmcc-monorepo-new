"use client";

/**
 * Examples of DaisyUI+ReactArea Select component.
 */

// External Modules ----------------------------------------------------------

import { Card } from "@repo/daisy-ui/Card";
import { Select } from "@repo/daisy-ui/Select";
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

      <hr className="my-4"/>

      <div className="grid w-full grid-cols-2 gap-2">

        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal / Disabled</Card.Title>
          <Card.Body>
            <ExampleSelect
              disabled={true}
              handleChange={() => {alert("Changed!")}}
              label="Disabled Select"
              labelClassName="w-60"
              name="select-disabled-horizontal"
              options={OPTIONS}
              placeholder="disabled placeholder"
              value=""
            />
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Vertical / Disabled</Card.Title>
          <Card.Body>
            <ExampleSelect
              disabled={true}
              handleChange={() => {alert("Changed!")}}
              label="Disabled Select"
              name="select-disabled-vertical"
              options={OPTIONS}
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
            <ExampleSelect
              handleChange={() => {alert("Changed!")}}
              isInvalid={true}
              label="Invalid Select"
              labelClassName="w-60"
              name="select-invalid-horizontal"
              options={OPTIONS}
              placeholder="invalid placeholder"
              value="first"
            />
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Vertical / Invalid</Card.Title>
          <Card.Body>
            <ExampleSelect
              handleChange={() => {alert("Changed!")}}
              isInvalid={true}
              label="Invalid Select"
              name="select-invalid-vertical"
              options={OPTIONS}
              placeholder="invalid placeholder"
              value="first"
            />
          </Card.Body>
        </Card>

      </div>

      <hr className="my-4"/>

      <div className="grid w-full grid-cols-2 gap-2">

        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal / Sectioned + entryClassName</Card.Title>
          <Card.Body>
            <ExampleSelect
              entryClassName="bg-base-200 text-base-content"
              handleChange={() => {alert("Changed!")}}
              label="Preferred fruit or vegetable"
              labelClassName="w-60"
              name="select-sectioned-horizontal"
              options={SECTIONED_OPTIONS}
              placeholder="Choose produce"
              value=""
            />
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Vertical / Sectioned + entryClassName</Card.Title>
          <Card.Body>
            <ExampleSelect
              entryClassName="bg-base-200 text-base-content"
              handleChange={() => {alert("Changed!")}}
              label="Preferred fruit or vegetable"
              name="select-sectioned-vertical"
              options={SECTIONED_OPTIONS}
              placeholder="Choose produce"
              value=""
            />
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
type SelectOptions = ComponentProps<typeof Select>["options"];
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
  // CSS class(es) applied to rendered options and sections
  entryClassName?: string;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Extra CSS class(es) for the Select component [none]
  inputClassName?: string;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Label for this Select component [Example Select]
  label: string;
  // Label spacing CSS (implies horizontal alignment) [none]
  labelClassName?: string;
  // Name of this Select component
  name: string;
  // Options for this Select component
  options: SelectOptions;
  // Placeholder for this Select component [none]
  placeholder?: string;
  // Size of this input [md]
  size?: SelectSize;
  // Field type [text]
  type?: string;
  // Current input field value
  value: string;
}

const OPTIONS: SelectOptions = [
  { label: "First Option", value: "first" },
  { isDisabled: true, label: "Second Option", value: "second" },
  { label: "Third Option", value: "third" },
]

const SECTIONED_OPTIONS: SelectOptions = [
  { label: "No Preference", value: "none" },
  {
    id: "fruit",
    label: "Fruit",
    options: [
      { label: "Apple", value: "apple" },
      { label: "Orange", value: "orange" },
      { isDisabled: true, label: "Banana", value: "banana" },
    ],
  },
  {
    id: "vegetable",
    label: "Vegetable",
    options: [
      { label: "Broccoli", value: "broccoli" },
      { label: "Carrot", value: "carrot" },
      { label: "Spinach", value: "spinach" },
    ],
  },
]

function ExampleSelect({
                        color = "neutral",
                        disabled = false,
                        entryClassName = undefined,
                        handleChange,
                        inputClassName = undefined,
                        isInvalid = false,
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
      entryClassName={entryClassName}
      handleChange={handleChange}
      isInvalid={isInvalid}
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
