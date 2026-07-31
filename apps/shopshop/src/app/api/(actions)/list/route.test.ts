/**
 * E2E tests for the List create route.
 */

// External Imports ----------------------------------------------------------

import { ERRORS } from "@repo/daisy-form/ActionResult";
import { dbShopShop as db } from "@repo/db-shopshop";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Imports ----------------------------------------------------------

import { POST } from "@/app/api/(actions)/list/route";
import { lookupProfileByEmail } from "@/lib/ProfileHelpers";
import { setProfile } from "@/lib/ProfileServerHelper";
import { BaseUtils } from "@/test/BaseUtils";
import { PROFILES } from "@/test/SeedData";
import {
  OPERATION_ENVELOPE_SCHEMA_VERSION,
  type OperationType,
} from "@/types/OperationEnvelope";

// Public Objects ------------------------------------------------------------

describe("/api/list", () => {

  // Test Hooks --------------------------------------------------------------

  const utils = new BaseUtils();

  beforeEach(async () => {
    setProfile(null);
    await utils.loadData({
      withProfiles: true,
    });
  });

  // Test Cases --------------------------------------------------------------

  it("returns an authentication error for unsigned callers", async () => {
    const envelope = makeEnvelope("11111111-1111-4111-8111-111111111111", "createList", {
      name: "Route List",
    });
    const request = makeRequest(envelope);

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe(ERRORS.AUTHENTICATION);
    expect(payload.operationId).toBe(envelope.operationId);
    expect(payload.rejected).toBe(true);
    expect(typeof payload.serverTimestamp).toBe("string");
    expect(payload.status).toBe(401);
  });

  it("creates a list for signed-in callers", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const envelope = makeEnvelope("22222222-2222-4222-8222-222222222222", "createList", {
      name: "Route List",
    });
    const listCountBefore = await db.list.count();
    const request = makeRequest(envelope);

    const response = await POST(request);
    const payload = await response.json();
    const listCountAfter = await db.list.count();

    expect(response.status).toBe(200);
    expect(payload.accepted).toBe(true);
    expect(payload.data.name).toBe("Route List");
    expect(payload.operationId).toBe(envelope.operationId);
    expect(payload.rejected).toBe(false);
    expect(typeof payload.serverTimestamp).toBe("string");
    expect(listCountAfter).toBe(listCountBefore + 1);
  });

  it("replays a duplicate envelope without creating a second list", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const envelope = makeEnvelope("33333333-3333-4333-8333-333333333333", "createList", {
      name: "Replay List",
    });
    const listCountBefore = await db.list.count();

    const firstResponse = await POST(makeRequest(envelope));
    const firstPayload = await firstResponse.json();
    const secondResponse = await POST(makeRequest(envelope));
    const secondPayload = await secondResponse.json();
    const listCountAfter = await db.list.count();

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(secondPayload).toEqual(firstPayload);
    expect(listCountAfter).toBe(listCountBefore + 1);
  });

  it("rejects a duplicate operationId when the payload changes", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const firstEnvelope = makeEnvelope("44444444-4444-4444-8444-444444444444", "createList", {
      name: "First Route Payload",
    });
    const secondEnvelope = {
      ...firstEnvelope,
      payload: {
        name: "Second Route Payload",
      },
    };
    const listCountBefore = await db.list.count();

    const firstResponse = await POST(makeRequest(firstEnvelope));
    const firstPayload = await firstResponse.json();
    const secondResponse = await POST(makeRequest(secondEnvelope));
    const secondPayload = await secondResponse.json();
    const listCountAfter = await db.list.count();

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(409);
    expect(secondPayload.accepted).toBe(false);
    expect(secondPayload.error).toBe("Operation payload does not match existing operationId");
    expect(secondPayload.operationId).toBe(firstEnvelope.operationId);
    expect(secondPayload.rejected).toBe(true);
    expect(secondPayload.serverTimestamp).toBe(firstPayload.serverTimestamp);
    expect(secondPayload.status).toBe(409);
    expect(listCountAfter).toBe(listCountBefore + 1);
  });

  it("rejects non-envelope requests at the route boundary", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const listCountBefore = await db.list.count();
    const request = makeRequest({
      name: "Route List",
    });

    const response = await POST(request);
    const payload = await response.json();
    const listCountAfter = await db.list.count();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe(ERRORS.DATA_VALIDATION);
    expect(payload.operationId).toBe(null);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
    expect(listCountAfter).toBe(listCountBefore);
  });

  it("rejects envelopes whose operationType does not match the route", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const envelope = makeEnvelope("55555555-5555-4555-8555-555555555555", "updateList", {
      name: "Wrong Route Operation",
    });
    const listCountBefore = await db.list.count();

    const response = await POST(makeRequest(envelope));
    const payload = await response.json();
    const listCountAfter = await db.list.count();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("Operation type does not match this route");
    expect(payload.operationId).toBe(envelope.operationId);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
    expect(listCountAfter).toBe(listCountBefore);
  });

  it("rejects envelopes with an invalid schemaVersion", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const envelope = {
      ...makeEnvelope("66666666-6666-4666-8666-666666666666", "createList", {
        name: "Wrong Schema Version",
      }),
      schemaVersion: OPERATION_ENVELOPE_SCHEMA_VERSION + 1,
    };
    const listCountBefore = await db.list.count();

    const response = await POST(makeRequest(envelope));
    const payload = await response.json();
    const listCountAfter = await db.list.count();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe(ERRORS.DATA_VALIDATION);
    expect(payload.operationId).toBe(envelope.operationId);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
    expect(listCountAfter).toBe(listCountBefore);
  });

});

// Private Objects -----------------------------------------------------------

function makeEnvelope(operationId: string, operationType: OperationType, payload: unknown) {
  return {
    clientTimestamp: new Date("2026-07-14T00:00:00.000Z"),
    operationId,
    operationType,
    payload,
    schemaVersion: OPERATION_ENVELOPE_SCHEMA_VERSION,
  };
}

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://example.test/api/list", {
    body: JSON.stringify(body),
    method: "POST",
  });
}
