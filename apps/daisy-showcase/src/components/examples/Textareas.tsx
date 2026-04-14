"use client";

/**
 * Examples of DaisyUI+ReactAria Textarea component.
 */

// External Modules ----------------------------------------------------------

import { Card } from "@repo/daisy-ui/Card";
import { Textarea } from "@repo/daisy-ui/Textarea";
import type { ComponentProps } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function Textareas() {
  return (
    <>
      <div className="grid w-full grid-cols-2 gap-2">
        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal Orientation</Card.Title>
          <Card.Body>
            {COLORS.map((color) => (
              <ExampleTextarea
                color={color}
                handleChange={() => {
                  alert("Changed!");
                }}
                label={`Textarea with color: ${color}`}
                labelClassName="w-60"
                name={`textarea-{color}`}
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
              <ExampleTextarea
                color={color}
                handleChange={() => {
                  alert("Changed!");
                }}
                label={`Textarea with color: ${color}`}
                name={`textarea-{color}`}
                placeholder={`${color} placeholder`}
                value=""
                key={color}
              />
            ))}
          </Card.Body>
        </Card>
      </div>

      <hr className="my-4" />

      <div className="grid w-full grid-cols-2 gap-2">
        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal Orientation</Card.Title>
          <Card.Body>
            {SIZES.map((size) => (
              <ExampleTextarea
                handleChange={() => {
                  alert("Changed!");
                }}
                label={`Textarea with size: ${size}`}
                labelClassName="w-60"
                name={`textarea-{size}`}
                placeholder={`${size} placeholder`}
                size={size}
                value=""
                key={size}
              />
            ))}
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Rows</Card.Title>
          <Card.Body>
            {ROWS.map((rows) => (
              <ExampleTextarea
                handleChange={() => {
                  alert("Changed!");
                }}
                label={`Textarea with rows: ${rows}`}
                name={`textarea-{rows}`}
                placeholder={`${rows} rows`}
                rows={rows}
                value=""
                key={rows}
              />
            ))}
          </Card.Body>
        </Card>
      </div>

      <hr className="my-4" />

      <div className="grid w-full grid-cols-2 gap-2">
        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal / Disabled</Card.Title>
          <Card.Body>
            <ExampleTextarea
              disabled={true}
              handleChange={() => { alert("Changed!"); }}
              label="Disabled Textarea"
              labelClassName="w-60"
              name="textarea-disabled-horizontal"
              placeholder="disabled placeholder"
              value=""
            />
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Vertical / Disabled</Card.Title>
          <Card.Body>
            <ExampleTextarea
              disabled={true}
              handleChange={() => { alert("Changed!"); }}
              label="Disabled Textarea"
              name="textarea-disabled-vertical"
              placeholder="disabled placeholder"
              value=""
            />
          </Card.Body>
        </Card>
      </div>

      <hr className="my-4" />

      <div className="grid w-full grid-cols-2 gap-2">
        <Card className="w-full">
          <Card.Title className="justify-center">Horizontal / Invalid</Card.Title>
          <Card.Body>
            <ExampleTextarea
              handleChange={() => { alert("Changed!"); }}
              isInvalid={true}
              label="Invalid Textarea"
              labelClassName="w-60"
              name="textarea-invalid-horizontal"
              placeholder="invalid placeholder"
              value="bad value"
            />
          </Card.Body>
        </Card>

        <Card className="w-full">
          <Card.Title className="justify-center">Vertical / Invalid</Card.Title>
          <Card.Body>
            <ExampleTextarea
              handleChange={() => { alert("Changed!"); }}
              isInvalid={true}
              label="Invalid Textarea"
              name="textarea-invalid-vertical"
              placeholder="invalid placeholder"
              value="bad value"
            />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

// Private Objects -----------------------------------------------------------

type TextareaColor = NonNullable<ComponentProps<typeof Textarea>["color"]>;
const COLORS = [
  "accent",
  "error",
  "info",
  "neutral",
  "primary",
  "secondary",
  "success",
  "warning",
] as const satisfies readonly TextareaColor[];

type TextareaSize = NonNullable<ComponentProps<typeof Textarea>["size"]>;
const SIZES = ["lg", "md", "sm", "xl", "xs"] as const satisfies readonly TextareaSize[];

const ROWS = [2, 3, 5] as const;

type ExampleTextareaProps = {
  // Base color for this textarea [neutral]
  color?: TextareaColor;
  // Present with disabled styling and behavior
  disabled?: boolean;
  // Handler for value change events
  handleChange: (newValue: string) => void;
  // Extra CSS class(es) for the Textarea component [none]
  textareaClassName?: string;
  // Is the current value invalid?
  isInvalid?: boolean;
  // Label for this Textarea component [Example Textarea]
  label: string;
  // Label spacing CSS (implies horizontal alignment) [none]
  labelClassName?: string;
  // Name of this Textarea component
  name: string;
  // Placeholder for this Textarea component [none]
  placeholder?: string;
  // Number of rows for this textarea [3]
  rows?: number;
  // Size of this textarea [md]
  size?: TextareaSize;
  // Current textarea field value
  value: string;
};

function ExampleTextarea({
  color = "neutral",
  disabled = false,
  handleChange,
  textareaClassName = undefined,
  isInvalid = false,
  label,
  labelClassName = undefined,
  name,
  placeholder = undefined,
  rows = 3,
  size = "md",
  value,
}: ExampleTextareaProps) {
  return (
    <Textarea
      className={textareaClassName || undefined}
      color={color}
      disabled={disabled}
      handleChange={handleChange}
      isInvalid={isInvalid}
      label={label}
      labelClassName={labelClassName}
      name={name}
      placeholder={placeholder}
      rows={rows}
      size={size}
      value={value}
    />
  );
}

