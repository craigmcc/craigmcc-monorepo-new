"use client";

/**
 * Examples of DaisyUI+ReactAria Card component.
 */

// External Modules ----------------------------------------------------------

import { Button } from "@repo/daisy-ui/Button";
import { Card } from "@repo/daisy-ui/Card";
import type { ComponentProps } from "react";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export function Cards() {
  return (

    <>

      <div className={CARD_GRID_CLASSES}>
        {COLORS.map((color) => (
          <ExampleCard
            color={color}
            key={color}
            title={"Card with color: " + color}
          />
        ))}
      </div>

      <hr className="my-4"/>

      <div className={CARD_GRID_CLASSES + " items-start"}>
        {SIZES.map((size) => (
          <ExampleCard
            key={size}
            size={size}
            title={"Card with size " + size}
            titleClassName="justify-center"
          />
        ))}
      </div>

      <hr className="my-4"/>

      <div className={CARD_GRID_CLASSES}>
        <ExampleCard
          border
          title="With Border"
        />
        <ExampleCard
          dash
          title="Dashed Border"
        />
      </div>

    </>

  )
}

// Private Objects -----------------------------------------------------------

type CardColor = NonNullable<ComponentProps<typeof Card>["color"]>;

const CARD_GRID_CLASSES = "grid w-full grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4";

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
] as const satisfies readonly CardColor[];

type CardSize = NonNullable<ComponentProps<typeof Card>["size"]>;
const SIZES = [
  "lg",
  "md",
  "sm",
  "xl",
  "xs",
] as const satisfies readonly CardSize[];

type ExampleCardProps = {
  // Extra CSS class(es) for the Card actions [none]
  actionsClassName?: string;
  // Should we render a solid border? [false]
  border?: boolean;
  // Extra CSS class(es) for the Card body [none]
  bodyClassName?: string;
  // Extra CSS class(es) for the Card component [none]
  cardClassName?: string;
  // Base color for this card [base300]
  color?: "accent" | "base100" | "base200" | "base300" | "error" | "info" |
    "neutral" | "primary" | "secondary" | "success" | "warning";
  // Should we render a dashed border? [false]
  dash?: boolean;
  // Size of this card [md]
  size?: "lg" | "md" | "sm" | "xl" | "xs";
  // Title for this card ["Example Card"]
  title?: string;
  // Extra CSS class(es) for the Card title [none]
  titleClassName?: string;
}

function ExampleCard({
                       actionsClassName,
                       border = false,
                       bodyClassName,
                       cardClassName,
                       color = "base300",
                       dash = false,
                       size = "md",
                       title = "Example Card",
                       titleClassName = "",
                     }: ExampleCardProps) {

  return (
    <Card
      border={border}
      className={cardClassName || undefined}
      color={color}
      dash={dash}
      size={size}
    >
      <Card.Title className={titleClassName}>
        {title}
      </Card.Title>
      <Card.Body className={bodyClassName || undefined}>
        A card component has (optionally) a title, a body part,
        and (optionally) an action part.
      </Card.Body>
      <Card.Actions className={actionsClassName}>
        <Button color="primary">Save</Button>
        <Button color="warning">Cancel</Button>
      </Card.Actions>
    </Card>
  )

}
