---
name: project-map
description: Create or incrementally update a compact root PROJECT-MAP.md that helps humans and coding agents navigate an unfamiliar repository. Use only when the user explicitly asks for a project map or map update.
---

# Project Map

## Purpose

Maintain a short root-level `PROJECT-MAP.md` that helps select the next useful code context. A project map is a semantic index for cold-start navigation. It is not a file inventory, architecture review, migration proposal, or substitute for reading source code.

Run this skill only when a user explicitly asks to create, generate, update, or refresh a project map. Do not invoke it automatically from other skills.

## First creation

1. Check whether root `PROJECT-MAP.md` exists.
2. If it does not exist, perform one minimal global scan of project configuration, source roots, runtime entry points, first-level business modules, and core platform/data paths.
3. Ignore dependencies, build output, caches, version-control metadata, generated content, environment files, logs, and files that may contain sensitive information.
4. Keep only facts that help an agent choose what to read next.

## Incremental update

1. Read the existing map first.
2. Inspect only the user-provided change scope and the direct files needed to verify whether high-value navigation facts changed.
3. Update module paths, entry points, or major request/data paths only when they actually changed.
4. If no high-value fact changed, leave the map untouched and explain why.

## Required format

Keep the map concise, usually near 100 lines or fewer.

```markdown
# <Project name> Project Map

> One sentence: <project purpose + primary technology or runtime form>

## Module navigation

| Path | Responsibility | Main entry point / key dependency |
| --- | --- | --- |
| `<path>` | <responsibility> | <entry point, upstream, or downstream> |

## Primary request / data paths

1. `<entry> -> <key processing module> -> <data source or output>`
```

Keep only one to three high-frequency or structurally revealing paths.

## Inclusion rules

Include:

- project purpose and runtime shape;
- real source and application entry points;
- stable business modules and their responsibilities;
- shared platform capabilities that affect many tasks;
- a small number of key request, data, or event paths;
- special runtime entry points such as workers, CLI commands, or native clients.

Exclude:

- per-file, class, function, field, and test inventories;
- secrets, tokens, private addresses, or environment values;
- technical-debt lists, design debates, or refactoring proposals;
- dependencies, build products, caches, logs, and generated directories.

## Completion response

State whether this was a first creation or incremental update, which navigation facts changed, and the map path. Do not run build, tests, lint, deployment, or browser validation as part of mapping.
