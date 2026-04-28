"use client";

/**
 * A tooltip that can wrap an arbitrary content, and be surfaced
 * when the content is hovered over.
 */

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";


// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Variant properties for this component.
 */
export const TooltipVariants = cva(
  "tooltip",
  {
    defaultVariants: {
      color: "neutral",
      side: "top",
    },
    variants: {
      // Base (background  and foreground) color for this component
      color: {
        accent: "tooltip-accent",
        error: "tooltip-error",
        info: "tooltip-info",
        neutral: "tooltip-neutral",
        primary: "tooltip-primary",
        secondary: "tooltip-secondary",
        success: "tooltip-success",
        warning: "tooltip-warning",
      },
      // Side of the enclosed content the tooltip should be displayed on
      side: {
        bottom: "tooltip-bottom",
        left: "tooltip-left",
        right: "tooltip-right",
        top: "tooltip-top",
      }
    }
  }
)

export type TooltipExtraProps = {
  // Optional CSS classes for this tooltip.
  className?: string;
  // The content to display in the tooltip when it is open.
  tip: string;
}

type TooltipProps = React.HTMLAttributes<HTMLSpanElement>
  & TooltipExtraProps
  & VariantProps<typeof TooltipVariants> & {
}

export function Tooltip({
  children,
  className,
  color,
  side,
  tip,
  ...props
}: TooltipProps) {

  const tooltipVariants =
    TooltipVariants({color, side});

  return (
    <span
      className={twMerge(clsx(tooltipVariants, className, ))}
      data-tip={tip}
      {...props}
    >
      {children}
    </span>
  )

}
