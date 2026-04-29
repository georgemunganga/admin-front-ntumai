# Admin Codebase Architecture

This document is the structure guardrail for the Ntumai admin frontend.

## Goals

- keep route files thin
- keep domain code together
- keep shared UI generic
- avoid heavy browser behavior from global navigation and eager widgets
- make backend wiring incremental instead of forcing repo-wide rewrites

## Folder Rules

### `src/app`

Use route files as entrypoints only.

A route file should usually:
- render one feature page
- redirect to the correct child route
- lazy-load a heavy route widget when needed

Do not place large datasets or reusable workflow logic directly in `page.tsx` unless the page is trivial.

### `src/components/<domain>`

Keep business UI grouped by feature domain:
- `dispatch`
- `fleet`
- `finance`
- `logistics`
- `marketplace`
- `sales`
- `support`

Feature folders may contain:
- page-level components
- domain-local mock data
- local helpers
- route-specific widgets

Example:
- `src/components/dispatch/live-dispatch-map.tsx`
- `src/components/dispatch/live-map.data.ts`

### `src/components/admin`

Only shared admin primitives belong here:
- `page-header`
- `shell-card`
- `stat-card`
- `data-table`
- `status-badge`

If a component starts carrying dispatch, sales, or marketplace rules, move that logic back into the domain folder.

### `src/config`

Keep app-wide configuration here:
- route helpers
- sidebar/menu config

### `docs`

Keep implementation guardrails here:
- workflow audits
- template-source audit
- codebase architecture rules

## Performance Rules

- disable `prefetch` on large always-visible admin navigation by default
- lazy-load heavy widgets such as maps, rich editors, and media-heavy views
- keep page-level client components as small as possible
- prefer route-level code splitting over large global client trees

## Data Rules During UI-First Work

- keep mock data beside the feature it serves
- avoid adding more data into giant global files
- when backend wiring starts, replace feature-local mock data incrementally with feature services/hooks

## Current Good Patterns

- domain folders under `src/components`
- route helpers under `src/config/routes.ts`
- dispatch map lazy-loaded from its route
- dispatch map data moved beside the dispatch feature

## Current Refactor Targets

These are the next structure improvements when time allows:

1. split `src/components/admin/section-data.ts` into domain-local data files
2. keep turning route files into thin wrappers around feature components
3. add feature-level hooks/services when real API wiring starts
4. centralize typed env/config helpers once more integrations are wired
