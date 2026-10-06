---
name: context-first-code
description: Execute well-scoped coding work with minimal necessary context, minimal correct diffs, and explicit real-environment validation handoff. Use for project-specific implementation, diagnosis, clarification, and fixes that do not require architectural migration.
---

# Context-First Code

## Purpose

Use this workflow for fast, safe collaboration on local implementation work. The human supplies goals, constraints, business decisions, and real-environment evidence. The agent reads only the facts that can change the implementation decision, then makes the smallest correct change.

This workflow is not for directory migration, module boundary redesign, broad file moves, or architecture refactoring. Use `ai-friendly-refactor` for those tasks.

## Decision boundary

Humans decide:

- business objective, acceptance criteria, priorities, and risk tolerance;
- module ownership, public-contract changes, and compatibility policy;
- release readiness and final validation in the target environment.

The agent executes:

- locating the requested implementation and its direct dependencies;
- incremental code generation and deterministic bulk edits;
- minimal fixes based on real errors, logs, or failed tests supplied by the user;
- concise change and verification handoff.

When business or compatibility choices cannot be inferred from the request and code, ask only the necessary clarification. Do not invent product decisions.

## Context protocol

For project-specific work, first read the root `PROJECT-MAP.md` once if it exists and has not already been loaded in the current task. Use it only to choose where to start; source code remains the implementation truth.

Read in this order:

```text
user goal and constraints
  -> named file or matching business module
  -> target component/function/endpoint
  -> direct callers and direct dependencies
  -> required types, configuration, and real error evidence
```

Do not make full-repository scanning, broad directory listing, all-test reading, build artifact inspection, or historical exploration a routine step. Expand context only when a missing fact blocks a correct implementation.

## Minimal correct diff

Default to the shortest change that satisfies the confirmed request:

- reuse project conventions, standard libraries, and installed dependencies;
- edit only the target implementation plus required contracts, callers, or configuration;
- preserve public behavior and external contracts unless the user explicitly approves a change;
- do not add speculative abstractions, one-implementation interfaces, future configuration, unrelated cleanup, or new dependencies without need;
- keep business-private code inside its owning module;
- if a business source file becomes too large, split only along clear responsibility boundaries and preserve its public behavior.

If the necessary work changes module boundaries, moves many files, modifies public contracts, or requires an architectural choice, stop and switch to `ai-friendly-refactor`.

## Validation boundary

Do not run build, tests, lint, formatting, services, or simulation loops by default. A local green result is not equivalent to validation with real credentials, devices, data, permissions, network dependencies, or deployment configuration.

Instead:

1. re-read the edited area once;
2. state what changed and what should be validated in the target environment;
3. when the user supplies a real build, runtime, or test failure, read the smallest context necessary and make a targeted repair.

Never bypass hooks, weaken checks, hard-code secrets, or modify unrelated configuration merely to make validation appear successful.

## Completion response

Keep the final response concise:

- changed behavior and key files;
- contract or compatibility impact, if any;
- validation handoff; if none was run, state: `No build, test, or lint was run; validate in the target environment.`
- commit status only when the host environment explicitly requires or supports automatic commits.

## Examples

- “Add a required field to the existing form.” -> Read the form, its submit contract, direct consumer, and relevant type; make the smallest compatible change.
- “Here is a real TypeScript error after your change.” -> Read the error and the direct symbols it names; repair only the conflict.
- “Move all order code into a new module.” -> Do not start editing; use `ai-friendly-refactor` and produce a plan first.
