---
name: OpenAPI integer compatibility
description: Compatibility rule for integer-like values in the generated API contract.
---

Use `type: number` instead of `type: integer` for integer-like OpenAPI fields in this workspace, then enforce whole-number constraints in the server and database.

**Why:** The current Orval generator emits `zod.int()` for OpenAPI integer fields, but the API validation package resolves to a Zod version that does not provide that function, causing generated library typechecks to fail.

**How to apply:** Keep minimum and maximum constraints in OpenAPI for client typing, add `Number.isInteger` validation at API boundaries, and use an integer database column or constraint.