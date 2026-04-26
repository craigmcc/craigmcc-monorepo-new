/**
 * Forms example component.
 */

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import { SignInForm } from "@/components/forms/SignInForm";
import { SignOutForm } from "@/components/forms/SignOutForm";
import { SignUpForm } from "@/components/forms/SignUpForm";

// Public Objects ------------------------------------------------------------

export function Signups() {
  return (
    <div className="flex gap-8 justify-center">
      <SignUpForm/>
      <SignInForm/>
      <SignOutForm/>
    </div>
  );
}
