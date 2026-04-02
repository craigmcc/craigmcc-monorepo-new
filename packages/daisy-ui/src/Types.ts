/**
 * Commonly used Types across the daisy-ui package.
 */

// Public Modules ------------------------------------------------------------

import { PressEvent } from "react-aria-components";

// Private Modules -----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export type FocusEventHandler = (event: FocusEvent) => void;
export type KeyboardHandler = (event: KeyboardEvent) => void;
export type MouseEventHandler = (event: MouseEvent) => void;
export type PressEventHandler = (event: PressEvent) => void;
