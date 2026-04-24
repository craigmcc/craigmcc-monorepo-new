import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";
import { Menu } from "./Menu";

// React Aria renders its Popover in a document-level portal, so menu items
// appear inside a portal appended to document.body rather than in the test
// container.  The trigger must be a React Aria-aware pressable element (e.g.
// the DaisyUI Button) so that MenuTrigger's internal press event chain fires.

describe("Menu", () => {
  it("renders the trigger element", () => {
    const { getByRole } = renderWithProviders(
      <Menu trigger={<Button>Open</Button>}>
        <Menu.Item>Item A</Menu.Item>
      </Menu>
    );
    expect(getByRole("button", { name: "Open" })).toBeTruthy();
  });

  it("does not show menu items before trigger is pressed", () => {
    const { queryByRole } = renderWithProviders(
      <Menu trigger={<Button>Open</Button>}>
        <Menu.Item>Hidden Item</Menu.Item>
      </Menu>
    );
    expect(queryByRole("menuitem", { name: "Hidden Item" })).toBeNull();
  });

  it("shows menu items after trigger is pressed", async () => {
    const { getByRole, user } = renderWithProviders(
      <Menu trigger={<Button>Open</Button>}>
        <Menu.Item>Visible Item</Menu.Item>
      </Menu>
    );
    await user.click(getByRole("button", { name: "Open" }));
    await vi.waitFor(() => {
      expect(getByRole("menuitem", { name: "Visible Item" })).toBeTruthy();
    });
  });

  it("calls onAction when an item is pressed", async () => {
    const onAction = vi.fn();
    const { getByRole, user } = renderWithProviders(
      <Menu trigger={<Button>Open</Button>}>
        <Menu.Item id="item-a" onAction={() => onAction("item-a")}>Item A</Menu.Item>
      </Menu>
    );
    await user.click(getByRole("button", { name: "Open" }));
    await vi.waitFor(() => {
      expect(getByRole("menuitem", { name: "Item A" })).toBeTruthy();
    });
    await user.click(getByRole("menuitem", { name: "Item A" }));
    expect(onAction).toHaveBeenCalledWith("item-a");
  });

  it("renders a section with heading when Menu.Section is used", async () => {
    const { getByRole, getByText, user } = renderWithProviders(
      <Menu trigger={<Button>Open</Button>}>
        <Menu.Section heading="My Section">
          <Menu.Item>Section Item</Menu.Item>
        </Menu.Section>
      </Menu>
    );
    await user.click(getByRole("button", { name: "Open" }));
    await vi.waitFor(() => {
      expect(getByText("My Section")).toBeTruthy();
      expect(getByRole("menuitem", { name: "Section Item" })).toBeTruthy();
    });
  });

  it("renders a separator when Menu.Separator is used", async () => {
    const { getByRole, user } = renderWithProviders(
      <Menu trigger={<Button>Open</Button>}>
        <Menu.Item>Item A</Menu.Item>
        <Menu.Separator />
        <Menu.Item>Item B</Menu.Item>
      </Menu>
    );
    await user.click(getByRole("button", { name: "Open" }));
    await vi.waitFor(() => {
      expect(document.body.querySelector('[role="separator"]')).toBeTruthy();
    });
  });

  it("applies custom menuClassName", async () => {
    const { getByRole, user } = renderWithProviders(
      <Menu menuClassName="my-menu-class" trigger={<Button>Open</Button>}>
        <Menu.Item>Item</Menu.Item>
      </Menu>
    );
    await user.click(getByRole("button", { name: "Open" }));
    await vi.waitFor(() => {
      expect(document.body.querySelector(".my-menu-class")).toBeTruthy();
    });
  });

  it("throws when Menu.Item is used outside Menu", () => {
    expect(() =>
      renderWithProviders(<Menu.Item>Orphan</Menu.Item>)
    ).toThrow("Menu child components must be wrapped in <Menu/>");
  });

  it("throws when Menu.Separator is used outside Menu", () => {
    expect(() =>
      renderWithProviders(<Menu.Separator />)
    ).toThrow("Menu child components must be wrapped in <Menu/>");
  });
});
