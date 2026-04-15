"use client";

/**
 * A dropdown menu, triggered by an application-defined trigger.
 */

// External Modules ----------------------------------------------------------

import { clsx } from 'clsx';
import { ChevronRight } from "lucide-react";
import * as React from 'react';
import {
  Header,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  Separator as AriaMenuSeparator,
  SubmenuTrigger as AriaSubmenuTrigger,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type MenuProps = {
  // Children to be rendered (should be of type Menu.Item, Menu.Section, or Menu.Separator).
  children: React.ReactNode;
  // Optional classes to customize max height (used with overflow: auto/scroll)
  maxHeightClassName?: string;
  // Optional classes to append to the menu list
  menuClassName?: string;
  // Optional overflow behavior for long menus
  overflow?: "visible" | "hidden" | "auto" | "scroll";
  // Optional classes to append to the popover wrapper
  popoverClassName?: string;
  // The trigger to open/close this menu
  trigger: React.ReactElement,
}

const ITEM_BASE_CLASSES = [
  "rounded-field cursor-default px-3 py-2 outline-none",
  "data-[focused=true]:bg-base-200",
  "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
].join(" ");
const MENU_BASE_CLASSES = "w-52 flex flex-col flex-nowrap p-1 outline-none";
const OVERFLOW_CLASSES: Record<NonNullable<MenuProps["overflow"]>, string> = {
  auto: "max-h-80 overflow-auto",
  hidden: "overflow-hidden",
  scroll: "max-h-80 overflow-scroll",
  visible: "overflow-visible",
};
const POPOVER_BASE_CLASSES = "z-50 mt-2 rounded-box border border-base-300 bg-base-100 p-1 shadow-lg";
const SECTION_BASE_CLASSES = "flex flex-col gap-1 py-1";
const SECTION_HEADING_BASE_CLASSES =
  "px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-base-content/60";
const SEPARATOR_BASE_CLASSES = "my-1 border-t border-base-300";
const SUBMENU_CHEVRON_BASE_CLASSES = "ml-3 size-4 opacity-70";
const SUBMENU_TRIGGER_BASE_CLASSES = [
  ITEM_BASE_CLASSES,
  "flex items-center justify-between",
  "data-[open=true]:bg-base-200",
].join(" ");

export function Menu({ children, maxHeightClassName, menuClassName, overflow, popoverClassName, trigger,  }: MenuProps) {
  const overflowClasses = resolveOverflowClasses(overflow, maxHeightClassName);

  return (
    <MenuContext.Provider value={{}}>
      <AriaMenuTrigger trigger="press">
        {trigger}
        {/* React Aria requires the collection to be rendered inside a Popover/Tray. */}
        <AriaPopover className={twMerge(clsx(POPOVER_BASE_CLASSES, popoverClassName))}>
          <AriaMenu className={twMerge(clsx(MENU_BASE_CLASSES, overflowClasses, maxHeightClassName, menuClassName))}>
            {children}
          </AriaMenu>
        </AriaPopover>
      </AriaMenuTrigger>
    </MenuContext.Provider>
  )
}

// Private Objects -----------------------------------------------------------

type ItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof AriaMenuItem>,
  | "children"
  | "className"
> & {
  // Children that represent this Item
  children: React.ReactNode;
  // CSS classes to append for this Item
  className?: string;
};

function Item({ children, className, ...props }: ItemProps) {
  useMenuContext();
  return (
    <AriaMenuItem
      className={twMerge(clsx(ITEM_BASE_CLASSES, className))}
      {...props}
    >
      {children}
    </AriaMenuItem>
  )
}

Menu.Item = Item;

type SectionProps = Omit<
  React.ComponentPropsWithoutRef<typeof AriaMenuSection>,
  | "children"
  | "className"
  | "title"
> & {
  // Children that represent this Section
  children: React.ReactNode;
  // CSS classes to append for this Section
  className?: string;
  // Heading content displayed for this Section
  heading: React.ReactNode;
  // CSS classes to append for this Section heading
  headingClassName?: string;
};

function Section({ children, className, heading, headingClassName, ...props }: SectionProps) {
  useMenuContext();
  return (
    <AriaMenuSection
      className={twMerge(clsx(SECTION_BASE_CLASSES, className))}
      {...props}
    >
      <Header className={twMerge(clsx(SECTION_HEADING_BASE_CLASSES, headingClassName))}>
        {heading}
      </Header>
      {children}
    </AriaMenuSection>
  )
}

Menu.Section = Section;

type SeparatorProps = Omit<
  React.ComponentPropsWithoutRef<typeof AriaMenuSeparator>,
  "className"
> & {
  // CSS classes to append for this Separator
  className?: string;
};

function Separator({ className, ...props }: SeparatorProps) {
  useMenuContext();
  return (
    <AriaMenuSeparator
      className={twMerge(clsx(SEPARATOR_BASE_CLASSES, className))}
      {...props}
    />
  )
}

Menu.Separator = Separator;

type SubmenuProps = {
  // Children rendered in this submenu
  children: React.ReactNode;
  // CSS classes to append to the trigger item row
  className?: string;
  // Should this submenu be disabled?
  isDisabled?: boolean;
  // Label content displayed in this submenu trigger
  label: React.ReactNode;
  // Optional classes to customize submenu max height
  maxHeightClassName?: string;
  // Optional classes to append to the submenu list
  menuClassName?: string;
  // Optional overflow behavior for long submenu lists
  overflow?: MenuProps["overflow"];
  // Optional classes to append to the submenu popover wrapper
  popoverClassName?: string;
  // Plain-text value for type-ahead search on the submenu trigger
  textValue?: string;
};

function Submenu({
  children,
  className,
  isDisabled,
  label,
  maxHeightClassName,
  menuClassName,
  overflow,
  popoverClassName,
  textValue,
}: SubmenuProps) {
  useMenuContext();

  const overflowClasses = resolveOverflowClasses(overflow, maxHeightClassName);

  return (
    <AriaSubmenuTrigger>
      <AriaMenuItem
        className={twMerge(clsx(SUBMENU_TRIGGER_BASE_CLASSES, className))}
        isDisabled={isDisabled}
        textValue={textValue}
      >
        <span>{label}</span>
        <ChevronRight aria-hidden="true" className={SUBMENU_CHEVRON_BASE_CLASSES} />
      </AriaMenuItem>
      <AriaPopover className={twMerge(clsx(POPOVER_BASE_CLASSES, popoverClassName))}>
        <AriaMenu className={twMerge(clsx(MENU_BASE_CLASSES, overflowClasses, maxHeightClassName, menuClassName))}>
          {children}
        </AriaMenu>
      </AriaPopover>
    </AriaSubmenuTrigger>
  )
}

Menu.Submenu = Submenu;

const MenuContext = React.createContext<Record<string, never> | undefined>(undefined);

function useMenuContext() {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error("Menu child components must be wrapped in <Menu/>");
  }
}

function resolveOverflowClasses(overflow?: MenuProps["overflow"], maxHeightClassName?: string) {
  let overflowClasses = overflow ? OVERFLOW_CLASSES[overflow] : undefined;
  // If maxHeightClassName is provided, strip max-h-* from overflow classes and apply custom height
  if (maxHeightClassName && overflowClasses) {
    overflowClasses = overflowClasses.replace(/max-h-\d+/, "").trim();
  }
  return overflowClasses;
}

