"use client";

/**
 * Global context for saving and restoring the currently selected theme
 * from local storage.
 */

// External Modules ----------------------------------------------------------

import React, { createContext, useContext, useEffect, useState } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type ThemeContextType = {
  // Function to change the currently selected theme
  changeTheme: (theme: string) => void;
  // Currently selected theme
  theme: string;
}

export const ThemeContext = createContext<ThemeContextType>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeTheme: (theme) => {},
  theme: "",
});

const DEFAULT_INITIAL_THEME = "light";
const LOCAL_STORAGE_NAME = "daisyui-theme";

export const ThemeContextProvider = ({children}: {
  children: React.ReactNode,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>(DEFAULT_INITIAL_THEME);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_NAME) || DEFAULT_INITIAL_THEME;
    setTheme(storedTheme);
  }, []);

  if (!isMounted) {
    return <>Loading theme ...</>;
  }

  const changeTheme = (theme: string) => {
    setTheme(theme);
    localStorage.setItem(LOCAL_STORAGE_NAME, theme);
  }

  return (
    <ThemeContext.Provider value={{changeTheme, theme}}>
      {children}
    </ThemeContext.Provider>
  );

}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeContextProvider");
  }
  return context;
}
