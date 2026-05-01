# Admin Implementation Matrix

Date: 2026-05-01

## Purpose

This is the execution-layer companion to the audit docs.

Use this when the goal is no longer:

- understanding the gaps

and is now:

- building the admin systematically

Related docs:

- [admin-master-capability-map.md](/home/ntumai/web/admin.ntumai.com/docs/admin-master-capability-map.md)
- [mobile-screen-to-admin-operations-audit.md](/home/ntumai/web/admin.ntumai.com/docs/mobile-screen-to-admin-operations-audit.md)
- [admin-native-erp-capability-audit.md](/home/ntumai/web/admin.ntumai.com/docs/admin-native-erp-capability-audit.md)
- [admin-feature-gap-report.md](/home/ntumai/web/admin.ntumai.com/docs/admin-feature-gap-report.md)

## How To Read This

- `Existing` means a route/page/repo/API surface already exists in some form.
- `Proposed` means the capability is needed, but the exact backend contract still needs to be created or finalized.
- Backend endpoint names below are:
  - `Existing` where already observed in code
  - `Proposed` where the current admin clearly needs a contract but one was not confirmed yet

## Priority Rules

- `P0`: foundation or operations blockers
- `P1`: high-value workflow completion
- `P2`: scale, quality, governance, and productivity layers

## Track A: Staff Platform Foundation

| Priority | Capability | Frontend routes | Frontend files to own | Backend owner | API surface | Dependencies | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Fine-grained staff permission model | global | `src/components/auth/auth-provider.tsx`, `src/components/auth/auth-shell.tsx`, `src/config/routes.ts`, `src/repositories/admin/platform-access.ts` | `admin` auth/access | Proposed: permission payload on `/api/v1/auth/admin/me` and `/api/v1/admin/access/users` | admin auth, staff roles | staff session returns permissions/scopes, not just role labels | missing |
| P0 | Route-level authorization | all protected routes | `src/components/auth/auth-shell.tsx`, `src/app/access-denied/page.tsx` | `admin` auth/access | consumes permission payload from admin auth/me | fine-grained permission model | staff without required permission is redirected to `/access-denied` instead of seeing the page | missing |
| P0 | Action-level authorization | support, payouts, refunds, dispatch, roles | component-level pages and modals in support/platform/finance/dispatch | `admin` auth/access | same permission payload plus server-side enforcement on mutations | route auth | buttons/actions hide or disable correctly and server rejects unauthorized writes | missing |
| P0 | Audit log entity and feed | `/platform/admin-activity-logs` | `src/app/platform/admin-activity-logs/page.tsx`, new `src/repositories/admin/audit.ts` | `admin` platform/governance | Proposed: `GET /api/v1/admin/audit/logs`, `GET /api/v1/admin/audit/logs/:id` | permission model | searchable actor/action/resource audit trail exists for sensitive actions | missing |
| P0 | Sensitive action logging | roles, payouts, refunds, restrictions, KYC decisions | mutation callers across platform/support/finance/risk | `admin` platform/governance | backend-side event emission into audit log | audit log feed | all sensitive writes create durable audit entries with actor and timestamp | missing |
| P0 | System health live feed | `/platform/system-health` | `src/app/platform/system-health/page.tsx`, new `src/repositories/admin/system-health.ts` | `admin` platform/ops | Proposed: `GET /api/v1/admin/platform/health`, `GET /api/v1/admin/platform/health/incidents` | auth, permissions | page shows live provider, queue, messaging, maps, and retry status | static shell |
| P0 | Platform settings read/write with change control | `/platform/settings` | `src/app/platform/settings/page.tsx`, new `src/repositories/admin/platform-settings.ts` | `admin` platform/config | Proposed: `GET /api/v1/admin/platform/settings`, `PATCH /api/v1/admin/platform/settings/:domain`, `GET /api/v1/admin/platform/settings/changes` | audit logs, permissions | settings are persisted, versioned, and auditable | static shell |
| P1 | Staff session/device management | new platform or profile route | new session page + `admin-session.ts` extension | `auth` admin | Proposed: `GET /api/v1/auth/admin/sessions`, `DELETE /api/v1/auth/admin/sessions/:id` | admin auth | admin can view and revoke active sessions | missing |
| P1 | Staff profile persistence | `/profile-settings/profile` | `src/components/profile-settings/profile-details-page.tsx`, new `src/repositories/admin/staff-profile.ts` | `admin` platform/access | Proposed: `GET /api/v1/admin/staff/profile`, `PATCH /api/v1/admin/staff/profile` | auth | profile save works and reload reflects persisted values | static shell |
| P1 | Staff password change | `/profile-settings/password` | `src/components/profile-settings/password-settings-page.tsx` | `auth` admin | Proposed: `POST /api/v1/auth/admin/password/change` | admin auth | password update succeeds with current-password validation | static shell |
| P1 | Staff notification preferences | `/profile-settings/notification` | `src/components/profile-settings/notification-settings-page.tsx` | `admin` platform/access | Proposed: `GET/PATCH /api/v1/admin/staff/notification-preferences` | staff profile | preferences persist and drive real admin notifications | static shell |
| P1 | Reports and analytics live datasets | `/platform/reports-analytics` | `src/app/platform/reports-analytics/page.tsx`, new `src/repositories/admin/reports.ts` | `admin` analytics | Proposed: `GET /api/v1/admin/reports/catalog`, `GET /api/v1/admin/reports/:id` | permissions | report page loads real datasets or report definitions | static shell |
| P1 | App version control | `/platform/app-version-control` | `src/app/platform/app-version-control/page.tsx`, new `src/repositories/admin/app-control.ts` | `admin` platform/release | Proposed: `GET /api/v1/admin/platform/app-versions`, `PATCH /api/v1/admin/platform/app-versions/:track`, `POST /api/v1/admin/platform/feature-gates` | audit logs | staff can view release lanes and enforce version rules | static shell |
| P2 | Content management | `/platform/content-management` | `src/app/platform/content-management/page.tsx`, new `src/repositories/admin/content.ts` | `admin` content/platform | Proposed: `GET /api/v1/admin/content/items`, `POST/PATCH /api/v1/admin/content/items` | permissions, audit logs | help/policy/banner content becomes manageable from admin | static shell |
| P2 | Admin global search | global search UI | `src/components/search/*`, new search repository | `admin` platform/search | Proposed: `GET /api/v1/admin/search?q=` | auth, permissions | staff can search customers, orders, shipments, vendors, cases, and staff users | partial |
| P2 | Route/menu cleanup | nav-wide | `src/layouts/hydrogen/menu-items.tsx`, `src/config/routes.ts` | frontend only | n/a | audits complete | dead links removed or backed by real pages, especially fleet menu gaps | partial |

## Track B: Identity, CRM, And Person/Role State

| Priority | Capability | Frontend routes | Frontend files to own | Backend owner | API surface | Dependencies | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Unified person/role state page | new CRM or platform route | new person detail page + extend `customers.ts` or new `people.ts` | `admin` + auth/domain identity | Proposed: `GET /api/v1/admin/people/:id` | auth, permissions | staff can see one person with all roles, statuses, KYC, activation, restrictions, and linked activity | missing |
| P1 | Customer list/detail hardening | `/crm/customers`, `/crm/customers/[id]` | `src/repositories/admin/customers.ts`, customer components | `admin` crm | Existing customer read endpoints | auth | current customer read views are stable and complete enough to support other modules | done enough |
| P1 | Customer actions | customer detail | customer detail page + action modals | `admin` crm | Proposed: suspend, restore, tag, note, wallet-adjust read-safe action set | audit logs, permissions | support/admin can perform controlled customer actions from detail page | partial |
| P2 | Wallet/customer support console | `/crm/wallets` | `src/app/crm/wallets/page.tsx`, finance/crm repository | `admin` crm/finance | Proposed: `GET /api/v1/admin/crm/wallets`, adjustments if/when wallet ledger exists | finance assumptions clarified | page reflects real customer finance posture, not fake stored-value ledger assumptions | static shell |
| P2 | Blocked users/restrictions | `/crm/blocked-users` | `src/app/crm/blocked-users/page.tsx` | `admin` crm/risk | Proposed restrictions endpoints | audit logs, permissions | restriction list is live and linked to person records and risk cases | static shell |

## Track C: Tasker Onboarding, Workforce, And Compliance

| Priority | Capability | Frontend routes | Frontend files to own | Backend owner | API surface | Dependencies | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Tasker onboarding application queue | `/fleet/driver-applications` | `src/components/fleet/tasker-application-queue-page.tsx`, new/extended `taskers.ts` | `admin` + onboarding/auth | Proposed: `GET /api/v1/admin/taskers/applications`, `GET /api/v1/admin/taskers/applications/:id`, `PATCH /api/v1/admin/taskers/applications/:id` | person/role state, permissions, audit logs | staff can review, approve, reject, request changes, and assign notes | missing |
| P0 | Tasker document/KYC review | `/fleet/driver-documents` | `src/components/fleet/tasker-document-queue-page.tsx`, `taskers.ts` | `admin` + KYC/auth | Proposed: `GET /api/v1/admin/taskers/documents`, `PATCH /api/v1/admin/taskers/documents/:id` | audit logs | document-level review with notes and status writes | missing |
| P0 | Tasker activation/suspension/probation controls | tasker detail/new route | new tasker detail ops page | `admin` + onboarding/compliance | Proposed status mutation endpoints | onboarding queue, compliance | staff can activate, suspend, return to review, or move to probation with audit trail | missing |
| P0 | Compliance case and appeals console | `/risk/safety-compliance` plus case detail routes | `src/app/risk/safety-compliance/page.tsx`, new `src/repositories/admin/compliance.ts` | `admin` risk/compliance | Proposed: `GET /api/v1/admin/compliance/cases`, `PATCH /api/v1/admin/compliance/cases/:id`, `GET /api/v1/admin/compliance/appeals` | audit logs, permissions | staff can issue, review, resolve, and appeal compliance actions | static shell |
| P1 | Tasker directory/live profile | `/logistics/taskers` | `src/components/logistics/taskers-list-page.tsx`, `taskers.ts` | `admin` logistics/workforce | Proposed read endpoints | onboarding and dispatch data | staff can inspect tasker readiness, live status, and risk flags | fixture-backed |
| P1 | Fleet vehicles | `/fleet/vehicles` | `src/app/fleet/vehicles/page.tsx` + new repo if needed | `admin` fleet | Proposed fleet vehicle endpoints | auth | real vehicle readiness replaces static dashboard data | static shell |
| P2 | Tasker incentives and payouts pages | missing routes in fleet | add pages + finance/workforce repos | `admin` finance/workforce | Proposed: incentives/payout endpoints | route cleanup | menu links become real pages | missing |

## Track D: Vendor Onboarding, Marketplace, And Store Ops

| Priority | Capability | Frontend routes | Frontend files to own | Backend owner | API surface | Dependencies | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Vendor onboarding application queue | `/marketplace/vendor-applications` | `src/components/marketplace/vendor-application-queue-page.tsx`, `vendors.ts` | `admin` + onboarding/auth | Proposed: `GET /api/v1/admin/vendors/applications`, `PATCH /api/v1/admin/vendors/applications/:id` | permissions, audit logs | staff can review and decision vendor applications | missing |
| P0 | Vendor KYC/business review | same queue or dedicated KYC route | vendor application queue/detail + repo | `admin` + KYC/auth | Proposed KYC endpoints for vendors | audit logs | staff can review business docs and issue decision notes | missing |
| P1 | Vendor directory/detail | `/marketplace/vendors`, `/marketplace/vendors/[slug]` | `vendors.ts`, vendor detail/list pages | `admin` marketplace | Proposed or live vendor endpoints | vendor app queue | staff can inspect store readiness, pause state, and metrics | fixture-backed |
| P1 | Store visibility/pause/business-hours governance | vendor detail | vendor detail page + vendor repo | `admin` marketplace | Proposed vendor ops mutations | vendor detail live | staff can pause/unpause a store and inspect hours readiness | missing |
| P1 | Product moderation and catalog ops | `/marketplace/products` | `products.ts`, product pages | `admin` marketplace | Proposed or live product endpoints | vendor detail | product pages use real catalog data and moderation status | fixture-backed |
| P1 | Category governance | `/marketplace/categories` | `categories.ts`, category pages | `admin` marketplace | Proposed or live category endpoints | product ops | category pages use real taxonomy data | fixture-backed |
| P2 | Reviews moderation | `/marketplace/reviews`, `/crm/ratings-reviews` | review pages + new repo if split | `admin` marketplace/crm | Proposed review endpoints | permissions | staff can inspect, hide, or review flagged ratings | static shell |

## Track E: Orders, Shipments, Deliveries, And Task Bookings

| Priority | Capability | Frontend routes | Frontend files to own | Backend owner | API surface | Dependencies | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Orders list/detail stabilization | `/sales/orders`, `/sales/orders/[id]` | `orders.ts`, order list/detail components | `admin` sales | Existing order read endpoints | auth | reliable real order list/detail with no fixture fallback during healthy auth | done enough |
| P1 | Order operational actions | order detail | order detail page + orders repo | `admin` sales | Proposed: order status mutation, escalation, refund handoff | audit logs, permissions | staff can intervene in order lifecycle safely | partial |
| P0 | Shipments list/detail/tracking stabilization | `/logistics/shipments`, `/logistics/tracking` | `shipments.ts`, shipment/tracking components | `admin` logistics | Existing shipment read endpoints | auth | shipment pages are reliable and staff-usable | done enough |
| P1 | Shipment create/edit persistence | `/logistics/shipments/create`, `/logistics/shipments/[id]/edit` | shipment form workspace + `shipments.ts` | `admin` logistics | Proposed or existing create/update endpoints | shipment detail stable | create/edit persists to backend and reloads correctly | partial |
| P0 | Booking/task operations module | likely new routes under dispatch or logistics | new booking list/detail/intervention pages + new `bookings.ts` repo | `admin` dispatch/logistics | Proposed: `GET /api/v1/admin/bookings`, `GET /api/v1/admin/bookings/:id`, `PATCH /api/v1/admin/bookings/:id` | person state, dispatch, support | staff can manage errand/task bookings with full metadata | missing |
| P1 | Scheduled work board | `/dispatch/scheduled-rides` | scheduled rides page + bookings/dispatch repo | `admin` dispatch | Proposed scheduled booking endpoints | bookings module | future-dated deliveries/bookings are live and assignable | static shell |

## Track F: Dispatch And Live Operations

| Priority | Capability | Frontend routes | Frontend files to own | Backend owner | API surface | Dependencies | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Live dispatch board | `/dispatch/live-map` | `src/app/dispatch/live-map/page.tsx`, `src/components/dispatch/live-dispatch-map.tsx`, new `dispatch.ts` repo | `admin` dispatch/logistics | Proposed: `GET /api/v1/admin/dispatch/live`, live map entities and alert feed | taskers, shipments, bookings, system health | live taskers/jobs/alerts are backend-driven | static shell |
| P0 | Manual dispatch | `/dispatch/manual-dispatch` | page + new `dispatch.ts` repo | `admin` dispatch | Proposed: `GET /api/v1/admin/dispatch/manual`, `POST /api/v1/admin/dispatch/assign`, `POST /api/v1/admin/dispatch/reassign` | live dispatch, permissions, audit logs | staff can manually assign or reassign live work | static shell |
| P0 | Dispatch exceptions queue | `/logistics/exceptions` | `dispatch-exception-queue-page.tsx`, dispatch repo | `admin` dispatch/support | Proposed: `GET /api/v1/admin/dispatch/exceptions`, `PATCH /api/v1/admin/dispatch/exceptions/:id` | live dispatch, support | stalled or risky jobs land in a live exception queue | partial |
| P1 | Zones and geofencing | `/logistics/zones-geofencing` | page + new `zones.ts` repo | `admin` logistics | Proposed zones CRUD endpoints | dispatch | zones can be listed, edited, and published | static shell |
| P1 | Service types | `/logistics/service-types` | page + new repo | `admin` logistics/config | Proposed service type endpoints | settings | service-type rules and eligibility become real | static shell |
| P1 | Pricing and commission | `/logistics/pricing-commission` | page + settings/pricing repo | `admin` logistics/config/finance | Proposed pricing endpoints | settings change control | operational pricing rules become manageable | static shell |

## Track G: Support And Linked Case Management

| Priority | Capability | Frontend routes | Frontend files to own | Backend owner | API surface | Dependencies | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Support inbox | `/support/inbox` | `support.ts`, inbox page | `admin` support | Existing inbox read/reply endpoints | auth | inbox remains live and stable | done enough |
| P0 | Support tickets | `/support/tickets` | `support.ts`, ticket queue page | `admin` support | Existing tickets read endpoints | auth | support agents can view active ticket queue reliably | done enough |
| P0 | Support escalations | `/support/escalations` | `support.ts`, escalation queue page | `admin` support | Existing list + decision endpoints | permissions, audit logs | escalation decisions persist and are auditable | done enough |
| P0 | Support disputes | `/support/disputes` | `support.ts`, dispute queue page | `admin` support | Existing list + decision endpoints | permissions, audit logs | dispute decisions persist and are auditable | done enough |
| P1 | Support case linking across entities | support detail surfaces | support components + shared entity-link utilities | `admin` support | Proposed richer case detail endpoint | people/orders/shipments/bookings | staff sees exact linked customer, vendor, tasker, order, shipment, booking refs | partial |
| P1 | Support templates | `/support/templates` | `support-templates.ts`, template pages | `admin` support/content | Proposed or existing template endpoints | content foundation | support templates use live backend data | fixture-backed |

## Track H: Finance, Refunds, Payouts, And Subscriptions

| Priority | Capability | Frontend routes | Frontend files to own | Backend owner | API surface | Dependencies | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Payments queue stabilization | `/sales/payments` | `finance.ts`, payment queue page | `admin` finance | Existing payments read endpoint | auth | page uses live payment queue cleanly | partial |
| P0 | Refunds queue stabilization | `/sales/refunds` | `finance.ts`, refund queue page | `admin` finance | Existing refunds read endpoint | auth | page uses live refund queue cleanly | partial |
| P0 | Refund decision workflow | refunds queue/detail | finance repo + refund page actions | `admin` finance | Proposed or existing refund decision mutation endpoints | audit logs, permissions | staff can approve/deny/refine refund outcomes | partial |
| P0 | Payout approval workflow | `/sales/payouts` | payout queue page + new finance repo actions | `admin` finance | Proposed: `GET /api/v1/admin/payouts`, `PATCH /api/v1/admin/payouts/:id` | audit logs, permissions | staff can review, approve, reject, or hold payouts | missing |
| P1 | Invoice/settlement live data | `/sales/invoices` | `invoices.ts`, invoice pages | `admin` finance/sales | Proposed or existing invoice endpoints | payouts | invoice pages move off fixtures | fixture-backed |
| P1 | Customer subscriptions ops | new finance or growth route | new subscriptions admin pages + finance repo | `admin` finance/commerce | Proposed: `GET /api/v1/admin/subscriptions`, `PATCH /api/v1/admin/subscriptions/:id` | orders/vendors/customers | staff can inspect, pause, resume, and support subscription cases | missing |
| P2 | Loyalty, tips, and referral ops | new CRM/growth/finance routes | new repos/pages | `admin` growth/finance/crm | Proposed dedicated endpoints | analytics foundation | these mobile-visible programs have back-office visibility and controls | missing |

## Suggested Execution Order

### Sprint Order: Foundation

1. fine-grained permissions
2. route/action authorization
3. audit logs
4. system health
5. settings change control

### Sprint Order: Operations

1. tasker onboarding queue
2. vendor onboarding queue
3. tasker/vendor KYC review
4. live dispatch
5. booking/task ops module
6. payout approvals
7. compliance and appeals
8. notification diagnostics

### Sprint Order: Completion

1. vendor/store ops
2. shipment create/edit persistence
3. subscriptions
4. reports/analytics
5. content and app version control
6. staff profile/security/preferences
7. route/menu cleanup

## Handoff Notes For Another AI

- Treat this file as the implementation order, not as the source of truth for product intent.
- Use the audit docs first when a requirement is ambiguous.
- Where endpoint names are marked `Proposed`, confirm against backend before implementation or create the endpoint as part of the task.
- Do not assume all static admin pages are harmless placeholders; many are standing in for required ERP/control-plane capability.
- Do not design admin only as a mirror of mobile. The staff platform foundation is mandatory.
