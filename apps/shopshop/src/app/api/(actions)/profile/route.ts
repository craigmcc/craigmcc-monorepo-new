/**
 * Route handler for Profile mutations.
 */

// External Imports ----------------------------------------------------------

import { ProfileUpdateSchema, ProfileUpdateSchemaType } from "@repo/db-shopshop/zod-schemas/ProfileSchema";
import { NextRequest } from "next/server";

// Internal Imports ----------------------------------------------------------

import { updateProfile } from "@/actions/ProfileActions";
import {
  parseOperationEnvelopeRequest,
  resolveOperationServerTimestamp,
  toOperationRouteResponse,
} from "@/lib/OperationRouteHelpers";

// Public Objects ------------------------------------------------------------

export async function PUT(request: NextRequest) {
  const parsedRequest = await parseOperationEnvelopeRequest<ProfileUpdateSchemaType>({
    expectedOperationType: "updateProfile",
    payloadSchema: ProfileUpdateSchema,
    request,
  });
  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  const result = await updateProfile(parsedRequest.payload, parsedRequest.envelope);
  const serverTimestamp = await resolveOperationServerTimestamp(parsedRequest.envelope.operationId);
  return toOperationRouteResponse(result, parsedRequest.envelope.operationId, serverTimestamp);
}

// Private Objects -----------------------------------------------------------
