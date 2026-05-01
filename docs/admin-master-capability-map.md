# Admin Master Capability Map

Date: 2026-05-01

## Purpose

This document combines the two audit lenses:

- mobile-derived workflow management needs
- admin-native ERP and staff-platform needs

It is the shortest full-picture view of what the Ntumai admin is supposed to become.

Related audits:

- [mobile-screen-to-admin-operations-audit.md](/home/ntumai/web/admin.ntumai.com/docs/mobile-screen-to-admin-operations-audit.md)
- [admin-native-erp-capability-audit.md](/home/ntumai/web/admin.ntumai.com/docs/admin-native-erp-capability-audit.md)
- [admin-feature-gap-report.md](/home/ntumai/web/admin.ntumai.com/docs/admin-feature-gap-report.md)

## Core Idea

The final admin is not just:

- a dashboard
- a CRUD back office
- a mirror of mobile screens

It is two systems combined:

1. a `staff platform foundation`
2. a `workflow operations system`

Both are required.

If workflow operations are built without the staff-platform foundation, the admin becomes unsafe and hard to govern.

If the staff-platform foundation is built without workflow operations, the admin becomes a polished shell with no real operating power.

## The Two Halves

### A. Staff Platform Foundation

This is what staff need in order to safely use the admin as an internal ERP/control plane.

- admin authentication
- staff users
- staff roles
- fine-grained permissions
- route and action authorization
- access denied behavior
- audit logs
- system health
- platform settings
- content and policy publishing
- app version control
- reports and analytics
- staff profile, password, and notification preferences
- search, worklists, and route integrity

### B. Workflow Operations System

This is what staff need in order to run the actual Ntumai business exposed through mobile.

- person and role orchestration
- customer CRM
- vendor onboarding and vendor operations
- tasker onboarding and workforce operations
- KYC review
- marketplace catalog and vendor governance
- marketplace orders
- parcel deliveries and shipments
- errand/task bookings
- dispatch live operations
- dispatch exceptions and manual recovery
- support inbox, tickets, escalations, disputes
- finance operations
- payouts
- refunds
- compliance, safety, and appeals
- notifications and urgent-alert diagnostics
- public tracking oversight

## Capability Status Map

Legend:

- `Done enough`: real live base exists and is operationally meaningful
- `Partial`: some live integration exists, but not enough to run the domain end to end
- `Static shell`: page exists, but mostly static or template-driven
- `Missing`: capability does not really exist yet in admin

| Capability Group | Capability | Status | Notes |
| --- | --- | --- | --- |
| Staff platform foundation | Admin sign-in | `Done enough` | Dedicated admin auth flow exists and is separate from consumer auth UX |
| Staff platform foundation | Stored admin session and route resume | `Done enough` | Last-path restore and persisted admin session exist |
| Staff platform foundation | Staff users and staff roles | `Partial` | Live CRUD exists, but permission model is too generic |
| Staff platform foundation | Fine-grained permissions | `Missing` | Current UI contract is still basically `Read / Write / Delete` |
| Staff platform foundation | Route/action authorization | `Missing` | Auth exists, but per-module/per-action enforcement is not evident |
| Staff platform foundation | Access denied flow wiring | `Partial` | 403 page exists, but not clearly enforced by real permission checks |
| Staff platform foundation | Admin activity logs | `Static shell` | Governance page exists, but not a live audit ledger |
| Staff platform foundation | System health | `Static shell` | Page exists, but is driven by static data |
| Staff platform foundation | Platform settings | `Static shell` | No live configuration/change-control workflow yet |
| Staff platform foundation | Content management | `Static shell` | General content platform page is not live |
| Staff platform foundation | App version control | `Static shell` | Release-control page exists, but not live |
| Staff platform foundation | Reports and analytics | `Static shell` | Reporting page exists, but not live |
| Staff platform foundation | Staff profile settings | `Static shell` | Presentational forms only |
| Staff platform foundation | Staff password and security settings | `Static shell` | Presentational only |
| Staff platform foundation | Staff notification preferences | `Static shell` | Presentational only |
| Staff platform foundation | Search/worklists/productivity layer | `Partial` | Structural pieces exist, but not clearly live across entities |
| Staff platform foundation | Route/menu completeness | `Partial` | Some routes/menu entries point to incomplete capability surfaces |
| Workflow operations | Person and role state management | `Missing` | Mobile shows the need clearly; admin does not yet own this as a full module |
| Workflow operations | Customer list/detail | `Done enough` | Live read path exists |
| Workflow operations | Customer actions, restrictions, wallets | `Partial` | Read exists, but action surfaces are weak or missing |
| Workflow operations | Vendor onboarding queue | `Missing` | Mobile needs it; admin does not yet run it live |
| Workflow operations | Vendor KYC review | `Missing` | Same gap |
| Workflow operations | Vendor/store operations | `Partial` | Intended in IA, but mostly still static or fixture-backed |
| Workflow operations | Tasker onboarding queue | `Missing` | Mobile needs it; admin does not yet run it live |
| Workflow operations | Tasker KYC review | `Missing` | Same gap |
| Workflow operations | Tasker workforce ops | `Partial` | Intended in fleet/logistics/dispatch areas, but not truly live end to end |
| Workflow operations | Marketplace products/categories/vendors | `Partial` | UI exists; many repos remain fixture-backed |
| Workflow operations | Marketplace reviews moderation | `Missing` | Review pages are not really integrated |
| Workflow operations | Sales orders list/detail | `Done enough` | Live read paths exist |
| Workflow operations | Sales order command actions | `Partial` | Read is stronger than operations control |
| Workflow operations | Shipments and tracking | `Done enough` | Live list/detail/tracking reads exist |
| Workflow operations | Shipment create/edit/intervention | `Partial` | UI exists, but not truly end-to-end live |
| Workflow operations | Task bookings / errands | `Missing` | Mobile has rich booking flow; admin lacks matching ops module |
| Workflow operations | Live dispatch | `Missing` | Dispatch pages exist, but are largely shell or local-state driven |
| Workflow operations | Dispatch exceptions and recovery | `Partial` | Good design direction, but not truly live |
| Workflow operations | Support inbox/tickets/escalations/disputes | `Done enough` | Strongest live area today |
| Workflow operations | Support templates | `Missing` | Templates are still fixture-backed |
| Workflow operations | Payments queue | `Partial` | Live read path exists |
| Workflow operations | Refunds queue | `Partial` | Live read path exists |
| Workflow operations | Payout approvals | `Missing` | Needed by mobile finance flows, not truly live in admin |
| Workflow operations | Customer subscriptions | `Missing` | Mobile supports recurring subscriptions; admin lacks real ops surface |
| Workflow operations | Loyalty / tips / referral governance | `Missing` | Mobile concepts exist; admin does not own them |
| Workflow operations | Compliance, safety, appeals | `Missing` | Risk pages are still mostly static |
| Workflow operations | Notification audit and urgent alert diagnostics | `Missing` | Mobile relies on notifications operationally |
| Workflow operations | Public tracking oversight | `Missing` | Public tracking exists in mobile/web flow, but no admin oversight surface |

## Dependency View

Some capabilities can be built independently. Others depend on foundation work first.

### Foundation-first dependencies

These should not be treated as optional polish:

- fine-grained permissions
- route/action authorization
- audit logging
- system health
- settings change control

These foundation capabilities directly protect:

- payouts
- refunds
- role changes
- restrictions/suspensions
- KYC approvals
- dispatch overrides
- content and release changes

### Workflow-first dependencies

These are the operational gaps most exposed by mobile:

- onboarding queues
- KYC review desks
- live dispatch
- booking operations
- payout approvals
- compliance and appeals
- vendor fulfillment control
- notification diagnostics

## What The Final Admin Should Feel Like

At maturity, the Ntumai admin should feel like:

- an operations control room
- a staff ERP
- a governance console
- a platform control plane

All in one workspace.

That means staff should be able to:

- sign in with staff-only access
- see only the domains they are allowed to operate
- act on live queues
- leave auditable traces
- understand system health
- manage rules safely
- publish controlled content
- govern releases
- move across linked entities quickly

## Build Priority View

### Priority 0: Foundation That Protects The Rest

- fine-grained permission model
- route and action authorization
- audit logging
- system health
- settings change control

### Priority 1: Workflow Gaps Most Exposed By Mobile

- unified person/role state page
- tasker onboarding queue
- vendor onboarding queue
- tasker KYC review
- vendor KYC review
- live dispatch board
- booking operations module
- payout approval workflow
- compliance and appeals console
- notification audit console

### Priority 2: Commerce, Governance, And Scale Layers

- vendor/store ops control
- subscription operations
- ratings/reviews moderation
- content management
- app version control
- reports and analytics
- staff account settings persistence
- route/menu cleanup

## Decision Rule

When deciding whether a page matters, use this rule:

- if it helps staff safely use the admin, it is foundational
- if it helps staff manage live user/business workflows, it is operational
- if it does both, it is core

By that rule, these are core:

- roles and permissions
- audit logs
- system health
- dispatch
- support
- payouts
- compliance
- settings

## Final Assessment

The admin vision is correct.

The current state is still split:

- `staff platform foundation`: early to partial
- `workflow operations`: partial, with a few strong live areas
- `overall ERP maturity`: not yet complete

The admin should now be planned as one roadmap with two synchronized tracks:

1. `foundation track`
2. `workflow track`

If only one track moves, the product stays lopsided.
