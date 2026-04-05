"use client";

/**
 * Examples of DaisyUI+ReactAria Button component.
 */

// External Modules ----------------------------------------------------------

import { Button } from "@repo/daisy-ui/Button";
import type { ComponentProps } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function Buttons() {
  return (
    <table className={"table table-zebra border-1 rounded-md w-full"}>
      <thead>
      <tr>
        <th>Options</th>
        <th className="text-center">Buttons</th>
        <th>Options</th>
        <th className="text-center">Buttons</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Default</td>
        <td>
          <div className="flex flex-wrap gap-1 justify-center">
          {COLORS.map((color) => (
            <Button color={color} key={color}>{color}</Button>
          ))}
          </div>
        </td>
        <td>Outline</td>
        <td>
          <div className="flex flex-wrap gap-1 justify-center">
          {COLORS.map((color) => (
            <Button color={color} key={color} outline>{color}</Button>
          ))}
          </div>
        </td>
      </tr>
      <tr>
        <td>Active</td>
        <td>
          <div className="flex flex-wrap gap-1 justify-center">
          {COLORS.map((color) => (
            <Button active color={color} key={color}>{color}</Button>
          ))}
          </div>
        </td>
        <td>Size</td>
        <td>
          <div className="flex flex-wrap gap-1 justify-center">
          {SIZES.map((size) => (
            <Button key={size} size={size}>{size}</Button>
          ))}
          </div>
        </td>
      </tr>
      <tr>
        <td>Circle</td>
        <td>
          <div className="flex flex-wrap gap-1 justify-center">
          {COLORS.map((color) => (
            <Button circle color={color} key={color}>{color}</Button>
          ))}
          </div>
        </td>
        <td>Soft</td>
        <td>
          <div className="flex flex-wrap gap-1 justify-center">
          {COLORS.map((color) => (
            <Button color={color} key={color} soft>{color}</Button>
          ))}
          </div>
        </td>
      </tr>
      <tr>
        <td>Dash</td>
        <td>
          <div className="flex flex-wrap gap-1 justify-center">
          {COLORS.map((color) => (
            <Button color={color} dash key={color}>{color}</Button>
          ))}
          </div>
        </td>
        <td>Square</td>
        <td>
          <div className="flex flex-wrap gap-1 justify-center">
          {COLORS.map((color) => (
            <Button color={color} key={color} square>{color}</Button>
          ))}
          </div>
        </td>
      </tr>
      <tr>
        <td>Disabled</td>
        <td>
          <div className="flex flex-wrap gap-1 justify-center">
          {COLORS.map((color) => (
            <Button color={color} disabled key={color}>{color}</Button>
          ))}
          </div>
        </td>
        <td>Wide</td>
        <td>
          <div className="flex flex-wrap gap-1 justify-center">
          {COLORS.map((color) => (
            <Button color={color} key={color} wide>{color}</Button>
          ))}
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  )

}

// Private Objects -----------------------------------------------------------

type ButtonColor = NonNullable<ComponentProps<typeof Button>["color"]>;
const COLORS = [
  "accent",
  "error",
  "info",
  "neutral",
  "primary",
  "secondary",
  "success",
  "warning"
] as const satisfies readonly ButtonColor[];

type ButtonSize = NonNullable<ComponentProps<typeof Button>["size"]>;
const SIZES = [
  "xl",
  "lg",
  "md",
  "sm",
  "xs",
] as const satisfies readonly ButtonSize[];

