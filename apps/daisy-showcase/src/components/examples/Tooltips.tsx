"use client";

/**
 * Examples of DaisyUI Tooltip component.
 */

// External Modules ----------------------------------------------------------

import { Tooltip } from "@repo/daisy-ui/Tooltip";
import type { ComponentProps } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function Tooltips() {
  return (
    <table className="table table-zebra border rounded-md w-full">
      <thead>
        <tr>
          <th>Options</th>
          <th className="text-center">Tooltips</th>
          <th>Options</th>
          <th className="text-center">Tooltips</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Color</td>
          <td>
            <div className="flex flex-wrap gap-2 justify-center">
              {COLORS.map((color) => (
                <Tooltip color={color} key={color} tip={`Tooltip color: ${color}`}>
                  <span className="badge badge-outline">{color}</span>
                </Tooltip>
              ))}
            </div>
          </td>
          <td>Side</td>
          <td>
            <div className="flex flex-wrap gap-2 justify-center">
              {SIDES.map((side) => (
                <Tooltip key={side} side={side} tip={`Tooltip side: ${side}`}>
                  <span className="badge badge-outline">{side}</span>
                </Tooltip>
              ))}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// Private Objects -----------------------------------------------------------

type TooltipColor = NonNullable<ComponentProps<typeof Tooltip>["color"]>;
const COLORS = [
  "accent",
  "error",
  "info",
  "neutral",
  "primary",
  "secondary",
  "success",
  "warning",
] as const satisfies readonly TooltipColor[];

type TooltipSide = NonNullable<ComponentProps<typeof Tooltip>["side"]>;
const SIDES = ["top", "bottom", "left", "right"] as const satisfies readonly TooltipSide[];

