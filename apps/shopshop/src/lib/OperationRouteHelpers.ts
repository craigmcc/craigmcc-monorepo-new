/**
 * Shared route helpers for operation envelope request/response handling.
 */

// External Imports ----------------------------------------------------------

import { type ActionResult, ERRORS } from "@repo/daisy-form/ActionResult";
import { IdSchema } from "@repo/db-shopshop/zod-schemas/IdSchema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Internal Imports ----------------------------------------------------------

import { safeParseOperationEnvelope } from "@/lib/OperationEnvelopeHelpers";
import { lookupOperationRecord } from "@/lib/OperationRecordRepository";
import { findProfile } from "@/lib/ProfileServerHelper";
import type { OperationEnvelope, OperationType } from "@/types/OperationEnvelope";

// Public Objects ------------------------------------------------------------

/**
 * Parse a route request body as an operation envelope and validate its payload.
 */
export async function parseOperationEnvelopeRequest<TPayload>({
  expectedOperationType,
  payloadSchema,
  request,
}: ParseOperationEnvelopeRequestInput<TPayload>): Promise<EnvelopeParseFailure | EnvelopeParseSuccess<TPayload>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: operationRejectedResponse({
        error: INVALID_OPERATION_ENVELOPE_MESSAGE,
        status: 400,
      }),
    };
  }

  const envelopeResult = safeParseOperationEnvelope(body);
  if (!envelopeResult.success) {
    return {
      ok: false,
      response: operationRejectedResponse({
        error: INVALID_OPERATION_ENVELOPE_MESSAGE,
        operationId: readOperationId(body),
        status: 400,
      }),
    };
  }

  const envelope = envelopeResult.data;
  if (envelope.operationType !== expectedOperationType) {
    return {
      ok: false,
      response: operationRejectedResponse({
        error: `Operation type '${envelope.operationType}' is invalid for this route`,
        operationId: envelope.operationId,
        status: 400,
      }),
    };
  }

  const payloadResult = payloadSchema.safeParse(envelope.payload);
  if (!payloadResult.success) {
    return {
      ok: false,
      response: operationRejectedResponse({
        error: ERRORS.DATA_VALIDATION,
        fieldErrors: payloadResult.error.flatten().fieldErrors,
        formErrors: payloadResult.error.flatten().formErrors,
        operationId: envelope.operationId,
        status: 400,
      }),
    };
  }

  return {
    envelope: {
      ...envelope,
      payload: payloadResult.data,
    },
    ok: true,
    payload: payloadResult.data,
  };
}

/**
 * Resolve a deterministic operation timestamp from persisted idempotency records when available.
 */
export async function resolveOperationServerTimestamp(operationId: string): Promise<string> {
  const profile = await findProfile();
  if (profile) {
    const record = await lookupOperationRecord(profile.id, operationId);
    if (record?.completedAt) {
      return record.completedAt.toISOString();
    }
  }

  return new Date().toISOString();
}

/**
 * Convert action-layer results to the operation-aware route response contract.
 */
export function toOperationRouteResponse<M>(
  result: ActionResult<M>,
  operationId: string,
  serverTimestamp: string,
): NextResponse {
  if (result.model) {
    return NextResponse.json({
      accepted: true,
      data: result.model,
      operationId,
      rejected: false,
      serverTimestamp,
    });
  }

  const status = result.status ?? 400;
  return operationRejectedResponse({
    error: result.message ?? ERRORS.INTERNAL_SERVER_ERROR,
    fieldErrors: result.fieldErrors,
    formErrors: result.formErrors,
    operationId,
    serverTimestamp,
    status,
  });
}

export function operationRejectedResponse({
  error,
  fieldErrors,
  formErrors,
  operationId,
  serverTimestamp,
  status,
}: {
  error: string;
  fieldErrors?: Record<string, string[] | undefined>;
  formErrors?: string[];
  operationId?: string;
  serverTimestamp?: string;
  status: number;
}): NextResponse {
  return NextResponse.json({
    accepted: false,
    error,
    fieldErrors,
    formErrors,
    operationId,
    rejected: true,
    serverTimestamp: serverTimestamp ?? new Date().toISOString(),
    status,
  }, {
    status,
  });
}

// Private Objects -----------------------------------------------------------

type EnvelopeParseFailure = {
  ok: false;
  response: NextResponse;
};

type EnvelopeParseSuccess<TPayload> = {
  envelope: OperationEnvelope<TPayload>;
  ok: true;
  payload: TPayload;
};

type ParseOperationEnvelopeRequestInput<TPayload> = {
  expectedOperationType: OperationType;
  payloadSchema: z.ZodType<TPayload>;
  request: NextRequest;
};

const INVALID_OPERATION_ENVELOPE_MESSAGE = "Request body must be a valid operation envelope";

function readOperationId(body: unknown): string | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const value = (body as { operationId?: unknown }).operationId;
  if (!value || typeof value !== "string") {
    return undefined;
  }

  const idResult = IdSchema.safeParse(value);
  return idResult.success ? idResult.data : undefined;
}


