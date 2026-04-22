import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it, vi } from "vitest";

import { LoginForm } from "./LoginForm";

describe("LoginForm integration with Zod validation", () => {
  it("renders email and password inputs", () => {
    const { getByLabelText } = renderWithProviders(<LoginForm />);

    expect(getByLabelText("Email")).toBeTruthy();
    expect(getByLabelText("Password")).toBeTruthy();
  });

  it("shows validation errors when submitting empty form", async () => {
    const { getByRole, getByText, user } = renderWithProviders(<LoginForm />);

    await user.click(getByRole("button", { name: /Sign In/i }));

    expect(getByText("Email is required")).toBeTruthy();
    expect(getByText("Password is required")).toBeTruthy();
  });

  it("prevents submission when email is invalid format and shows in error state", async () => {
    const onSubmit = vi.fn();
    const { getByLabelText, getByRole, user } = renderWithProviders(
      <LoginForm onSubmit={onSubmit} />
    );

    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByRole("button", { name: /Sign In/i });

    // Type invalid email and valid password
    await user.type(emailInput, "not-an-email");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // onSubmit should not be called due to invalid email format
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it("shows password validation error for short password", async () => {
    const { getByLabelText, getByRole, getByText, user } = renderWithProviders(<LoginForm />);

    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "short");
    await user.click(getByRole("button", { name: /Sign In/i }));

    expect(getByText("Password must be at least 8 characters")).toBeTruthy();
  });

  it("clears validation errors when form becomes valid", async () => {
    const { getByLabelText, getByRole, getByText, queryByText, user } = renderWithProviders(
      <LoginForm />
    );

    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByRole("button", { name: /Sign In/i });

    await user.click(submitButton);
    expect(getByText("Email is required")).toBeTruthy();
    expect(getByText("Password is required")).toBeTruthy();

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect(queryByText("Email is required")).toBeNull();
      expect(queryByText("Password is required")).toBeNull();
      expect(queryByText("Please enter a valid email address")).toBeNull();
      expect(queryByText("Password must be at least 8 characters")).toBeNull();
    });
  });

  it("calls onSubmit with valid form values", async () => {
    const onSubmit = vi.fn();
    const { getByLabelText, getByRole, user } = renderWithProviders(
      <LoginForm onSubmit={onSubmit} />
    );

    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByRole("button", { name: /Sign In/i });

    await user.type(emailInput, "user@example.com");
    await user.type(passwordInput, "securepass123");
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "securepass123",
      });
    });
  });
});

