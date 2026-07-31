/**
 * E2E tests for the Profile action route.
 */

// External Imports ----------------------------------------------------------

import { dbShopShop as db } from "@repo/db-shopshop";
import { ProfileUpdateSchemaType } from "@repo/db-shopshop/zod-schemas/ProfileSchema";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Imports ----------------------------------------------------------

import { PUT } from "@/app/api/(actions)/profile/route";
import { lookupProfileByEmail } from "@/lib/ProfileHelpers";
import { setProfile } from "@/lib/ProfileServerHelper";
import { BaseUtils } from "@/test/BaseUtils";
import { PROFILES } from "@/test/SeedData";
import { OPERATION_ENVELOPE_SCHEMA_VERSION } from "@/types/OperationEnvelope";

// Public Objects ------------------------------------------------------------

describe("/api/profile", () => {

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
    const operationId = "11111111-1111-4111-8111-111111111111";
    const request = new NextRequest("http://example.test/api/profile", {
      body: JSON.stringify(makeEnvelope(operationId, {})),
      method: "PUT",
    });

    const response = await PUT(request);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("This Profile is not signed in");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(typeof payload.serverTimestamp).toBe("string");
    expect(payload.status).toBe(401);
  });

  it("updates the signed-in profile", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const operationId = "22222222-2222-4222-8222-222222222222";
    const request = new NextRequest("http://example.test/api/profile", {
      body: JSON.stringify(makeEnvelope(operationId, {
        name: "Updated Name From Route",
      })),
      method: "PUT",
    });

    const response = await PUT(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.accepted).toBe(true);
    expect(payload.data.id).toBe(profile!.id);
    expect(payload.data.name).toBe("Updated Name From Route");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(false);
    expect(typeof payload.serverTimestamp).toBe("string");
  });

  it("replays updateProfile for matching operation envelope", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const operationId = "33333333-3333-4333-8333-333333333333";
    const payload: ProfileUpdateSchemaType = {
      name: "Route Replay Profile Name",
    };
    const firstRequest = new NextRequest("http://example.test/api/profile", {
      body: JSON.stringify(makeEnvelope(operationId, payload)),
      method: "PUT",
    });
    const secondRequest = new NextRequest("http://example.test/api/profile", {
      body: JSON.stringify(makeEnvelope(operationId, payload)),
      method: "PUT",
    });

    const firstResponse = await PUT(firstRequest);
    const firstPayload = await firstResponse.json();
    const secondResponse = await PUT(secondRequest);
    const secondPayload = await secondResponse.json();
    const operationRecords = await db.operationRecord.count({
      where: {
        actorProfileId: profile!.id,
        operationId,
      },
    });

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(secondPayload).toEqual(firstPayload);
    expect(operationRecords).toBe(1);
  });

  it("rejects updateProfile when the operation payload changes for the same operationId", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const operationId = "44444444-4444-4444-8444-444444444444";
    const firstRequest = new NextRequest("http://example.test/api/profile", {
      body: JSON.stringify(makeEnvelope(operationId, {
        name: "First Route Profile Name",
      })),
      method: "PUT",
    });
    const secondRequest = new NextRequest("http://example.test/api/profile", {
      body: JSON.stringify(makeEnvelope(operationId, {
        name: "Second Route Profile Name",
      })),
      method: "PUT",
    });

    await PUT(firstRequest);
    const conflictResponse = await PUT(secondRequest);
    const conflictPayload = await conflictResponse.json();

    expect(conflictResponse.status).toBe(409);
    expect(conflictPayload.accepted).toBe(false);
    expect(conflictPayload.error).toBe("Operation payload does not match existing operationId");
    expect(conflictPayload.operationId).toBe(operationId);
    expect(conflictPayload.rejected).toBe(true);
    expect(typeof conflictPayload.serverTimestamp).toBe("string");
    expect(conflictPayload.status).toBe(409);
  });

  it("rejects mismatched operationType envelopes", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const operationId = "55555555-5555-4555-8555-555555555555";
    const request = new NextRequest("http://example.test/api/profile", {
      body: JSON.stringify(makeEnvelope(operationId, {
        name: "Wrong Type Profile Name",
      }, "createItem")),
      method: "PUT",
    });

    const response = await PUT(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("Operation type 'createItem' is invalid for this route");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
  });

  it("rejects envelopes with invalid schemaVersion", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    setProfile(profile);
    const operationId = "66666666-6666-4666-8666-666666666666";
    const request = new NextRequest("http://example.test/api/profile", {
      body: JSON.stringify({
        ...makeEnvelope(operationId, {
          name: "Bad Schema Version Profile Name",
        }),
        schemaVersion: 999,
      }),
      method: "PUT",
    });

    const response = await PUT(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("Request body must be a valid operation envelope");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
  });

});

// Private Objects -----------------------------------------------------------

function makeEnvelope(
  operationId: string,
  payload: ProfileUpdateSchemaType,
  operationType: "createItem" | "updateProfile" = "updateProfile",
) {
  return {
    clientTimestamp: new Date("2026-06-14T00:00:00.000Z"),
    operationId,
    operationType,
    payload,
    schemaVersion: OPERATION_ENVELOPE_SCHEMA_VERSION,
  };
}

