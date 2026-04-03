"use client"

import { I18nProvider } from "react-aria-components";
import type { ReactNode } from "react";

type ProvidersProps = {
  lang: string;
  children: ReactNode;
};

export function Providers({ lang, children }: ProvidersProps) {
  return (
    <I18nProvider locale={lang}>
      {children}
    </I18nProvider>
  )
}
