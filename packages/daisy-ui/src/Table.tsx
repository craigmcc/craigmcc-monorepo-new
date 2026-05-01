"use client";

/**
 * A table with Daisy styling, and nested components for the various parts.
 */

// External Modules ----------------------------------------------------------

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from 'clsx';
import * as React from 'react';
import { twMerge } from "tailwind-merge";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Variant properties for this component.
 */
export const TableVariants = cva(
  "table",
  {
    defaultVariants: {
      border: false,
      pinCols: false,
      pinRows: false,
      size: "md",
      zebra: false,
    },
    variants: {
      // Present with a solid border
      border: {
        false: null,
        true: "border-4 rounded-md",
      },
      // Make all <th> (i.e. Table.Head) columns sticky.
      pinCols: {
        false: null,
        true: "table-pin-cols",
      },
      // Make all rows inside <thead>/<tfoot> (i.e. Table.Header/Table.Footer) sticky.
      pinRows: {
        false: null,
        true: "table-pin-rows",
      },
      // Basic size of this component
      size: {
        lg: "table-lg",
        md: "table-md",
        sm: "table-sm",
        xl: "table-xl",
        xs: "table-xs",
      },
      // Present with zebra striping (alternate rows shaded)
      zebra: {
        false: null,
        true: "table-zebra",
      },
    },
  }
)

type TableExtraProps = {
  // Children to be rendered (should be of a Table child component type)
  children: React.ReactNode;
}

type TableNativeProps = Omit<
  React.ComponentPropsWithoutRef<"table">,
  | "border"
>;

export type TableProps =
  TableExtraProps &
  TableNativeProps &
  VariantProps<typeof TableVariants>;

export function Table({
  children,
  className,
  border,
  pinCols,
  pinRows,
  size,
  zebra,
  ...props
}: TableProps) {

  const variants =
    TableVariants({ border, pinCols, pinRows, size, zebra });

  return (
    <TableContext.Provider value={{}}>
      <table
        className={twMerge(clsx(variants, className))}
        {...props}
      >
        {children}
      </table>
    </TableContext.Provider>
  )

}

// Private Objects -----------------------------------------------------------

// Render a <tbody> element and its children
function Body({ children, className }: RowProps) {
  useTableContext();
  return (
    <tbody className={twMerge(clsx(null, className))}>
      {children}
    </tbody>
  )
}

Table.Body = Body;

type FooterProps = {
  // Children for this component
  children: React.ReactNode;
  // CSS classes to append for this element
  className?: string;
}

// Render a <tfoot> element and its children
function Footer({ children, className }: FooterProps) {
  useTableContext();
  return (
    <tfoot className={twMerge(clsx(null, className))}>
      {children}
    </tfoot>
  )
}

Table.Footer = Footer;

type DataProps = {
  // Children for this component
  children: React.ReactNode;
  // CSS classes to append for this element
  className?: string;
  // Number of columns this data spans [1]
  colSpan?: number;
}

// Render a <td> element and its children
function Data({ children, className, colSpan }: DataProps) {
  useTableContext();
  return (
    <td className={twMerge(clsx(null, className))} colSpan={colSpan}>
    {children}
    </td>
  )
}

Table.Data = Data;

type HeadProps = {
  // Children for this component
  children: React.ReactNode;
  // CSS classes to append for this element
  className?: string;
  // Number of columns this header spans [1]
  colSpan?: number;
}

// Render a <th> element and its children
function Head({ children, className, colSpan }: HeadProps) {
  useTableContext();
  return (
    <th className={twMerge(clsx(null, className))} colSpan={colSpan}>
      {children}
    </th>
  )
}

Table.Head = Head;

// Render a <thead> element and its children
type HeaderProps = {
  // Children for this component
  children: React.ReactNode;
  // CSS classes to append for this element
  className?: string;
}

function Header({ children, className }: HeaderProps) {
  useTableContext();
  return (
    <thead className={twMerge(clsx(null, className))}>
    {children}
    </thead>
  )
}

Table.Header = Header;

type RowProps = {
  // Children for this component
  children: React.ReactNode;
  // CSS classes to append for this element
  className?: string;
}

// Render a <tr> element and its children
function Row({ children, className }: RowProps) {
  useTableContext();
  return (
    <tr className={twMerge(clsx(null, className))}>
      {children}
    </tr>
  )
}

Table.Row = Row;

const TableContext = React.createContext<Record<string, never> | undefined>(undefined);

function useTableContext() {
  const context = React.useContext(TableContext);
  if (!context) {
    throw new Error("Table child components must be wrapped in <Table/>");
  }
}

