/**
 * Route handler for Item create mutations.
 */

// External Imports ----------------------------------------------------------

import { ItemCreateSchema, ItemCreateSchemaType } from "@repo/db-shopshop/zod-schemas/ItemSchema";
import { NextRequest } from "next/server";

// Internal Imports ----------------------------------------------------------

import { createItem } from "@/actions/ItemActions";
import {
  parseOperationEnvelopeRequest,
  resolveOperationServerTimestamp,
  toOperationRouteResponse,
} from "@/lib/OperationRouteHelpers";

// Public Objects ------------------------------------------------------------

export async function POST(request: NextRequest) {
  const parsedRequest = await parseOperationEnvelopeRequest<ItemCreateSchemaType>({
    expectedOperationType: "createItem",
    payloadSchema: ItemCreateSchema,
    request,
  });
  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  const result = await createItem(parsedRequest.payload, parsedRequest.envelope);
  const serverTimestamp = await resolveOperationServerTimestamp(parsedRequest.envelope.operationId);
  return toOperationRouteResponse(result, parsedRequest.envelope.operationId, serverTimestamp);
}

// Private Objects -----------------------------------------------------------

