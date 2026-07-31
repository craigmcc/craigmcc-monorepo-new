/**
 * Route handler for List create mutations.
 */

// External Imports ----------------------------------------------------------

import { ERRORS } from "@repo/daisy-form/ActionResult";
import {
  ListCreateSchema,
  type ListCreateSchemaType,
} from "@repo/db-shopshop/zod-schemas/ListSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Internal Imports ----------------------------------------------------------

import { createList } from "@/actions/ListActions";
import { safeParseOperationEnvelope } from "@/lib/OperationEnvelopeHelpers";
import { lookupOperationRecord } from "@/lib/OperationRecordRepository";
import { findProfile } from "@/lib/ProfileServerHelper";
import type { OperationEnvelope } from "@/types/OperationEnvelope";

// Public Objects ------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestBody = await parseRequestBody(request);
  if (requestBody === INVALID_REQUEST_BODY) {
    return NextResponse.json(buildRejectedResponse({
      error: ERRORS.DATA_VALIDATION,
      operationId: null,
      serverTimestamp: toIsoTimestamp(new Date()),
      status: 400,
    }), {
      status: 400,
    });
  }

  const envelopeResult = safeParseOperationEnvelope(requestBody);
  if (!envelopeResult.success) {
    return NextResponse.json(buildValidationRejectedResponse(
      envelopeResult.error,
      extractOperationId(requestBody),
    ), {
      status: 400,
    });
  }

  if (envelopeResult.data.operationType !== "createList") {
    return NextResponse.json(buildRejectedResponse({
      error: INVALID_OPERATION_TYPE_MESSAGE,
      operationId: envelopeResult.data.operationId,
      serverTimestamp: toIsoTimestamp(new Date()),
      status: 400,
    }), {
      status: 400,
    });
  }

  const payloadResult = ListCreateSchema.safeParse(envelopeResult.data.payload);
  if (!payloadResult.success) {
    return NextResponse.json(buildValidationRejectedResponse(
      payloadResult.error,
      envelopeResult.data.operationId,
    ), {
      status: 400,
    });
  }

  const envelope: OperationEnvelope<ListCreateSchemaType> = {
    ...envelopeResult.data,
    payload: payloadResult.data,
  };
  const result = await createList(payloadResult.data, envelope);
  const serverTimestamp = await resolveServerTimestamp(envelope.operationId);
  if (result.model) {
    return NextResponse.json(buildAcceptedResponse(result.model, envelope.operationId, serverTimestamp));
  }

  const status = result.status ?? 400;
  return NextResponse.json(buildRejectedResponse({
    error: result.message ?? ERRORS.DATA_VALIDATION,
    fieldErrors: result.fieldErrors,
    formErrors: result.formErrors,
    operationId: envelope.operationId,
    serverTimestamp,
    status,
  }), {
    status,
  });
}

// Private Objects -----------------------------------------------------------

type CreateListRouteRejectedResponse = {
  accepted: false;
  error: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
  formErrors?: string[];
  operationId: string | null;
  rejected: true;
  serverTimestamp: string;
  status: number;
};

type CreateListRouteSuccessResponse<M> = {
  accepted: true;
  data: M;
  operationId: string;
  rejected: false;
  serverTimestamp: string;
};

const INVALID_OPERATION_TYPE_MESSAGE = "Operation type does not match this route";
const INVALID_REQUEST_BODY = Symbol("INVALID_REQUEST_BODY");

async function parseRequestBody(request: NextRequest): Promise<typeof INVALID_REQUEST_BODY | unknown> {
  try {
    return await request.json();
  } catch {
    return INVALID_REQUEST_BODY;
  }
}

async function resolveServerTimestamp(operationId: string): Promise<string> {
  const profile = await findProfile();
  if (!profile) {
    return toIsoTimestamp(new Date());
  }

  const operationRecord = await lookupOperationRecord(profile.id, operationId);
  return toIsoTimestamp(operationRecord?.completedAt ?? new Date());
}

function buildAcceptedResponse<M>(
  model: M,
  operationId: string,
  serverTimestamp: string,
): CreateListRouteSuccessResponse<M> {
  return {
    accepted: true,
    data: model,
    operationId,
    rejected: false,
    serverTimestamp,
  };
}

function buildRejectedResponse(input: {
  error: string;
  fieldErrors?: CreateListRouteRejectedResponse["fieldErrors"];
  formErrors?: string[];
  operationId: string | null;
  serverTimestamp: string;
  status: number;
}): CreateListRouteRejectedResponse {
  return {
    accepted: false,
    error: input.error,
    fieldErrors: input.fieldErrors,
    formErrors: input.formErrors,
    operationId: input.operationId,
    rejected: true,
    serverTimestamp: input.serverTimestamp,
    status: input.status,
  };
}

function buildValidationRejectedResponse(error: z.ZodError, operationId: string | null): CreateListRouteRejectedResponse {
  const flattened = flattenValidationError(error);
  return buildRejectedResponse({
    error: ERRORS.DATA_VALIDATION,
    fieldErrors: flattened.fieldErrors,
    formErrors: flattened.formErrors,
    operationId,
    serverTimestamp: toIsoTimestamp(new Date()),
    status: 400,
  });
}

function extractOperationId(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const operationId = (data as { operationId?: unknown }).operationId;
  return typeof operationId === "string" ? operationId : null;
}

function flattenValidationError(error: z.ZodError): {
  fieldErrors: CreateListRouteRejectedResponse["fieldErrors"];
  formErrors: string[] | undefined;
} {
  const flattened = z.flattenError(error);
  return {
    fieldErrors: flattened.fieldErrors,
    formErrors: flattened.formErrors.length > 0 ? flattened.formErrors : undefined,
  };
}

function toIsoTimestamp(value: Date): string {
  return value.toISOString();
}
