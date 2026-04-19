"use client";

/**
 * A modal dialog that overlays part of the underlying browser window or tab.
 */

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { X } from "lucide-react";
import * as React from "react";
import { twMerge } from "tailwind-merge";

// Internal Modules ----------------------------------------------------------

import { Button, ButtonProps } from "./Button";

// Public Objects ------------------------------------------------------------

/**
 * Variant properties for this component.
 */
export const ModalVariants = cva(
  "", // TODO - base styles
  {
    defaultVariants: {
        border: false,
        color: "base200",
        dash: false,
    },
    variants: {
      // Present with a solid border
      border: {
        false: null,
        true: "border border-2"
      },
      // Base (background  and foreground) color for this component
      color: {
        accent: "bg-accent text-accent-content",
        base100: "bg-base-100 text-base-content",
        base200: "bg-base-200 text-base-content",
        base300: "bg-base-300 text-base-content",
        error: "bg-error text-error-content",
        info: "bg-info text-info-content",
        neutral: "bg-neutral text-neutral-content",
        primary: "bg-primary text-primary-content",
        secondary: "bg-secondary text-secondary-content",
        success: "bg-success text-success-content",
        warning: "bg-warning text-warning-content",
      },
      // Present with dashed border
      dash: {
        false: null,
        true: "border-2 border-dashed",
      },

    }
  }
)

/**
 * Extra properties for the dialog element itself.
 */
type ModalExtraProps = {
  // Extra CSS class(es) for the rendered dialog element
  className?: string;
  // Unique id of this dialog (required for trigger)
  id: string;
}

export type ModalProps = {
} & VariantProps<typeof ModalVariants>
  & ModalExtraProps
  & React.ComponentPropsWithoutRef<"dialog">;

/**
 * The modal component itself.
 */
export function Modal(
{
  children,
  className,
  border,
  color,
  id,
  dash,
  ...props
}: ModalProps) {

  const variants =
    ModalVariants({border, color, dash});

  return (
    <ModalContext.Provider value={{}}>
      <dialog
        aria-labelledby={id}
        aria-describedby={id}
        id={id}
        className={twMerge(clsx(variants, className))}
        {...props}
      >
        {children}
        {/* Allow a click outside the modal to close it */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </ModalContext.Provider>
  )

}

/**
 * Properties for the trigger that can cause the modal element to be rendered.
 */
export type ModalTriggerExtraProps = {
  // ID of the modal element that will be opened (much match the id of the modal)
  id: string;
  // Label for the Modal trigger [Open]
  label?: string | React.ReactNode;
}

export type ModalTriggerProps = ModalTriggerExtraProps & ButtonProps;

/**
 * The trigger that can cause the modal element to be rendered.
 * This must NOT be inside the Modal component.
 */
export function ModalTrigger({
  id,
  label = "Open",
  ...props
}: ModalTriggerProps)  {

  return (
    <Button
      onPress={() => `document.getElementById("${id}").showModal()`}
      {...props}
    >
      {label}
    </Button>
  )

}

// Private Objects -----------------------------------------------------------

type BodyExtraProps = {
  // Optional CSS to add to the body
  className?: string;
}

type BodyProps = BodyExtraProps & React.ComponentPropsWithoutRef<"div">;

function Body({ children, className, ...props }: BodyProps) {
  useModalContext();
  return (
    <div className={twMerge(clsx("modal-body", className))} {...props}>
      {children}
    </div>
  )
}

Modal.Body = Body;

type CloserExtraProps = {
  // Optional CSS to add to the closer
  className?: string;
}

type CloserProps = CloserExtraProps & ButtonProps;

/**
 * Renders a close button at the right edge of a Modal.  This will typically be
 * rendered first to put the button in the upper right corner.
 */
function Closer({className, ...props}: CloserProps) {
  useModalContext();
  return (
    <div className="modal-action">
      <form method="dialog">
        <Button
          circle
          className={twMerge(clsx("justify-end"), className)}
          color="ghost"
          size="sm"
          {...props}
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

Modal.Closer = Closer;

const ModalContext = React.createContext<Record<string, never> | undefined>(undefined);

function useModalContext() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("Card child components must be wrapped in <Modal/>");
  }
}
