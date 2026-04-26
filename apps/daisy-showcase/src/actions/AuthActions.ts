"use server";

/**
 * Fake authentication actions for example purposes.
 */

// External Modules ----------------------------------------------------------

import { ActionResult } from "@repo/daisy-form/ActionResult";
import { serverLogger as logger } from "@repo/shared-utils/ServerLogger";

// Internal Modules ----------------------------------------------------------

import { Profile } from "@/types/types";
import { type SignInSchemaType } from "@/zod-schemas/SignInSchema";
import { type SignUpSchemaType } from "@/zod-schemas/SignUpSchema";

// Public Objects ------------------------------------------------------------

/**
 * Perform the sign in action.
 */
export async function doSignInAction(formData: SignInSchemaType): Promise<ActionResult<Profile>> {

  logger.info({
    context: "doSignInAction.input",
    email: formData.email,
    password: formData.password,
  });

  const profile = database.get(formData.email);
  if (profile && profile.password === formData.password) {
    logger.info({context: "doSignInAction.success" });
    currentProfile = profile; // Set the current profile to the signed in one
    return { model: { ...profile, password: "*REDACTED*" } };
  } else {
    logger.info({context: "doSignInAction.failed"});
    return { message: "Invalid email or password" };
  }

}

/**
 * Perform the sign out action.
 */
export async function doSignOutAction(): Promise<ActionResult<null>> {

  logger.info({context: "doSignOutAction"});
  currentProfile = null; // Clear the current profile
  // In a real application, you would clear the session or token here.
  return { model: null };
}

/**
 * Perform the sign up action.
 */
export async function doSignUpAction(formData: SignUpSchemaType): Promise<ActionResult<Profile>> {

  logger.info({
    context: "doSignUpAction.input",
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    password: formData.password,
  });

  if (database.has(formData.email)) {
    logger.info({context: "doSignUpAction.emailExists"});
    return { message: "Email already exists" };
  }

  const profile: Profile = {
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    password: formData.password, // In a real application, you would hash the password
  }
  database.set(formData.email, profile);
  logger.info({context: "doSignUpAction.success"});
  currentProfile = profile; // Set the current profile to the newly created one
  return {model: profile};

}

let currentProfile: Profile | null = null;

/**
 * Return the current profile if one is signed in, or null if not.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  return currentProfile;
}

// Private Objects -----------------------------------------------------------

/**
 * Our fake database of Profiles, keyed by email.
 */
const database = new Map<string, Profile>;
database.set("first@example.com", {
  email: "first@example.com",
  firstName: "First",
  lastName: "User",
  password: "first",
});
database.set("second@example.com", {
  email: "second@example.com",
  firstName: "Second",
  lastName: "User",
  password: "second",
});
database.set("third@example.com", {
  email: "third@example.com",
  firstName: "Third",
  lastName: "User",
  password: "third",
});
