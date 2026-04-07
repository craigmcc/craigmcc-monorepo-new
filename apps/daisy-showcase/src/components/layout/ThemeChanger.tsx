"use client";

/**
 * UI for switching themes in this application.
 */

// External Modules ----------------------------------------------------------

import { Button } from "@repo/daisy-ui/Button";
import { Menu } from "@repo/daisy-ui/Menu";
import { Palette } from "lucide-react";

// Internal Modules ----------------------------------------------------------

import { useThemeContext } from "@/contexts/ThemeContext";

// Public Objects ------------------------------------------------------------

export function ThemeChanger() {

  const { changeTheme, theme } = useThemeContext();

  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <Menu
      overflow="auto"
      trigger={
        <Button color="ghost">
          <Palette size={32}/>
          Theme
        </Button>
      }
    >
      {THEMES.map((THEME) => (
        <Menu.Item
          className={THEME === theme ? "font-bold" : "font-normal"}
          key={THEME}
          onAction={() => changeTheme(THEME)}
        >
          {capitalize(THEME)}
        </Menu.Item>
      ))}
    </Menu>
  )

}

// Private Objects -----------------------------------------------------------

// Keep this list in sync with the installed themes in globals.css
const THEMES = [
  "light",
  "dark",
  "abyss",
  "acid",
  "aqua",
  "autumn",
  "black",
  "bumblebee",
  "business",
  "caramellatte",
  "cmyk",
  "coffee",
  "corporate",
  "cupcake",
  "cyberpunk",
  "dim",
  "dracula",
  "emerald",
  "fantasy",
  "forest",
  "garden",
  "halloween",
  "lemonade",
  "lofi",
  "luxury",
  "night",
  "nord",
  "pastel",
  "retro",
  "silk",
  "sunset",
  "synthwave",
  "valentine",
  "winter",
  "wireframe",
];

