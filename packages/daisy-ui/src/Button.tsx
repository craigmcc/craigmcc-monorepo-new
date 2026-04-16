"use client";

/**
 * A button in various styles.
 */


// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import * as React from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Variant properties for this component.
 */
export const ButtonVariants = cva(
  "btn",
  {
    defaultVariants: {
      active: false,
      block: false,
      circle: false,
      color: "primary",
      dash: false,
      disabled: false,
      outline: false,
      size: "md",
      soft: false,
      square: false,
      wide: false,
    },
    variants: {
      // Present with active styling
      active: {
        false: null,
        true: "btn-active",
      },
      // Make this component full width
      block: {
        false: null,
        true: "btn-block",
      },
      // Present with a 1:1 ratio with rounded corners
      circle: {
        false: null,
        true: "btn-circle",
      },
      // Base color for this component
      color: {
        accent: "btn-accent",
        error: "btn-error",
        ghost: "btn-ghost",
        info: "btn-info",
        neutral: "btn-neutral",
        primary: "btn-primary",
        secondary: "btn-secondary",
        success: "btn-success",
        warning: "btn-warning",
      },
      // Present with dashed border instead of background color
      dash: {
        false: null,
        true: "btn-dash",
      },
      // Present with disabled styling (can also use "disabled" attribute
      // on a <button>)
      disabled: {
        false: null,
        true: "btn-disabled",
      },
      // Present with solid outline border instead of background color
      outline: {
        false: null,
        true: "btn-outline",
      },
      // Basic size of this component
      size: {
        lg: "btn-lg",
        md: "btn-md",
        sm: "btn-sm",
        xl: "btn-xl",
        xs: "btn-xs",
      },
      // Soften the color presentation if true
      soft: {
        false: null,
        true: "btn-soft",
      },
      // Present with a 1:1 ratio
      square: {
        false: null,
        true: "btn-square",
      },
      // Add more horizontal padding if true
      wide: {
        false: null,
        true: "btn-wide",
      }
    }
  }
);

export type ButtonProps = AriaButtonProps & VariantProps<typeof ButtonVariants>

/**
 * In addition to the props defined in the variants above,
 * this component accepts the additional props that a Button
 * from react-area-components accepts, such as an onPress handler.
 * See https://react-aria.adobe.com/Button for more details.
 */
export function Button({
  children,
  className,
  active,
  block,
  circle,
  color,
  dash,
  disabled,
  outline,
  size,
  soft,
  square,
  wide,
  ...props
}: ButtonProps)
{
  const variants =
    ButtonVariants({active, block, circle, color, dash, disabled, outline,
                    size, soft, square, wide, className });
  return (
    <AriaButton
      className={twMerge(clsx(variants))}
      {...props}
    >
      {children}
    </AriaButton>
  )
}
