"use client";

/**
 * Top-level menu bar component for the daisyui-alone application.
 */

// External Imports ----------------------------------------------------------

import { Button } from "@repo/daisy-ui/Button";
import { Navbar } from "@repo/daisy-ui/Navbar";
import { Flower2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
//import { useEffect } from "react";

// Internal Imports ----------------------------------------------------------

import { ThemeChanger } from "@/components/layout/ThemeChanger";
//import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { useCurrentProfileContext } from "@/contexts/CurrentProfileContext";

// Public Objects ------------------------------------------------------------

export function NavBar() {

  const { currentProfile } = useCurrentProfileContext();

/*
  useEffect(() => {
    // Trigger a re-render when the current profile changes
  }, [currentProfile]);
*/

  return (
    <Navbar>

      <Navbar.Start>
        <Link href="/">
          <Button color="ghost">
            <Flower2 className="navbar-logo" size={32} />
            <span className="font-semibold px-2">daisyui-showcase</span>
          </Button>
        </Link>
      </Navbar.Start>

      <Navbar.Center className="gap-2">
        <NavLinkButton href="/buttons">Buttons</NavLinkButton>
        <NavLinkButton href="/cards">Cards</NavLinkButton>
        <NavLinkButton href="/checkboxes">Checkboxes</NavLinkButton>
        <NavLinkButton href="/forms">Forms</NavLinkButton>
        <NavLinkButton href="/inputs">Inputs</NavLinkButton>
        <NavLinkButton href="/menus">Menus</NavLinkButton>
        <NavLinkButton href="/selects">Selects</NavLinkButton>
        <NavLinkButton href="/tables">Tables</NavLinkButton>
        <NavLinkButton href="/textareas">Textareas</NavLinkButton>
      </Navbar.Center>

      <Navbar.End>
        {currentProfile && (
          <span className="text-secondary p-2">{currentProfile.email}</span>
        )}
        <ThemeChanger />
        {/*<ThemeSwitcher />*/}
      </Navbar.End>

    </Navbar>
  )

}

// Private Objects -----------------------------------------------------------

type NavLinkButtonProps = {
  children: React.ReactNode;
  exact?: boolean;
  href: string;
}

function NavLinkButton({ children, exact = false, href }: NavLinkButtonProps) {
  const pathname = usePathname();
  const isActive = isActivePath(pathname ?? "/", href, exact);

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      href={href}
    >
      <Button
        active={isActive}
        color="primary"
        outline={!isActive}
      >
        {children}
      </Button>
    </Link>
  );
}

function isActivePath(pathname: string, href: string, exact: boolean) {
  const currentPath = normalizePath(pathname);
  const targetPath = normalizePath(href);

  if (targetPath === "/") {
    return currentPath === "/";
  }

  if (exact) {
    return currentPath === targetPath;
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

function normalizePath(path: string) {
  if (path !== "/" && path.endsWith("/")) {
    return path.replace(/\/+$/, "");
  }
  return path;
}

