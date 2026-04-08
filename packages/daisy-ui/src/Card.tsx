"use client";

/**
 * A card in various styles.
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
export const CardVariants = cva(
  "card",
  {
    defaultVariants: {
      border: false,
      color: "base300",
      dash: false,
      size: "md",
    },
    variants: {
      // Present with a solid border
      border: {
        false: null,
        true: "card-border",
      },
      // Base (background  and foreground) color for this component
      color: {
        accent: "bg-accent text-accent-content",
        base100: "bg-base-100 text-base-content",
        base200: "bg-base-200 text-base-content",
        base300: "bg-base-300 text-base-content",
        error: "bg-error text-error-content",
        info: "bg-info text-info-content",
        neutral: "bg-neutral text-neutral-cotent",
        primary: "bg-primary text-primary-content",
        secondary: "bg-secondary text-secondary-content",
        success: "bg-success text-success-content",
        warning: "bg-warning text-warning-content",
      },
      // Present with dashed border
      dash: {
        false: null,
        true: "card-dash",
      },
      // Basic size of this component
      size: {
        lg: "card-lg",
        md: "card-md",
        sm: "card-sm",
        xl: "card-xl",
        xs: "card-xs",
      },

    }
  }
)

const ACTIONS_BASE_CLASSES = "card-actions justify-end";
const BODY_BASE_CLASSES = "card-body";
const TITLE_BASE_CLASSES = "card-title";

export function Card({
                       children,
                       className,
                       border,
                       color,
                       dash,
                       size,
                       ...props
                     }: VariantProps<typeof CardVariants>
  & React.ComponentPropsWithoutRef<"div">) {

  const variants =
    CardVariants({border, color, dash, size, className});

  return (
    <CardContext.Provider value={{}}>
      <div
        className={twMerge(clsx(variants))}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  )

}

// Private Objects -----------------------------------------------------------

type ActionsProps = {
  // Actions for the footer of this Card
  children: React.ReactNode;
  // CSS classes to append for this Actions
  className?: string;
}

function Actions({ children, className }: ActionsProps) {
  useCardContext();
  return (
    <div className={twMerge(clsx(ACTIONS_BASE_CLASSES, className))}>
      {children}
    </div>
  )
}

Card.Actions = Actions;

type BodyProps = {
  // Children that body that wll be rendered, plus optionally Title and Actions
  children: React.ReactNode;
  // CSS classes to append for this Body
  className?: string;
}

function Body({ children, className }: BodyProps) {
  useCardContext();
  return (
    <div className={twMerge(clsx(BODY_BASE_CLASSES, className))}>
      {children}
    </div>
  )
}

Card.Body = Body;

type TitleProps = {
  // Children that make up the title for this Card
  children: React.ReactNode;
  // CSS classes to append for this Title
  className?: string;
}

function Title({ children, className }: TitleProps) {
  useCardContext();
  return (
    <div className={twMerge(clsx(TITLE_BASE_CLASSES, className))}>
      {children}
    </div>
  )
}

Card.Title = Title;

const CardContext = React.createContext<Record<string, never> | undefined>(undefined);

function useCardContext() {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error("Card child components must be wrapped in <Card/>");
  }
}

