import { renderWithProviders } from "@repo/testing-react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ThemeWrapper } from "@/components/layout/ThemeWrapper";
import { ThemeContextProvider, useThemeContext } from "@/contexts/ThemeContext";

import FormsPage from "./page";

function ThemeHarness({ children }: { children: ReactNode }) {
  const { changeTheme } = useThemeContext();

  return (
    <ThemeWrapper>
      <button onClick={() => changeTheme("dark")}>Switch Theme</button>
      {children}
    </ThemeWrapper>
  );
}

function FormsPageWithThemeProviders() {
  return (
    <ThemeContextProvider>
      <ThemeHarness>
        <FormsPage />
      </ThemeHarness>
    </ThemeContextProvider>
  );
}

describe("FormsPage integration", () => {
  it("renders static and TanStack form sections", () => {
    const { getByText, getByTestId } = renderWithProviders(createElement(FormsPage));

    expect(getByText("Generic Static Form (no TanStack)")).toBeTruthy();
    expect(getByText("TanStack Form Integration")).toBeTruthy();
    expect(getByTestId("tanstack-form-section")).toBeTruthy();
  });

  it("shows and clears login validation errors in TanStack section", async () => {
    const { getByTestId, user } = renderWithProviders(createElement(FormsPage));

    const tanstackSection = getByTestId("tanstack-form-section");
    const loginForm = tanstackSection.querySelector('[data-testid="login-form"]');

    expect(loginForm).toBeTruthy();

    const submitButton = loginForm?.querySelector('button[type="submit"]') as HTMLButtonElement;
    const emailInput = loginForm?.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordInput = loginForm?.querySelector('input[name="password"]') as HTMLInputElement;

    await user.type(emailInput, "not-an-email");
    expect(loginForm?.textContent).toContain("Please enter a valid email address");
    expect(loginForm?.textContent).not.toContain("Password is required");

    await user.clear(emailInput);

    await user.click(submitButton);

    expect(loginForm?.textContent).toContain("Email is required");
    expect(loginForm?.textContent).toContain("Password is required");

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect(loginForm?.textContent).not.toContain("Email is required");
      expect(loginForm?.textContent).not.toContain("Password is required");
    });
  });

  it("supports theme switching around the Forms route", async () => {
    localStorage.setItem("daisy-showcase-theme", "light");

    const { container, getByText, user } = renderWithProviders(createElement(FormsPageWithThemeProviders));

    const themedRoot = container.querySelector("[data-theme]") as HTMLDivElement;
    expect(themedRoot).toBeTruthy();

    await vi.waitFor(() => {
      expect(themedRoot.getAttribute("data-theme")).toBe("light");
    });

    await user.click(getByText("Switch Theme"));

    await vi.waitFor(() => {
      expect(themedRoot.getAttribute("data-theme")).toBe("dark");
    });
  });
});




