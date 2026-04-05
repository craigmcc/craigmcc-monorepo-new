"use client";

/**
 * Top-level menu bar component for the daisyui-alone application.
 */

// External Imports ----------------------------------------------------------

import { Button } from "@repo/daisy-ui/Button";
import { Navbar } from "@repo/daisy-ui/Navbar";
import { Flower2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

// Internal Imports ----------------------------------------------------------

import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { useCurrentProfileContext } from "@/contexts/CurrentProfileContext";

// Public Objects ------------------------------------------------------------

export function NavBar() {

  const { currentProfile } = useCurrentProfileContext();

  useEffect(() => {
    // Trigger a re-render when the current profile changes
  }, [currentProfile]);

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
        <Link href="/buttons">
          <Button color="primary">Buttons</Button>
        </Link>
        <Link href="/cards">
          <Button color="primary">Cards</Button>
        </Link>
        <Link href="/forms">
          <Button color="primary">Forms</Button>
        </Link>
        <Link href="/inputs">
          <Button color="primary">Inputs</Button>
        </Link>
        <Link href="/tables">
          <Button color="primary">Tables</Button>
        </Link>
      </Navbar.Center>

      <Navbar.End>
        {currentProfile && (
          <span className="text-secondary p-2">{currentProfile.email}</span>
        )}
        <ThemeSwitcher />
      </Navbar.End>

    </Navbar>
  )

}
