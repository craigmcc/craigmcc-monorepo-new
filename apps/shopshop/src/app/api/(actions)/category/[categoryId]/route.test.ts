/**
 * E2E tests for Category update/delete routes.
 */

// External Imports ----------------------------------------------------------

import { dbShopShop as db } from "@repo/db-shopshop";
import { MemberRole } from "@repo/db-shopshop/enums";
import { CategoryUpdateSchemaType } from "@repo/db-shopshop/zod-schemas/CategorySchema";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Imports ----------------------------------------------------------

import {
  DELETE,
  PUT,
} from "@/app/api/(actions)/category/[categoryId]/route";
import { lookupCategoryByRole } from "@/lib/CategoryHelpers";
import { lookupProfileByEmail } from "@/lib/ProfileHelpers";
import { setProfile } from "@/lib/ProfileServerHelper";
import { BaseUtils } from "@/test/BaseUtils";
import { PROFILES } from "@/test/SeedData";
import { OPERATION_ENVELOPE_SCHEMA_VERSION } from "@/types/OperationEnvelope";

// Public Objects ------------------------------------------------------------

describe("/api/category/[categoryId]", () => {

  // Test Hooks --------------------------------------------------------------

  const utils = new BaseUtils();

  beforeEach(async () => {
    setProfile(null);
    await utils.loadData({
      withCategories: true,
      withItems: true,
      withLists: true,
      withMembers: true,
      withProfiles: true,
    });
  });

  // Test Cases --------------------------------------------------------------

  it("returns an authentication error for unsigned update callers", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const category = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    const operationId = "11111111-1111-4111-8111-111111111111";
    const request = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateCategory", {
        categoryId: category!.id,
        data: {
          name: "Updated Name",
        },
      })),
      method: "PUT",
    });

    const response = await PUT(request, routeContext(category!.id));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("This Profile is not signed in");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(typeof payload.serverTimestamp).toBe("string");
    expect(payload.status).toBe(401);
  });

  it("updates a category for a member", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const category = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "22222222-2222-4222-8222-222222222222";
    const request = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateCategory", {
        categoryId: category!.id,
        data: {
          name: "Updated Category From Route",
        },
      })),
      method: "PUT",
    });

    const response = await PUT(request, routeContext(category!.id));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.accepted).toBe(true);
    expect(payload.data.id).toBe(category!.id);
    expect(payload.data.name).toBe("Updated Category From Route");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(false);
    expect(typeof payload.serverTimestamp).toBe("string");
  });

  it("replays updateCategory with the same operation envelope", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const category = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "33333333-3333-4333-8333-333333333333";
    const requestPayload: UpdateCategoryRoutePayload = {
      categoryId: category!.id,
      data: {
        name: "Replay Update Name",
      },
    };
    const firstRequest = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateCategory", requestPayload)),
      method: "PUT",
    });
    const secondRequest = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateCategory", requestPayload)),
      method: "PUT",
    });

    const firstResponse = await PUT(firstRequest, routeContext(category!.id));
    const firstPayload = await firstResponse.json();
    const secondResponse = await PUT(secondRequest, routeContext(category!.id));
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

  it("rejects updateCategory when payload changes for the same operationId", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const category = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "44444444-4444-4444-8444-444444444444";
    const firstRequest = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateCategory", {
        categoryId: category!.id,
        data: {
          name: "First Route Category Name",
        },
      })),
      method: "PUT",
    });
    const secondRequest = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateCategory", {
        categoryId: category!.id,
        data: {
          name: "Second Route Category Name",
        },
      })),
      method: "PUT",
    });

    await PUT(firstRequest, routeContext(category!.id));
    const conflictResponse = await PUT(secondRequest, routeContext(category!.id));
    const conflictPayload = await conflictResponse.json();

    expect(conflictResponse.status).toBe(409);
    expect(conflictPayload.accepted).toBe(false);
    expect(conflictPayload.error).toBe("Operation payload does not match existing operationId");
    expect(conflictPayload.operationId).toBe(operationId);
    expect(conflictPayload.rejected).toBe(true);
    expect(typeof conflictPayload.serverTimestamp).toBe("string");
    expect(conflictPayload.status).toBe(409);
  });

  it("rejects updateCategory envelopes with the wrong operationType", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const category = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "55555555-5555-4555-8555-555555555555";
    const request = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteCategory", {
        categoryId: category!.id,
      })),
      method: "PUT",
    });

    const response = await PUT(request, routeContext(category!.id));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("Operation type 'deleteCategory' is invalid for this route");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
  });

  it("rejects updateCategory envelopes with mismatched categoryId route parameters", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const category = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "66666666-6666-4666-8666-666666666666";
    const request = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "updateCategory", {
        categoryId: "77777777-7777-4777-8777-777777777777",
        data: {
          name: "Route Parameter Mismatch",
        },
      })),
      method: "PUT",
    });

    const response = await PUT(request, routeContext(category!.id));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("Operation payload categoryId does not match route parameter");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
  });

  it("rejects updateCategory envelopes with invalid schemaVersion", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const category = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "88888888-8888-4888-8888-888888888888";
    const request = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify({
        ...makeEnvelope(operationId, "updateCategory", {
          categoryId: category!.id,
          data: {
            name: "Bad Schema Version",
          },
        }),
        schemaVersion: 999,
      }),
      method: "PUT",
    });

    const response = await PUT(request, routeContext(category!.id));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.accepted).toBe(false);
    expect(payload.error).toBe("Request body must be a valid operation envelope");
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(true);
    expect(payload.status).toBe(400);
  });

  it("deletes a category for a member", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const category = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "99999999-9999-4999-8999-999999999999";
    const categoryCountBefore = await db.category.count({
      where: {
        id: category!.id,
      },
    });
    const request = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteCategory", {
        categoryId: category!.id,
      })),
      method: "DELETE",
    });

    const response = await DELETE(request, routeContext(category!.id));
    const payload = await response.json();
    const categoryCountAfter = await db.category.count({
      where: {
        id: category!.id,
      },
    });

    expect(response.status).toBe(200);
    expect(payload.accepted).toBe(true);
    expect(payload.data.id).toBe(category!.id);
    expect(payload.operationId).toBe(operationId);
    expect(payload.rejected).toBe(false);
    expect(typeof payload.serverTimestamp).toBe("string");
    expect(categoryCountBefore).toBe(1);
    expect(categoryCountAfter).toBe(0);
  });

  it("replays deleteCategory with the same operation envelope", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const category = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    const firstRequest = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteCategory", {
        categoryId: category!.id,
      })),
      method: "DELETE",
    });
    const secondRequest = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteCategory", {
        categoryId: category!.id,
      })),
      method: "DELETE",
    });

    const firstResponse = await DELETE(firstRequest, routeContext(category!.id));
    const firstPayload = await firstResponse.json();
    const secondResponse = await DELETE(secondRequest, routeContext(category!.id));
    const secondPayload = await secondResponse.json();
    const operationRecords = await db.operationRecord.count({
      where: {
        actorProfileId: profile!.id,
        operationId,
      },
    });
    const categoryCountAfter = await db.category.count({
      where: {
        id: category!.id,
      },
    });

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(secondPayload).toEqual(firstPayload);
    expect(operationRecords).toBe(1);
    expect(categoryCountAfter).toBe(0);
  });

  it("rejects deleteCategory when payload changes for the same operationId", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const firstCategory = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const list = firstCategory!.listId;
    const secondCategory = await db.category.create({
      data: {
        listId: list,
        name: "Second Category",
      },
    });
    const operationId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
    const firstRequest = new NextRequest(`http://example.test/api/category/${firstCategory!.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteCategory", {
        categoryId: firstCategory!.id,
      })),
      method: "DELETE",
    });
    const secondRequest = new NextRequest(`http://example.test/api/category/${secondCategory.id}`, {
      body: JSON.stringify(makeEnvelope(operationId, "deleteCategory", {
        categoryId: secondCategory.id,
      })),
      method: "DELETE",
    });

    await DELETE(firstRequest, routeContext(firstCategory!.id));
    const conflictResponse = await DELETE(secondRequest, routeContext(secondCategory.id));
    const conflictPayload = await conflictResponse.json();
    const secondCategoryCount = await db.category.count({
      where: {
        id: secondCategory.id,
      },
    });

    expect(conflictResponse.status).toBe(409);
    expect(conflictPayload.accepted).toBe(false);
    expect(conflictPayload.error).toBe("Operation payload does not match existing operationId");
    expect(conflictPayload.operationId).toBe(operationId);
    expect(conflictPayload.rejected).toBe(true);
    expect(conflictPayload.status).toBe(409);
    expect(secondCategoryCount).toBe(1);
  });

  it("rejects deleteCategory envelopes with invalid schemaVersion", async () => {
    const profile = await lookupProfileByEmail(PROFILES[0]!.email!);
    const category = await lookupCategoryByRole(profile!, MemberRole.GUEST);
    setProfile(profile);
    const operationId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
    const request = new NextRequest(`http://example.test/api/category/${category!.id}`, {
      body: JSON.stringify({
        ...makeEnvelope(operationId, "deleteCategory", {
          categoryId: category!.id,
        }),
        schemaVersion: 999,
      }),
      method: "DELETE",
    });

    const response = await DELETE(request, routeContext(category!.id));
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

type DeleteCategoryRoutePayload = {
  categoryId: string;
};

type UpdateCategoryRoutePayload = {
  categoryId: string;
  data: CategoryUpdateSchemaType;
};

function makeEnvelope(
  operationId: string,
  operationType: "deleteCategory" | "updateCategory",
  payload: DeleteCategoryRoutePayload | UpdateCategoryRoutePayload,
) {
  return {
    clientTimestamp: new Date("2026-06-14T00:00:00.000Z"),
    operationId,
    operationType,
    payload,
    schemaVersion: OPERATION_ENVELOPE_SCHEMA_VERSION,
  };
}

function routeContext(categoryId: string) {
  return {
    params: Promise.resolve({ categoryId }),
  };
}

