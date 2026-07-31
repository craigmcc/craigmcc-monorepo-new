/**
 * Route handler for Category create mutations.
 */

// External Imports ----------------------------------------------------------

import { CategoryCreateSchema, CategoryCreateSchemaType } from "@repo/db-shopshop/zod-schemas/CategorySchema";
import { NextRequest } from "next/server";

// Internal Imports ----------------------------------------------------------

import { createCategory } from "@/actions/CategoryActions";
import {
  parseOperationEnvelopeRequest,
  resolveOperationServerTimestamp,
  toOperationRouteResponse,
} from "@/lib/OperationRouteHelpers";

// Public Objects ------------------------------------------------------------

export async function POST(request: NextRequest) {
  const parsedRequest = await parseOperationEnvelopeRequest<CategoryCreateSchemaType>({
    expectedOperationType: "createCategory",
    payloadSchema: CategoryCreateSchema,
    request,
  });
  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  const result = await createCategory(parsedRequest.payload, parsedRequest.envelope);
  const serverTimestamp = await resolveOperationServerTimestamp(parsedRequest.envelope.operationId);
  return toOperationRouteResponse(result, parsedRequest.envelope.operationId, serverTimestamp);
}

// Private Objects -----------------------------------------------------------

