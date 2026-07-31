/**
 * E2E tests for the Category create route.
 */

// External Imports ----------------------------------------------------------

import { dbShopShop as db } from "@repo/db-shopshop";
import { MemberRole } from "@repo/db-shopshop/enums";
import { CategoryCreateSchemaType } from "@repo/db-shopshop/zod-schemas/CategorySchema";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Imports ----------------------------------------------------------

import { POST } from "@/app/api/(actions)/category/route";
import { lookupListByRole } from "@/lib/ListHelpers";
import { lookupProfileByEmail } from "@/lib/ProfileHelpers";
import { setProfile } from "@/lib/ProfileServerHelper";
import { BaseUtils } from "@/test/BaseUtils";
import { PROFILES } from "@/test/SeedData";
import { OPERATION_ENVELOPE_SCHEMA_VERSION } from "@/types/OperationEnvelope";

// Public Objects ------------------------------------------------------------

describe("/api/category", () => {

  // Test Hooks --------------------------------------------------------------

  const utils = new BaseUtils();

  beforeEach(async () => {
    setProfile(null);
    await utils.loadData({
      withLists: true,
      withMembers: true,
      withProfiles: true,
    });
  });

  // Test Cases --------------------------------------------------------------

  it("returns an authentication error for unsigned callers", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.GUEST);
    const operationId = "11111111-1111-4111-8111-111111111111";
    const request = new NextRequest("http://example.test/api/category", {
      body: JSON.stringify(makeEnvelope(operationId, {
        listId: list!.id,
        name: "Route Category",
      })),
      method: "POST",
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("This Profile is not signed in");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(typeof payload.serverTimestamp).toBe("string");
    expect(payload.status).toBe(401);
  });

  it("creates a category for a signed-in member", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "22222222-2222-4222-8222-222222222222";
    const request = new NextRequest("http://example.test/api/category", {
      body: JSON.stringify(makeEnvelope(operationId, {
        listId: list!.id,
        name: "Route Category",
      })),
      method: "POST",
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.accepted).toBe(true);
    expect(payload.data.listId).toBe(list!.id);
    expect(payload.data.name).toBe("Route Category");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(false);
    expect(typeof payload.serverTimestamp).toBe("string");
  });

  it("replays createCategory for matching operation envelope", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "33333333-3333-4333-8333-333333333333";
    const payload: CategoryCreateSchemaType = {
      listId: list!.id,
      name: "Route Category Replay",
    };
    const countBefore = await db.category.count({
      where: {
        listId: list!.id,
        name: payload.name,
      },
    });
    const firstRequest = new NextRequest("http://example.test/api/category", {
      body: JSON.stringify(makeEnvelope(operationId, payload)),
      method: "POST",
    });
    const secondRequest = new NextRequest("http://example.test/api/category", {
      body: JSON.stringify(makeEnvelope(operationId, payload)),
      method: "POST",
    });

    const firstResponse = await POST(firstRequest);
    const firstPayload = await firstResponse.json();
    const secondResponse = await POST(secondRequest);
    const secondPayload = await secondResponse.json();
    const countAfter = await db.category.count({
      where: {
        listId: list!.id,
        name: payload.name,
      },
    });

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(secondPayload).toEqual(firstPayload);
    expect(countAfter).toBe(countBefore + 1);
  });

  it("rejects createCategory when the operation payload changes for the same operationId", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "44444444-4444-4444-8444-444444444444";
    const firstRequest = new NextRequest("http://example.test/api/category", {
      body: JSON.stringify(makeEnvelope(operationId, {
        listId: list!.id,
        name: "First Route Category",
      })),
      method: "POST",
    });
    const secondRequest = new NextRequest("http://example.test/api/category", {
      body: JSON.stringify(makeEnvelope(operationId, {
        listId: list!.id,
        name: "Second Route Category",
      })),
      method: "POST",
    });

    await POST(firstRequest);
    const conflictResponse = await POST(secondRequest);
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
    const list = await lookupListByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "55555555-5555-4555-8555-555555555555";
    const request = new NextRequest("http://example.test/api/category", {
      body: JSON.stringify(makeEnvelope(operationId, {
        listId: list!.id,
        name: "Wrong Type Category",
      }, "createItem")),
      method: "POST",
    });

    const response = await POST(request);
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
    const list = await lookupListByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "66666666-6666-4666-8666-666666666666";
    const request = new NextRequest("http://example.test/api/category", {
      body: JSON.stringify({
        ...makeEnvelope(operationId, {
          listId: list!.id,
          name: "Bad Schema Version Category",
        }),
        schemaVersion: 999,
      }),
      method: "POST",
    });

    const response = await POST(request);
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
  payload: CategoryCreateSchemaType,
  operationType: "createCategory" | "createItem" = "createCategory",
) {
  return {
    clientTimestamp: new Date("2026-06-14T00:00:00.000Z"),
    operationId,
    operationType,
    payload,
    schemaVersion: OPERATION_ENVELOPE_SCHEMA_VERSION,
  };
}

