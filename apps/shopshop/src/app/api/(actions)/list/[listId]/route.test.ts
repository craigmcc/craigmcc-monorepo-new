/**
 * E2E tests for List update/delete routes.
 */

// External Imports ----------------------------------------------------------

import { dbShopShop as db } from "@repo/db-shopshop";
import { MemberRole } from "@repo/db-shopshop/enums";
import { ListUpdateSchemaType } from "@repo/db-shopshop/zod-schemas/ListSchema";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Imports ----------------------------------------------------------

import {
  DELETE,
  PUT,
} from "@/app/api/(actions)/list/[listId]/route";
import { lookupListByRole } from "@/lib/ListHelpers";
import { lookupProfileByEmail } from "@/lib/ProfileHelpers";
import { setProfile } from "@/lib/ProfileServerHelper";
import { BaseUtils } from "@/test/BaseUtils";
import { PROFILES } from "@/test/SeedData";
import { OPERATION_ENVELOPE_SCHEMA_VERSION } from "@/types/OperationEnvelope";

// Public Objects ------------------------------------------------------------

describe("/api/list/[listId]", () => {

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

  it("returns an authentication error for unsigned update callers", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.ADMIN);
    const operationId = "11111111-1111-4111-8111-111111111111";
    const request = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateList", {
        data: {
          name: "Updated Name",
        },
        listId: list!.id,
      })),
      method: "PUT",
    });

    const response = await PUT(request, routeContext(list!.id));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("This Profile is not signed in");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(typeof payload.serverTimestamp).toBe("string");
    expect(payload.status).toBe(401);
  });

  it("updates a list for an ADMIN member", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.ADMIN);
    setProfile(profile);
    const operationId = "22222222-2222-4222-8222-222222222222";
    const request = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateList", {
        data: {
          name: "Updated List From Route",
        },
        listId: list!.id,
      })),
      method: "PUT",
    });

    const response = await PUT(request, routeContext(list!.id));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.accepted).toBe(true);
    expect(payload.data.id).toBe(list!.id);
    expect(payload.data.name).toBe("Updated List From Route");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(false);
    expect(typeof payload.serverTimestamp).toBe("string");
  });

  it("replays updateList with the same operation envelope", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.ADMIN);
    setProfile(profile);
    const operationId = "33333333-3333-4333-8333-333333333333";
    const requestPayload: UpdateListRoutePayload = {
      data: {
        name: "Replay Update Name",
      },
      listId: list!.id,
    };
    const firstRequest = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateList", requestPayload)),
      method: "PUT",
    });
    const secondRequest = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateList", requestPayload)),
      method: "PUT",
    });

    const firstResponse = await PUT(firstRequest, routeContext(list!.id));
    const firstPayload = await firstResponse.json();
    const secondResponse = await PUT(secondRequest, routeContext(list!.id));
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

  it("rejects updateList when payload changes for the same operationId", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.ADMIN);
    setProfile(profile);
    const operationId = "44444444-4444-4444-8444-444444444444";
    const firstRequest = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateList", {
        data: {
          name: "First Route List Name",
        },
        listId: list!.id,
      })),
      method: "PUT",
    });
    const secondRequest = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateList", {
        data: {
          name: "Second Route List Name",
        },
        listId: list!.id,
      })),
      method: "PUT",
    });

    await PUT(firstRequest, routeContext(list!.id));
    const conflictResponse = await PUT(secondRequest, routeContext(list!.id));
    const conflictPayload = await conflictResponse.json();

    expect(conflictResponse.status).toBe(409);
    expect(conflictPayload.accepted).toBe(false);
    expect(conflictPayload.error).toBe("Operation payload does not match existing operationId");
    expect(conflictPayload.operationId).toBe(operationId);
    expect(conflictPayload.rejected).toBe(true);
    expect(typeof conflictPayload.serverTimestamp).toBe("string");
    expect(conflictPayload.status).toBe(409);
  });

  it("rejects updateList envelopes with the wrong operationType", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.ADMIN);
    setProfile(profile);
    const operationId = "55555555-5555-4555-8555-555555555555";
    const request = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteList", {
        listId: list!.id,
      })),
      method: "PUT",
    });

    const response = await PUT(request, routeContext(list!.id));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("Operation type 'deleteList' is invalid for this route");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
  });

  it("rejects updateList envelopes with mismatched listId route parameters", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.ADMIN);
    setProfile(profile);
    const operationId = "66666666-6666-4666-8666-666666666666";
    const request = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateList", {
        data: {
          name: "Route Parameter Mismatch",
        },
        listId: "77777777-7777-4777-8777-777777777777",
      })),
      method: "PUT",
    });

    const response = await PUT(request, routeContext(list!.id));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("Operation payload listId does not match route parameter");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
  });

  it("rejects updateList envelopes with invalid schemaVersion", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.ADMIN);
    setProfile(profile);
    const operationId = "88888888-8888-4888-8888-888888888888";
    const request = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify({
        ...makeEnvelope(operationId, "updateList", {
          data: {
            name: "Bad Schema Version",
          },
          listId: list!.id,
        }),
        schemaVersion: 999,
      }),
      method: "PUT",
    });

    const response = await PUT(request, routeContext(list!.id));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("Request body must be a valid operation envelope");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
  });

  it("deletes a list for an ADMIN member", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.ADMIN);
    setProfile(profile);
    const operationId = "99999999-9999-4999-8999-999999999999";
    const listCountBefore = await db.list.count({
      where: {
        id: list!.id,
      },
    });
    const request = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteList", {
        listId: list!.id,
      })),
      method: "DELETE",
    });

    const response = await DELETE(request, routeContext(list!.id));
    const payload = await response.json();
    const listCountAfter = await db.list.count({
      where: {
        id: list!.id,
      },
    });

    expect(response.status).toBe(200);
    expect(payload.accepted).toBe(true);
    expect(payload.data.id).toBe(list!.id);
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(false);
    expect(typeof payload.serverTimestamp).toBe("string");
    expect(listCountBefore).toBe(1);
    expect(listCountAfter).toBe(0);
  });

  it("replays deleteList with the same operation envelope", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.ADMIN);
    setProfile(profile);
    const operationId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const firstRequest = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteList", {
        listId: list!.id,
      })),
      method: "DELETE",
    });
    const secondRequest = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteList", {
        listId: list!.id,
      })),
      method: "DELETE",
    });

    const firstResponse = await DELETE(firstRequest, routeContext(list!.id));
    const firstPayload = await firstResponse.json();
    const secondResponse = await DELETE(secondRequest, routeContext(list!.id));
    const secondPayload = await secondResponse.json();
    const operationRecords = await db.operationRecord.count({
      where: {
        actorProfileId: profile!.id,
        operationId,
      },
    });
    const listCountAfter = await db.list.count({
      where: {
        id: list!.id,
      },
    });

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(secondPayload).toEqual(firstPayload);
    expect(operationRecords).toBe(1);
    expect(listCountAfter).toBe(0);
  });

  it("rejects deleteList when payload changes for the same operationId", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const firstList = await lookupListByRole(profile!, MemberRole.ADMIN);
    setProfile(profile);
    const secondList = await db.list.create({
      data: {
        members: {
          create: {
            profileId: profile!.id,
            role: MemberRole.ADMIN,
          },
        },
        name: "Second Admin List",
      },
    });
    const operationId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
    const firstRequest = new NextRequest(`http://example.test/api/list/${firstList!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteList", {
        listId: firstList!.id,
      })),
      method: "DELETE",
    });
    const secondRequest = new NextRequest(`http://example.test/api/list/${secondList.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteList", {
        listId: secondList.id,
      })),
      method: "DELETE",
    });

    await DELETE(firstRequest, routeContext(firstList!.id));
    const conflictResponse = await DELETE(secondRequest, routeContext(secondList.id));
    const conflictPayload = await conflictResponse.json();
    const secondListCount = await db.list.count({
      where: {
        id: secondList.id,
      },
    });

    expect(conflictResponse.status).toBe(409);
    expect(conflictPayload.accepted).toBe(false);
    expect(conflictPayload.error).toBe("Operation payload does not match existing operationId");
    expect(conflictPayload.operationId).toBe(operationId);
    expect(conflictPayload.rejected).toBe(true);
    expect(conflictPayload.status).toBe(409);
    expect(secondListCount).toBe(1);
  });

  it("rejects deleteList envelopes with invalid schemaVersion", async () => {
    const profile = await lookupProfileByEmail(PROFILES[1]!.email!);
    const list = await lookupListByRole(profile!, MemberRole.ADMIN);
    setProfile(profile);
    const operationId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
    const request = new NextRequest(`http://example.test/api/list/${list!.id}`, {
      body: JSON.stringify({
        ...makeEnvelope(operationId, "deleteList", {
          listId: list!.id,
        }),
        schemaVersion: 999,
      }),
      method: "DELETE",
    });

    const response = await DELETE(request, routeContext(list!.id));
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

type DeleteListRoutePayload = {
  listId: string;
};

type UpdateListRoutePayload = {
  data: ListUpdateSchemaType;
  listId: string;
};

function makeEnvelope(
  operationId: string,
  operationType: "deleteList" | "updateList",
  payload: DeleteListRoutePayload | UpdateListRoutePayload,
) {
  return {
    clientTimestamp: new Date("2026-06-14T00:00:00.000Z"),
    operationId,
    operationType,
    payload,
    schemaVersion: OPERATION_ENVELOPE_SCHEMA_VERSION,
  };
}

function routeContext(listId: string) {
  return {
    params: Promise.resolve({ listId }),
  };
}

