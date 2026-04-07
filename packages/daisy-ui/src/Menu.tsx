"use client";

/**
 * A dropdown menu, triggered by an application-defined trigger.
 */

// External Modules ----------------------------------------------------------

import { clsx } from 'clsx';
import * as React from 'react';
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
//  MenuItemProps as AriaMenuItemProps,
//  MenuProps as AriaMenuProps,
//  MenuSection as AriaMenuSection,
//  MenuSectionProps as AriaMenuSectionProps,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
//  MenuTriggerProps as AriaMenuTriggerProps,
  Separator as AriaMenuSeparator,
//  SeparatorProps as AriaSeparatorProps,
//  SubmenuTrigger as AriaSubmenuTrigger,
//  SubmenuTriggerProps as AriaSubmenuTriggerProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type MenuProps = {
  // Children to be rendered (should be of type Menu.Item (or maybe submenus/separators?)).
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

const ITEM_BASE_CLASSES = "rounded-field px-3 py-2";
const MENU_BASE_CLASSES = "w-52 flex flex-col flex-nowrap p-1";
const OVERFLOW_CLASSES: Record<NonNullable<MenuProps["overflow"]>, string> = {
  auto: "max-h-80 overflow-auto",
  hidden: "overflow-hidden",
  scroll: "max-h-80 overflow-scroll",
  visible: "overflow-visible",
};
const POPOVER_BASE_CLASSES = "z-50 mt-2 rounded-box border border-base-300 bg-base-100 p-1 shadow-lg";

export function Menu({ children, maxHeightClassName, menuClassName, overflow, popoverClassName, trigger,  }: MenuProps) {
  let overflowClasses = overflow ? OVERFLOW_CLASSES[overflow] : undefined;
  // If maxHeightClassName is provided, strip max-h-* from overflow classes and apply custom height
  if (maxHeightClassName && overflowClasses) {
    overflowClasses = overflowClasses.replace(/max-h-\d+/, "").trim();
  }

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

type ItemProps = {
  // Children that represent this Item
  children: React.ReactNode;
  // CSS classes to append for this Item
  className?: string;
  // Action to call when this item is selected
  onAction?: () => void;
}

function Item({ children, className, onAction }: ItemProps) {
  useMenuContext();
  return (
    <AriaMenuItem
      className={twMerge(clsx(ITEM_BASE_CLASSES, className))}
      onAction={onAction}
    >
      {children}
    </AriaMenuItem>
  )
}

Menu.Item = Item;

function Separator() {
  return (
    <AriaMenuSeparator/>
  )
}

Menu.Separator = Separator;

// TODO: Support submenus?

const MenuContext = React.createContext<Record<string, never> | undefined>(undefined);

function useMenuContext() {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error("Menu child components must be wrapped in <Menu/>");
  }
}

