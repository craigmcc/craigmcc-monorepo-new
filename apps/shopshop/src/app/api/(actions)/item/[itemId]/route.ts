/**
 * Route handler for Item update and delete mutations.
 */

// External Imports ----------------------------------------------------------

import { ItemUpdateSchema, ItemUpdateSchemaType } from "@repo/db-shopshop/zod-schemas/ItemSchema";
import { NextRequest } from "next/server";
import { z } from "zod";

// Internal Imports ----------------------------------------------------------

import { deleteItem, updateItem } from "@/actions/ItemActions";
import {
  operationRejectedResponse,
  parseOperationEnvelopeRequest,
  resolveOperationServerTimestamp,
  toOperationRouteResponse,
} from "@/lib/OperationRouteHelpers";

// Public Objects ------------------------------------------------------------

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { itemId } = await params;
  const parsedRequest = await parseOperationEnvelopeRequest<DeleteItemRoutePayload>({
    expectedOperationType: "deleteItem",
    payloadSchema: DELETE_ITEM_ROUTE_PAYLOAD_SCHEMA,
    request,
  });
  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  if (parsedRequest.payload.itemId !== itemId) {
    return operationRejectedResponse({
      error: ROUTE_PARAMETER_MISMATCH_MESSAGE,
      operationId: parsedRequest.envelope.operationId,
      status: 400,
    });
  }

  const result = await deleteItem(itemId, parsedRequest.envelope);
  const serverTimestamp = await resolveOperationServerTimestamp(parsedRequest.envelope.operationId);
  return toOperationRouteResponse(result, parsedRequest.envelope.operationId, serverTimestamp);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { itemId } = await params;
  const parsedRequest = await parseOperationEnvelopeRequest<UpdateItemRoutePayload>({
    expectedOperationType: "updateItem",
    payloadSchema: UPDATE_ITEM_ROUTE_PAYLOAD_SCHEMA,
    request,
  });
  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  if (parsedRequest.payload.itemId !== itemId) {
    return operationRejectedResponse({
      error: ROUTE_PARAMETER_MISMATCH_MESSAGE,
      operationId: parsedRequest.envelope.operationId,
      status: 400,
    });
  }

  const result = await updateItem(itemId, parsedRequest.payload.data, parsedRequest.envelope);
  const serverTimestamp = await resolveOperationServerTimestamp(parsedRequest.envelope.operationId);
  return toOperationRouteResponse(result, parsedRequest.envelope.operationId, serverTimestamp);
}

// Private Objects -----------------------------------------------------------

type DeleteItemRoutePayload = {
  itemId: string;
};

type UpdateItemRoutePayload = {
  itemId: string;
  data: ItemUpdateSchemaType;
};

const DELETE_ITEM_ROUTE_PAYLOAD_SCHEMA = z.object({
  itemId: z.uuid(),
});

const ROUTE_PARAMETER_MISMATCH_MESSAGE = "Operation payload itemId does not match route parameter";

const UPDATE_ITEM_ROUTE_PAYLOAD_SCHEMA = z.object({
  itemId: z.uuid(),
  data: ItemUpdateSchema,
});

