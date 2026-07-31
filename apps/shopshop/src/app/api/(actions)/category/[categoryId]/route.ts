/**
 * Route handler for Category update and delete mutations.
 */

// External Imports ----------------------------------------------------------

import { CategoryUpdateSchema, CategoryUpdateSchemaType } from "@repo/db-shopshop/zod-schemas/CategorySchema";
import { NextRequest } from "next/server";
import { z } from "zod";

// Internal Imports ----------------------------------------------------------

import { deleteCategory, updateCategory } from "@/actions/CategoryActions";
import {
  operationRejectedResponse,
  parseOperationEnvelopeRequest,
  resolveOperationServerTimestamp,
  toOperationRouteResponse,
} from "@/lib/OperationRouteHelpers";

// Public Objects ------------------------------------------------------------

type RouteContext = {
  params: Promise<{ categoryId: string }>;
};

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { categoryId } = await params;
  const parsedRequest = await parseOperationEnvelopeRequest<DeleteCategoryRoutePayload>({
    expectedOperationType: "deleteCategory",
    payloadSchema: DELETE_CATEGORY_ROUTE_PAYLOAD_SCHEMA,
    request,
  });
  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  if (parsedRequest.payload.categoryId !== categoryId) {
    return operationRejectedResponse({
      error: ROUTE_PARAMETER_MISMATCH_MESSAGE,
      operationId: parsedRequest.envelope.operationId,
      status: 400,
    });
  }

  const result = await deleteCategory(categoryId, parsedRequest.envelope);
  const serverTimestamp = await resolveOperationServerTimestamp(parsedRequest.envelope.operationId);
  return toOperationRouteResponse(result, parsedRequest.envelope.operationId, serverTimestamp);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { categoryId } = await params;
  const parsedRequest = await parseOperationEnvelopeRequest<UpdateCategoryRoutePayload>({
    expectedOperationType: "updateCategory",
    payloadSchema: UPDATE_CATEGORY_ROUTE_PAYLOAD_SCHEMA,
    request,
  });
  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  if (parsedRequest.payload.categoryId !== categoryId) {
    return operationRejectedResponse({
      error: ROUTE_PARAMETER_MISMATCH_MESSAGE,
      operationId: parsedRequest.envelope.operationId,
      status: 400,
    });
  }

  const result = await updateCategory(categoryId, parsedRequest.payload.data, parsedRequest.envelope);
  const serverTimestamp = await resolveOperationServerTimestamp(parsedRequest.envelope.operationId);
  return toOperationRouteResponse(result, parsedRequest.envelope.operationId, serverTimestamp);
}

// Private Objects -----------------------------------------------------------

type DeleteCategoryRoutePayload = {
  categoryId: string;
};

type UpdateCategoryRoutePayload = {
  categoryId: string;
  data: CategoryUpdateSchemaType;
};

const DELETE_CATEGORY_ROUTE_PAYLOAD_SCHEMA = z.object({
  categoryId: z.uuid(),
});

const ROUTE_PARAMETER_MISMATCH_MESSAGE = "Operation payload categoryId does not match route parameter";

const UPDATE_CATEGORY_ROUTE_PAYLOAD_SCHEMA = z.object({
  categoryId: z.uuid(),
  data: CategoryUpdateSchema,
});

