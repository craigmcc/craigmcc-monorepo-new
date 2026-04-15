"use client";

/**
 * Examples of DaisyUI+ReactAria Menu component.
 */

// External Modules ----------------------------------------------------------

import { Button } from "@repo/daisy-ui/Button";
import { Card } from "@repo/daisy-ui/Card";
import { Menu } from "@repo/daisy-ui/Menu";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function Menus() {
  return (
    <div className="grid w-full grid-cols-2 gap-2">
      <Card className="w-full">
        <Card.Title className="justify-center">Submenu</Card.Title>
        <Card.Body className="items-center">
          <Menu
            trigger={<Button color="primary">Open Menu</Button>}
          >
            <Menu.Item onAction={() => alert("Selected: Overview")}>Overview</Menu.Item>
            <Menu.Submenu label="Actions">
              <Menu.Item onAction={() => alert("Selected: Rename")}>Rename</Menu.Item>
              <Menu.Item onAction={() => alert("Selected: Duplicate")}>Duplicate</Menu.Item>
              <Menu.Separator />
              <Menu.Item onAction={() => alert("Selected: Archive")}>Archive</Menu.Item>
            </Menu.Submenu>
            <Menu.Separator />
            <Menu.Item onAction={() => alert("Selected: Delete")}>Delete</Menu.Item>
          </Menu>
        </Card.Body>
      </Card>

      <Card className="w-full">
        <Card.Title className="justify-center">Sections + Submenu</Card.Title>
        <Card.Body className="items-center">
          <Menu
            overflow="auto"
            trigger={<Button color="secondary">Open Grouped Menu</Button>}
          >
            <Menu.Section heading="File">
              <Menu.Item onAction={() => alert("Selected: New")}>New</Menu.Item>
              <Menu.Item onAction={() => alert("Selected: Open")}>Open</Menu.Item>
            </Menu.Section>

            <Menu.Section heading="More">
              <Menu.Submenu label="Export As">
                <Menu.Item onAction={() => alert("Selected: PDF")}>PDF</Menu.Item>
                <Menu.Item onAction={() => alert("Selected: Markdown")}>Markdown</Menu.Item>
              </Menu.Submenu>
            </Menu.Section>
          </Menu>
        </Card.Body>
      </Card>
    </div>
  )
}

