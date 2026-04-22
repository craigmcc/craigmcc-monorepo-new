import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it } from "vitest";

import { FieldErrors } from "./FieldErrors";

describe("FieldErrors", () => {
  it("hides errors for pristine untouched fields", () => {
    const field = {
      form: {
        state: {
          submissionAttempts: 0,
        },
      },
      state: {
        meta: {
          errorMap: undefined,
          errors: ["Email is required"],
          isPristine: true,
          isTouched: false,
        },
      },
    };

    const { queryByText } = renderWithProviders(<FieldErrors field={field as never} />);
    expect(queryByText("Email is required")).toBeNull();
  });

  it("renders object message errors for touched fields", () => {
    const field = {
      form: {
        state: {
          submissionAttempts: 0,
        },
      },
      state: {
        meta: {
          errorMap: undefined,
          errors: [{ message: "Password must be at least 8 characters" }],
          isPristine: false,
          isTouched: true,
        },
      },
    };

    const { getByText } = renderWithProviders(<FieldErrors field={field as never} />);
    expect(getByText("Password must be at least 8 characters")).toBeTruthy();
  });

  it("renders nested schema-style errors from errorMap", () => {
    const field = {
      form: {
        state: {
          submissionAttempts: 1,
        },
      },
      state: {
        meta: {
          errorMap: {
            onSubmit: {
              fields: {
                email: [{ message: "Please enter a valid email address" }],
              },
            },
          },
          errors: [],
          isPristine: true,
          isTouched: false,
        },
      },
    };

    const { getByText } = renderWithProviders(<FieldErrors field={field as never} />);
    expect(getByText("Please enter a valid email address")).toBeTruthy();
  });

  it("joins unique messages from errors and errorMap", () => {
    const field = {
      form: {
        state: {
          submissionAttempts: 1,
        },
      },
      state: {
        meta: {
          errorMap: {
            onChange: {
              message: "Email is required",
            },
          },
          errors: ["Email is required", { message: "Password is required" }],
          isPristine: true,
          isTouched: false,
        },
      },
    };

    const { getByText } = renderWithProviders(<FieldErrors field={field as never} />);
    expect(getByText("Email is required, Password is required")).toBeTruthy();
  });

  it("supports submit-only policy", () => {
    const field = {
      form: {
        state: {
          submissionAttempts: 0,
        },
      },
      state: {
        meta: {
          errorMap: undefined,
          errors: ["Email is required"],
          isPristine: false,
          isTouched: true,
        },
      },
    };

    const { queryByText, rerender } = renderWithProviders(
      <FieldErrors field={field as never} visibilityPolicy="submit-only" />
    );
    expect(queryByText("Email is required")).toBeNull();

    const submittedField = {
      ...field,
      form: {
        state: {
          submissionAttempts: 1,
        },
      },
    };

    rerender(<FieldErrors field={submittedField as never} visibilityPolicy="submit-only" />);
    expect(queryByText("Email is required")).toBeTruthy();
  });

  it("supports custom visibility policy callbacks", () => {
    const field = {
      form: {
        state: {
          submissionAttempts: 1,
        },
      },
      state: {
        meta: {
          errorMap: undefined,
          errors: ["Email is required"],
          isPristine: true,
          isTouched: false,
        },
      },
    };

    const { queryByText } = renderWithProviders(
      <FieldErrors
        field={field as never}
        visibilityPolicy={({ isTouched }) => isTouched}
      />
    );

    expect(queryByText("Email is required")).toBeNull();
  });
});

