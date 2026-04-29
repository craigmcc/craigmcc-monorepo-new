"use client";

/**
 * Tables example component.
 */

// External Modules ----------------------------------------------------------

import { Card } from "@repo/daisy-ui/Card";

// Internal Modules ----------------------------------------------------------

import { TanstackTable } from "@/tables/TanstackTable";
import users from "@/data/users.json";

// Public Objects ------------------------------------------------------------

export function Tables() {

  return (
    <Card border className="w-full">
      <Card.Title className="justify-center">Tanstack Table</Card.Title>
      <Card.Body>
        <TanstackTable users={users} />
      </Card.Body>
    </Card>
  )
}
