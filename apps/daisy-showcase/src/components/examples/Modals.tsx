"use client";

/**
 * Examples of DaisyUI+ReactAria Modal Component.
 */

// External Modules ----------------------------------------------------------

import { Modal, ModalTrigger } from "@repo/daisy-ui/Modal";
import { Select, SelectOption } from "@repo/daisy-ui/Select";
import type { ComponentProps } from "react";
import { useState } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function Modals() {

  const [border, setBorder] = useState<string>("border");
  const [color, setColor] = useState<string>("neutral");

  return (

    <>

      <div className={"flex flex-rows-6 gap-6 items-center"}>

        <Select
          handleChange={(value) => setColor(value)}
          label="Color:"
          labelClassName="w-24"
          name="color"
          options={COLORS_OPTIONS}
          value={color}
        />

        <Select
          handleChange={(value) => setBorder(value)}
          label="Border:"
          labelClassName="w-24"
          name="border"
          options={BORDERS_OPTIONS}
          value={border}
        />

        <ModalTrigger
          color="info"
          label="Open Modal"
          modalId={MODAL_ID}
        />

      </div>

      <Modal
        border={border === "border"}
        color={color as ModalColor}
        dash={border === "dash"}
        id={MODAL_ID}
      >
        <Modal.Closer/>
        <Modal.Body>
          <p className="font-bold text-lg">Example Modal</p>
          <p className={"py-4"}>
            This is an example modal.  Click the close button above,
            or press ESC, to close it.
          </p>
        </Modal.Body>
      </Modal>

    </>
  )

}

// Private Objects -----------------------------------------------------------

type ModalColor = NonNullable<ComponentProps<typeof Modal>["color"]>;

const MODAL_ID = "my-modal";

const BORDERS = [
  "none",
  "border",
  "dash",
];

const BORDERS_OPTIONS: SelectOption[] =
  BORDERS.map((border) => ({ label: border, value: border }));

const COLORS = [
  "accent",
  "base100",
  "base200",
  "base300",
  "error",
  "info",
  "neutral",
  "primary",
  "secondary",
  "success",
  "warning",
] as const satisfies readonly ModalColor[];

const COLORS_OPTIONS: SelectOption[] =
  COLORS.map((color) => ({ label: color, value: color }));
