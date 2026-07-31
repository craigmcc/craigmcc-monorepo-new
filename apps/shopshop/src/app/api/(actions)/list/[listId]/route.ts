/**
 * Route handler for List update and delete mutations.
 */

// External Imports ----------------------------------------------------------

import { ListUpdateSchema, ListUpdateSchemaType } from "@repo/db-shopshop/zod-schemas/ListSchema";
import { NextRequest } from "next/server";
import { z } from "zod";

// Internal Imports ----------------------------------------------------------

import { deleteList, updateList } from "@/actions/ListActions";
import {
  operationRejectedResponse,
  parseOperationEnvelopeRequest,
  resolveOperationServerTimestamp,
  toOperationRouteResponse,
} from "@/lib/OperationRouteHelpers";

// Public Objects ------------------------------------------------------------

type RouteContext = {
  params: Promise<{ listId: string }>;
};

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { listId } = await params;
  const parsedRequest = await parseOperationEnvelopeRequest<DeleteListRoutePayload>({
    expectedOperationType: "deleteList",
    payloadSchema: DELETE_LIST_ROUTE_PAYLOAD_SCHEMA,
    request,
  });
  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  if (parsedRequest.payload.listId !== listId) {
    return operationRejectedResponse({
      error: ROUTE_PARAMETER_MISMATCH_MESSAGE,
      operationId: parsedRequest.envelope.operationId,
      status: 400,
    });
  }

  const result = await deleteList(listId, parsedRequest.envelope);
  const serverTimestamp = await resolveOperationServerTimestamp(parsedRequest.envelope.operationId);
  return toOperationRouteResponse(result, parsedRequest.envelope.operationId, serverTimestamp);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { listId } = await params;
  const parsedRequest = await parseOperationEnvelopeRequest<UpdateListRoutePayload>({
    expectedOperationType: "updateList",
    payloadSchema: UPDATE_LIST_ROUTE_PAYLOAD_SCHEMA,
    request,
  });
  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  if (parsedRequest.payload.listId !== listId) {
    return operationRejectedResponse({
      error: ROUTE_PARAMETER_MISMATCH_MESSAGE,
      operationId: parsedRequest.envelope.operationId,
      status: 400,
    });
  }

  const result = await updateList(listId, parsedRequest.payload.data, parsedRequest.envelope);
  const serverTimestamp = await resolveOperationServerTimestamp(parsedRequest.envelope.operationId);
  return toOperationRouteResponse(result, parsedRequest.envelope.operationId, serverTimestamp);
}

// Private Objects -----------------------------------------------------------

type DeleteListRoutePayload = {
  listId: string;
};

type UpdateListRoutePayload = {
  data: ListUpdateSchemaType;
  listId: string;
};

const DELETE_LIST_ROUTE_PAYLOAD_SCHEMA = z.object({
  listId: z.uuid(),
});

const ROUTE_PARAMETER_MISMATCH_MESSAGE = "Operation payload listId does not match route parameter";

const UPDATE_LIST_ROUTE_PAYLOAD_SCHEMA = z.object({
  data: ListUpdateSchema,
  listId: z.uuid(),
});

