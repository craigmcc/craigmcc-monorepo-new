import { renderWithProviders } from "@repo/testing-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Modal, ModalTrigger } from "./Modal";

// jsdom does not implement HTMLDialogElement.showModal / close.
// Shim them so Modal's close/open DOM calls don't throw.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe("Modal", () => {
  it("renders a dialog element with the given id", () => {
    const { container } = renderWithProviders(
      <Modal id="test-modal">
        <Modal.Body>Modal content</Modal.Body>
      </Modal>
    );
    const dialog = container.querySelector("dialog#test-modal");
    expect(dialog).toBeTruthy();
  });

  it("renders children inside the modal box", () => {
    const { getByText } = renderWithProviders(
      <Modal id="test-modal">
        <Modal.Body>Hello from Modal</Modal.Body>
      </Modal>
    );
    expect(getByText("Hello from Modal")).toBeTruthy();
  });

  it("applies default color class to modal box", () => {
    const { container } = renderWithProviders(
      <Modal id="test-modal">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const box = container.querySelector(".modal-box");
    expect(box?.className).toContain("bg-base-200");
  });

  it("applies color variant class to modal box", () => {
    const { container } = renderWithProviders(
      <Modal color="primary" id="test-modal">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const box = container.querySelector(".modal-box");
    expect(box?.className).toContain("bg-primary");
  });

  it("applies border variant class", () => {
    const { container } = renderWithProviders(
      <Modal border id="test-modal">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const box = container.querySelector(".modal-box");
    expect(box?.className).toContain("border-2");
  });

  it("applies dash variant class", () => {
    const { container } = renderWithProviders(
      <Modal dash id="test-modal">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const box = container.querySelector(".modal-box");
    expect(box?.className).toContain("border-dashed");
  });

  it("renders Modal.Closer with aria-label", () => {
    const { container } = renderWithProviders(
      <Modal id="test-modal">
        <Modal.Closer />
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const closer = container.querySelector('[aria-label="Close dialog"]');
    expect(closer).toBeTruthy();
  });

  it("calls onPress on Modal.Closer when clicked", async () => {
    const onPress = vi.fn();
    const { container, user } = renderWithProviders(
      <Modal id="test-modal">
        <Modal.Closer onPress={onPress} />
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const closer = container.querySelector('[aria-label="Close dialog"]') as HTMLElement;
    await user.click(closer);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders backdrop form for click-outside close", () => {
    const { container } = renderWithProviders(
      <Modal id="test-modal">
        <Modal.Body>Content</Modal.Body>
      </Modal>
    );
    const backdrop = container.querySelector("form.modal-backdrop");
    expect(backdrop).toBeTruthy();
  });

  it("throws when Modal.Body is used outside Modal", () => {
    expect(() =>
      renderWithProviders(<Modal.Body>Orphan</Modal.Body>)
    ).toThrow("Modal child components must be wrapped in <Modal/>");
  });
});

describe("ModalTrigger", () => {
  it("renders a button with default label 'Open'", () => {
    const { getByRole } = renderWithProviders(
      <ModalTrigger modalId="test-modal" />
    );
    expect(getByRole("button", { name: "Open" })).toBeTruthy();
  });

  it("renders a button with custom label", () => {
    const { getByRole } = renderWithProviders(
      <ModalTrigger label="Show Dialog" modalId="test-modal" />
    );
    expect(getByRole("button", { name: "Show Dialog" })).toBeTruthy();
  });

  it("calls onPress when clicked", async () => {
    const onPress = vi.fn();
    const { getByRole, user } = renderWithProviders(
      <ModalTrigger modalId="test-modal" onPress={onPress} />
    );
    await user.click(getByRole("button", { name: "Open" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});


