# @repo/testing-react

Shared React testing helpers for the monorepo.

## Exports

- renderWithProviders
- createTestQueryClient
- server (MSW server)

## Usage

- Add `@repo/testing-react` as a devDependency (workspace:*)
- Configure your package's `vitest.config.ts` using `reactBase` from `@repo/vitest-config` (recommended). `reactBase` is pre-configured for `jsdom` and the shared setup file from `@repo/testing-react`.
- In tests, `import { renderWithProviders, userEvent, server } from '@repo/testing-react';`

## Examples

### Extend Shared Vitest Config in a Package

```ts
import { reactBase } from '@repo/vitest-config';
import { defineConfig } from 'vitest/config';

const baseTest = ((reactBase as unknown) as Record<string, unknown>).test as
  | Record<string, unknown>
  | undefined;

export default defineConfig({
  ...reactBase,
  test: {
    ...(baseTest || {}),
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
```

If you need to customize setup manually, treat it as an advanced override and keep it aligned with the shared setup provided by `@repo/vitest-config`.

### Use `renderWithProviders` in a Test

```ts
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '@repo/testing-react';

describe('MyComponent', () => {
  it('renders', async () => {
    const { getByText, user } = renderWithProviders(<div>Hello</div>);
    expect(getByText('Hello')).toBeTruthy();
    // user is typed as UserEventLike: click/type/tab/clear
    await user.click(getByText('Hello'));
  });
});
```

## MSW Test Server

- The MSW test server helper is available as a subpath import so it does not pollute the package's top-level public API.

```ts
import { server } from '@repo/testing-react/msw/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

If you prefer, you can also deep-import the file directly from the package `dist` during development (not recommended for published packages):

```ts
import { server } from '@repo/testing-react/dist/msw/server';
```

## Notes

- `renderWithProviders` returns the `user` helper typed as a small `UserEventLike` interface to avoid leaking internal `@testing-library/user-event` types in the package d.ts. If you need fuller typing, import `@testing-library/user-event` directly in your test file.
- The package provides `dist/vitest.setup.js`, and `@repo/vitest-config` (`reactBase`) references it for React tests.

## Compatibility with Vitest and `@testing-library/jest-dom`

This package keeps `@testing-library/jest-dom` as a devDependency even though the name contains "jest". That's intentional: `@testing-library/jest-dom` only provides a set of DOM matchers (e.g. `toBeInTheDocument`) and works fine with Vitest when you explicitly register its matchers with Vitest's `expect`.

Example `vitest.setup.ts` (already included in `dist`):

```ts
/// <reference types="vitest" />
import { beforeAll, afterEach, afterAll, expect } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';
import 'whatwg-fetch';
import { server } from './msw/server';

// Register the jest-dom matchers with Vitest's expect
expect.extend(matchers as any);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Keep `@testing-library/jest-dom` as-is — it's safe and common to use it with Vitest.
