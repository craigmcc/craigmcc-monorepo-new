/**
 * A navigation bar with start/center/end parts.
 */

// External Modules ----------------------------------------------------------

import { clsx } from "clsx";
import * as React from "react";
import { twMerge } from "tailwind-merge";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type NavbarProps = {
  // Children to be rendered (should be Navbar.Start, Navbar.Middle, Navbar.End)
  children: React.ReactNode;
  // Optional classes to append to this div
  className?: string;
}

const NAVBAR_BASE_CLASSES = "navbar bg-base-200 p-0";

export function Navbar({ children, className }: NavbarProps) {
  return (
    <NavbarContext.Provider value={{}}>
    <div className={twMerge(clsx(NAVBAR_BASE_CLASSES, className))}>
      {children}
    </div>
    </NavbarContext.Provider>
  )
}

// Private Objects -----------------------------------------------------------

type CenterProps = {
  // Children to be rendered in the center section of the navbar
  children: React.ReactNode;
  // Optional classes to append to this div
  className?: string;
}

const CENTER_BASE_CLASSES = "navbar-center";

function Center({ children, className }: CenterProps) {
  useNavbarContext();
  return (
    <div className={twMerge(clsx(CENTER_BASE_CLASSES, className))}>
      {children}
    </div>
  )
}

Navbar.Center = Center;

type EndProps = {
  // Children to be rendered in the end section of the navbar
  children: React.ReactNode;
  // Optional classes to append to this div
  className?: string;
}

const END_BASE_CLASSES = "navbar-end";

function End({ children, className }: EndProps) {
  useNavbarContext();
  return (
    <div className={twMerge(clsx(END_BASE_CLASSES, className))}>
      {children}
    </div>
  )
}

Navbar.End = End;

type StartProps = {
  // Children to be rendered in the start section of the navbar
  children: React.ReactNode;
  // Optional classes to append to this div
  className?: string;
}

const START_BASE_CLASSES = "navbar-start";

function Start({ children, className }: StartProps) {
  useNavbarContext();
  return (
    <div className={twMerge(clsx(START_BASE_CLASSES, className))}>
      {children}
    </div>
  )
}

Navbar.Start = Start;

const NavbarContext = React.createContext<Record<string, never> | undefined>(undefined);

function useNavbarContext()  {
  const context = React.useContext(NavbarContext);
  if (!context) {
    throw new Error(
      "Navbar child components must be wrapped in <Navbar/>"
    );
  }
}
