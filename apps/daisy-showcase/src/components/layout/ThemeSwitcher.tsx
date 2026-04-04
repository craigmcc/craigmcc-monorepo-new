"use client";

// @/components/layout/ThemeSwitcher.tsx

/**
 * UI for switching themes in this application.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { Palette } from "lucide-react";

// Internal Modules ----------------------------------------------------------

import { useThemeContext } from "@/contexts/ThemeContext";

// Public Objects ------------------------------------------------------------

export const ThemeSwitcher = () => {

  const { changeTheme, theme } = useThemeContext();

  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <div className="dropdown dropdown-end">
      <details>
        <summary className="btn btn-ghost">
          <Palette size={32}/>
          Theme
        </summary>
        <ul tabIndex={0} className="menu dropdown-content z-1 mt-6 shadow-sm bg-base-300 rounded-box">
          {THEMES.map((THEME) => (
            <li
              className={THEME === theme ? "font-bold" : "font-normal"}
              key={THEME}
              onClick={() => changeTheme(THEME)}
            >
              {capitalize(THEME)}
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}

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
