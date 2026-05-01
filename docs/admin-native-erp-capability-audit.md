# Admin-Native ERP Capability Audit

Date: 2026-05-01

## Purpose

This audit complements:

- [mobile-screen-to-admin-operations-audit.md](/home/ntumai/web/admin.ntumai.com/docs/mobile-screen-to-admin-operations-audit.md)

That mobile-first audit answers:

- what staff need in admin to manage user-facing mobile workflows

This audit answers the second half of the picture:

- what staff need in admin even when the feature is not a direct mirror of a mobile screen

In other words, this document covers the ERP and control-plane capabilities of the admin itself:

- staff authentication
- staff roles and permissions
- authorization and access control
- platform settings and rule management
- audit logs and governance
- system health and observability
- reporting and analytics
- content and policy management
- app version and release control
- staff profile, password, and notification settings
- route integrity and admin workspace completeness

## Method

- `ntumaiDocs` MCP was attempted first per `AGENTS.md`
- it failed again in this session with the same initialization handshake error
- this audit therefore uses direct source inspection of the current Next.js admin codebase

Primary sources inspected:

- `src/layouts/hydrogen/menu-items.tsx`
- `src/config/routes.ts`
- `src/components/auth/auth-provider.tsx`
- `src/components/auth/auth-shell.tsx`
- `src/repositories/admin/admin-auth.ts`
- `src/repositories/admin/admin-session.ts`
- `src/app/roles-permissions/page.tsx`
- `src/repositories/admin/platform-access.ts`
- `src/components/platform/roles-permissions-data.ts`
- `src/app/platform/admin-activity-logs/page.tsx`
- `src/app/platform/system-health/page.tsx`
- `src/app/platform/reports-analytics/page.tsx`
- `src/app/platform/content-management/page.tsx`
- `src/app/platform/settings/page.tsx`
- `src/app/platform/app-version-control/page.tsx`
- `src/app/profile-settings/*`
- `src/app/signin/page.tsx`
- `src/app/access-denied/page.tsx`

## Executive Conclusion

The admin already has the shape of a real ERP/control platform, but much of that shape is still aspirational.

The strongest admin-native capabilities today are:

- dedicated admin sign-in
- stored admin session handling
- staff role and staff user CRUD
- broad admin workspace structure and information architecture

The weakest admin-native capabilities today are:

- route-level authorization enforcement
- real permission modeling
- audit logging
- system observability
- platform configuration management
- reporting and analytics
- content and policy publishing
- app release/version control
- staff profile/security/preferences persistence
- route/menu completeness

Short version:

- the admin can now authenticate staff and expose a live staff-access module
- but most of the surrounding ERP control-plane pages are still static shells rather than operational systems

## What “Full ERP For Staff” Means Here

For Ntumai, an ERP-like admin does not mean generic accounting software.

It means one internal workspace where staff can:

- sign in as staff, not as consumer users
- be granted scoped access to specific operational domains
- be blocked from domains they should not access
- leave auditable traces of sensitive actions
- monitor the health of integrations and background jobs
- manage operating rules without unsafe ad hoc edits
- publish support/help/policy content
- manage app releases and version gates
- inspect reports and operational performance
- manage their own admin account safely

That control-plane layer is required even if none of those pages correspond to a mobile screen.

## Capability Inventory

### 1. Staff Authentication And Session Management

#### What exists

- dedicated admin sign-in flow in `src/app/signin/page.tsx`
- auth context in `src/components/auth/auth-provider.tsx`
- route gate shell in `src/components/auth/auth-shell.tsx`
- local admin session storage in `src/repositories/admin/admin-session.ts`
- dedicated admin auth API repository in `src/repositories/admin/admin-auth.ts`

#### What works

- staff sign-in is separated from consumer-facing login UX
- the admin restores the last route after authentication
- admin routes are globally protected from unauthenticated access

#### What is still missing

- no visible session-management screen for admins to review/revoke their sessions
- no visible “who signed in when” page
- no staff MFA policy management beyond current OTP flow
- no forced sign-out or emergency session revocation UI
- no admin lockout, login anomaly, or auth diagnostics surface

#### Status

- `Mostly done` for basic staff authentication
- `Not done` for admin-grade auth operations and session governance

### 2. Staff Roles, Users, And Access Management

#### What exists

- `src/app/roles-permissions/page.tsx`
- `src/components/platform/roles-grid.tsx`
- `src/components/platform/roles-users-table.tsx`
- live repository integration in `src/repositories/admin/platform-access.ts`

#### What works

- staff roles can be listed from live admin endpoints
- staff users can be listed from live admin endpoints
- create, edit, and delete actions exist for staff roles and staff users
- there is a real dedicated staff-access area in the admin

#### What is still missing

- permission model is still extremely thin in the local UI contract:
  - `Read`
  - `Write`
  - `Delete`
- this is not enough for real Ntumai ops separation
- there are no domain-specific capabilities like:
  - `support.reply`
  - `support.resolve`
  - `dispatch.reassign`
  - `payout.approve`
  - `risk.suspend_user`
  - `marketplace.publish_vendor`
  - `settings.change_pricing_rule`
- no clear staff team model
- no approval workflow for sensitive access grants
- no clear temporary access, delegated access, or emergency access controls
- `platform/admin-users` is not an independent module; it just redirects to `roles-permissions`

#### Important structural gap

The admin has staff access CRUD, but not yet a mature IAM model.

#### Status

- `Partly done`

### 3. Authorization Enforcement And Access Boundaries

#### What exists

- `src/components/auth/auth-shell.tsx` protects routes from unauthenticated users
- `src/app/access-denied/page.tsx` exists as a 403 page

#### What is missing

- there is no evidence of route-level permission enforcement beyond “authenticated or not”
- `AuthShell` checks `isAuthenticated`, but does not appear to enforce per-role or per-permission route access
- the `access-denied` page exists, but there is no visible authorization system routing staff there
- no evidence of feature-level gating in platform, finance, risk, support, or dispatch pages

#### Practical implication

A real ERP admin needs at least three layers:

- authenticated
- authorized for a module
- authorized for a sensitive action within that module

The current admin appears to have only the first layer implemented consistently.

#### Status

- `Not done`

### 4. Admin Activity Logs And Governance

#### What exists

- `src/app/platform/admin-activity-logs/page.tsx`

#### What it currently is

- static governance-themed page content
- no repository integration
- no real event stream
- no searchable audit ledger
- no real actor/action/resource log rows

#### What a full admin needs here

- actor
- timestamp
- action type
- before/after change
- affected entity
- approval linkage
- IP/device/session context
- exportable audit history
- immutable history for sensitive actions

#### Priority examples

- payout approval trail
- refund decision trail
- support escalation and dispute decisions
- user restriction and reinstatement actions
- staff access changes
- platform settings changes

#### Status

- `Not done`

### 5. System Health And Observability

#### What exists

- `src/app/platform/system-health/page.tsx`

#### What it currently is

- static `section-data` driven page
- no live health repository
- no backend/system polling
- no real alert feed

#### What a full admin needs here

- payment provider health
- push/SMS/email health
- queue and retry health
- maps/geocoding/routing health
- websocket/socket health
- background job health
- error spikes
- degraded dependency watch

This page matters because dispatch, onboarding, payouts, notifications, and tracking all depend on infrastructure health.

#### Status

- `Not done`

### 6. Reports And Analytics

#### What exists

- `src/app/platform/reports-analytics/page.tsx`

#### What it currently is

- static `section-data` page
- no live reporting repository
- no saved dashboards
- no export logic
- no scheduled report engine

#### What a full admin needs here

- operations reporting
- marketplace reporting
- support KPI reporting
- payout/refund reporting
- risk/compliance reporting
- cohort and retention reporting
- executive rollups
- export scheduling
- report ownership and definitions

#### Status

- `Not done`

### 7. Platform Settings And Rule Management

#### What exists

- `src/app/platform/settings/page.tsx`

#### What it currently is

- static page describing settings domains
- no live configuration repository
- no real change/save workflow
- no approval pipeline

#### What a full admin needs here

- market and city settings
- pricing rules
- cancellation/refund rules
- operational thresholds
- provider credentials and failover config
- trust-and-safety rule tuning
- rollout-safe change management

#### Critical requirement

Settings in an operational ERP should not be editable as untracked arbitrary form state. They need:

- versioning
- review
- approval
- rollback
- environment awareness
- audit logging

#### Status

- `Not done`

### 8. Content Management And Policy Publishing

#### What exists

- `src/app/platform/content-management/page.tsx`
- support template pages exist separately under `support/templates`

#### What it currently is

- platform content management page is static
- no live content repository for banners/help/policy pages
- support templates exist as a separate concept, but are not the same thing as platform content management

#### What a full admin needs here

- FAQ/help center publishing
- legal/policy version publishing
- homepage/banner management
- campaign copy management
- publish states and schedules
- reviewer approval
- localization or market variants

#### Status

- `Not done`

### 9. App Version Control And Release Management

#### What exists

- `src/app/platform/app-version-control/page.tsx`

#### What it currently is

- static page
- no live release tracks
- no version policy store
- no feature-gate control
- no forced-update control

#### Why this matters operationally

Ntumai already has mobile role-specific behavior. Release control is not optional if the admin is meant to manage:

- forced upgrades
- staged rollouts
- version-gated features
- rollout holds
- role-specific mobile stability risk

#### Status

- `Not done`

### 10. Staff Profile, Password, And Notification Preferences

#### What exists

- `src/app/profile-settings/profile/page.tsx`
- `src/app/profile-settings/password/page.tsx`
- `src/app/profile-settings/notification/page.tsx`

#### What they currently are

- presentational forms
- no live repository integration
- no save wiring to a staff profile backend
- no real password change handler visible in the admin source
- no real notification preference persistence visible in the admin source

#### Why this still matters

Even if these are not mobile-workflow pages, staff rely on them for:

- account hygiene
- security
- notification routing
- personal admin identity

#### Status

- `Not done`

### 11. Access-Denied, Workspace Shell, And Route Experience

#### What exists

- `src/app/access-denied/page.tsx`
- route menu architecture in `src/layouts/hydrogen/menu-items.tsx`
- route map in `src/config/routes.ts`

#### What works

- the admin has a coherent top-level information architecture
- the workspace is clearly organized into:
  - operations
  - commerce
  - risk/support
  - growth
  - platform

#### What is still missing

- authorization routing into `access-denied`
- route integrity is incomplete in places
- some configured menu destinations do not currently exist as pages

Confirmed route/menu integrity gap:

- `routes.fleet.driverIncentives`
- `routes.fleet.driverPayouts`

These routes are present in config/menu, but no matching page files were found under `src/app/fleet`.

#### Status

- `Partly done`

### 12. Search, Discoverability, And Internal Workflow Navigation

#### What exists

- search components exist:
  - `src/components/search/search.tsx`
  - `src/components/search/search-list.tsx`
- menus and workflow links exist widely across the UI

#### What is still unclear or missing

- no evidence of cross-entity global search over live admin resources
- no evidence of saved views or personal worklists
- no evidence of “recently opened records” or staff bookmarks
- no evidence of assignment-based landing queues

For a staff ERP, search is not decoration. It is a core productivity tool.

#### Status

- `Partly done` structurally
- `Not done` as a real live capability

## Capability Matrix

| Capability | Why it matters | Current state |
| --- | --- | --- |
| Admin sign-in | staff must authenticate separately from consumers | `Mostly done` |
| Stored admin session | restores staff workspace continuity | `Mostly done` |
| Staff roles/users | foundation of internal access control | `Partly done` |
| Fine-grained authorization | prevents unsafe access and action execution | `Not done` |
| Access denied flow | required for real authorization boundaries | `Present but not wired end-to-end` |
| Audit logs | governance, finance, risk, and security traceability | `Not done` |
| System health | lets staff trust and operate the platform safely | `Not done` |
| Reports and analytics | needed for management, diagnosis, planning | `Not done` |
| Platform settings | needed for real operating-rule control | `Not done` |
| Content management | needed for policy/help/growth surfaces | `Not done` |
| App version control | needed for mobile release governance | `Not done` |
| Staff profile/security/preferences | needed for day-to-day admin use | `Not done` |
| Route/menu completeness | needed for workspace credibility and reliability | `Partly done` |
| Global search/worklists | needed for admin productivity at scale | `Partly done structurally, not done live` |

## Key Cross-Cutting Findings

### 1. The admin has real authentication, but not real authorization yet

This is the most important non-mobile finding.

The admin can sign staff in, but there is not yet clear route/action enforcement of who is allowed to do what.

### 2. Staff access exists, but the permission model is too generic

`Read / Write / Delete` is not enough for a multi-team operational platform.

Ntumai needs domain and action-specific permissions.

### 3. Platform pages are mostly shells

The platform section is conceptually correct, but most of it is still:

- static
- descriptive
- placeholder-oriented

rather than backed by live repositories and real mutation workflows.

### 4. The admin ERP picture is broader than the currently implemented code

The route architecture already assumes a future internal platform with:

- governance
- release ops
- platform observability
- reporting
- configuration management

but the actual implementation is much thinner than that vision.

### 5. Menu integrity already shows future-planning drift

When routes exist in config/menu but do not exist as pages, it usually means the IA got ahead of implementation.

That is fine early on, but it should be audited now so staff do not inherit dead surfaces.

## What Should Exist In The Final Full Picture

Combining this audit with the mobile-derived workflow audit, a full Ntumai admin ERP should have these layers:

### Layer 1: Staff Identity And Workspace Control

- admin sign-in
- session security
- staff users
- roles
- fine-grained permissions
- access denied flows
- account/profile/password/preferences

### Layer 2: Governance And Safety

- audit logs
- approval trails
- sensitive-action review
- policy-backed settings changes
- emergency access and revocation

### Layer 3: Platform Control Plane

- system health
- provider/integration health
- queue health
- release/version management
- environment-aware configuration

### Layer 4: Business Intelligence And Publishing

- reports
- analytics
- scheduled exports
- content/help/policy publishing

### Layer 5: Workflow Operations

- the mobile-derived operations modules:
  - onboarding
  - KYC
  - dispatch
  - bookings
  - support
  - payouts
  - risk/compliance
  - vendor/store operations

## Recommended Next Audit/Build Sequence

Before implementation planning, the next sequence should be:

1. merge this admin-native audit with the mobile workflow audit into one capability map
2. separate capabilities into:
   - `staff platform foundation`
   - `workflow operations`
3. mark each capability:
   - `done`
   - `partial`
   - `static shell`
   - `missing`
4. then build a single roadmap where foundation and workflow work can progress in the right order

Recommended admin-foundation priority:

1. fine-grained authorization model
2. route/action permission enforcement
3. audit logs
4. system health
5. platform settings with change control
6. app version control
7. reports and analytics
8. content management
9. staff account settings persistence
10. route/menu cleanup for missing or alias-only pages

## Final Judgment

If the mobile audit shows what staff need to manage the business, this audit shows what staff need in order to safely use the admin itself as a serious internal platform.

Today:

- the admin has a real shell
- it has real admin auth
- it has a partial staff access module

but the deeper ERP/control-plane capabilities are still mostly unimplemented.

So the honest full-picture assessment is:

- `workflow admin`: partial
- `ERP foundation for staff`: early
- `architecture direction`: correct
- `operational completeness`: not there yet
