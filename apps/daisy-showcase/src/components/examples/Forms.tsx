"use client";

/**
 * Static (non-TanStack) examples of daisy-ui form components.
 */

// External Modules ----------------------------------------------------------

import { Card } from "@repo/daisy-ui/Card";
import { Checkbox } from "@repo/daisy-ui/Checkbox";
import { Input } from "@repo/daisy-ui/Input";
import { Select } from "@repo/daisy-ui/Select";
import { Textarea } from "@repo/daisy-ui/Textarea";
import * as React from "react";

import { LoginForm } from "./LoginForm";

// Public Objects ------------------------------------------------------------

export function Forms() {
  return (
    <>
      <section aria-labelledby="generic-form-heading">
        <h2 id="generic-form-heading" className="text-lg font-semibold mb-4">
          Generic Static Form (no TanStack)
        </h2>

        <div className="grid w-full grid-cols-2 gap-4">

          <Card className="w-full">
            <Card.Title className="justify-center">Input Examples</Card.Title>
            <Card.Body>
              <Input
                description="Enter your full name."
                handleChange={() => undefined}
                label="Full Name"
                name="name"
                placeholder="Jane Smith"
                value=""
              />
              <Input
                description="We will never share your email."
                handleChange={() => undefined}
                isInvalid
                errors={<span>Please enter a valid email address.</span>}
                label="Email"
                name="email"
                placeholder="jane@example.com"
                type="email"
                value="not-an-email"
              />
              <Input
                disabled
                handleChange={() => undefined}
                label="Disabled Input"
                name="disabled-input"
                value="read only value"
              />
            </Card.Body>
          </Card>

          <Card className="w-full">
            <Card.Title className="justify-center">Select &amp; Textarea Examples</Card.Title>
            <Card.Body>
              <Select
                description="Choose your preferred contact method."
                handleChange={() => undefined}
                label="Contact Method"
                name="contact-method"
                options={CONTACT_OPTIONS}
                placeholder="Select one…"
                value=""
              />
              <Select
                description="Must choose a country."
                errors={<span>Country is required.</span>}
                handleChange={() => undefined}
                isInvalid
                label="Country"
                name="country"
                options={COUNTRY_OPTIONS}
                placeholder="Select a country…"
                value=""
              />
              <Textarea
                description="Max 500 characters."
                handleChange={() => undefined}
                label="Message"
                name="message"
                placeholder="Type your message here…"
                rows={4}
                value=""
              />
              <Textarea
                errors={<span>Message cannot be empty.</span>}
                handleChange={() => undefined}
                isInvalid
                label="Invalid Textarea"
                name="invalid-textarea"
                value=""
              />
            </Card.Body>
          </Card>

        </div>

        <hr className="my-4" />

        <div className="grid w-full grid-cols-2 gap-4">

          <Card className="w-full">
            <Card.Title className="justify-center">Checkbox Examples</Card.Title>
            <Card.Body>
              <Checkbox
                description="You must agree before submitting."
                handleChange={() => undefined}
                label="I agree to the terms and conditions"
                name="terms"
                value={false}
              />
              <Checkbox
                handleChange={() => undefined}
                label="Subscribe to newsletter"
                name="newsletter"
                value={true}
              />
              <Checkbox
                description="This checkbox has an error."
                errors={<span>You must accept the terms.</span>}
                handleChange={() => undefined}
                isInvalid
                label="Accept required policy"
                name="policy"
                value={false}
              />
              <Checkbox
                disabled
                handleChange={() => undefined}
                label="Disabled Checkbox"
                name="disabled-checkbox"
                value={false}
              />
            </Card.Body>
          </Card>

          <Card className="w-full">
            <Card.Title className="justify-center">Color Variants</Card.Title>
            <Card.Body>
              <Input
                color="primary"
                handleChange={() => undefined}
                label="Primary Input"
                name="primary-input"
                value=""
              />
              <Input
                color="secondary"
                handleChange={() => undefined}
                label="Secondary Input"
                name="secondary-input"
                value=""
              />
              <Input
                color="accent"
                handleChange={() => undefined}
                label="Accent Input"
                name="accent-input"
                value=""
              />
              <Input
                color="error"
                handleChange={() => undefined}
                label="Error-colored Input"
                name="error-input"
                value=""
              />
            </Card.Body>
          </Card>

        </div>

        <hr className="my-4" />

        <section aria-labelledby="tanstack-form-heading" data-testid="tanstack-form-section">
          <h2 id="tanstack-form-heading" className="text-lg font-semibold mb-4">
            TanStack Form Integration
          </h2>

          <Card className="w-full">
            <Card.Title className="justify-center">Login Form (daisy-form)</Card.Title>
            <Card.Body>
              <LoginForm />
            </Card.Body>
          </Card>
        </section>
      </section>
    </>
  );
}

// Private Objects -----------------------------------------------------------

const CONTACT_OPTIONS = [
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "SMS", value: "sms" },
];

const COUNTRY_OPTIONS = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
  { label: "United Kingdom", value: "gb" },
  { label: "Australia", value: "au" },
];


