"use client";

/**
 * Context to hold the currently logged in profile.
 */

// External Modules ----------------------------------------------------------

import React, { createContext, useContext, useEffect, useState } from "react";

// Internal Modules ----------------------------------------------------------

import { Profile } from "@/types/types";

// Public Objects ------------------------------------------------------------

export type CurrentProfileContextType = {
  // Currently logged in profile (if any)
  currentProfile: Profile | null;
  // Function to set the current profile
  setCurrentProfile: (profile: Profile | null) => void;
}

export const CurrentProfileContext = createContext<CurrentProfileContextType>({
  currentProfile: null,
  setCurrentProfile: () => {},
});

const LOCAL_STORAGE_NAME = "daisyui-showcase-currentProfile";

export const CurrentProfileContextProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [currentProfile, changeCurrentProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Load the current profile from local storage or other persistent storage
    const storedProfile = localStorage.getItem(LOCAL_STORAGE_NAME);
    if (storedProfile) {
      changeCurrentProfile(JSON.parse(storedProfile));
    }
  }, []);

  const setCurrentProfile = (profile: Profile | null) => {
    changeCurrentProfile(profile);
    if (profile) {
      localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(profile));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_NAME);
    }
  }

  return (
    <CurrentProfileContext.Provider value={{ currentProfile, setCurrentProfile }}>
      {children}
    </CurrentProfileContext.Provider>
  );
};

export function useCurrentProfileContext() {
  const context = useContext(CurrentProfileContext);
  if (!context) {
    throw new Error("useCurrentProfileContext must be used within a CurrentProfileContextProvider");
  }
  return context;
}
