# Ntumai Admin Frontend Feature Gap Report

Date: 2026-05-01
Scope: `/home/ntumai/web/admin.ntumai.com`
App type: Next.js admin frontend

## Purpose

This document captures what is still **not done** in the Next.js admin frontend, feature by feature.

The goal is to separate:

- truly integrated features
- read-only live features
- fixture-backed UI
- static dashboards
- route aliases that are not real features

## Status definitions

- `Done`: uses a real backend repository path and the primary operator action persists to the backend.
- `Partial`: live read exists, but major operator actions are still missing or local-only.
- `Not done`: static page, fixture-backed data, local-only workflow, or no real backend persistence.
- `Alias`: route only redirects to another page and is not a standalone feature.

## Core infra

| Feature | Status | Notes |
| --- | --- | --- |
| Admin auth/session | Done | Uses dedicated admin auth endpoints under `/api/v1/auth/admin/*` via `src/repositories/admin/admin-auth.ts`. |
| Shared admin API client | Done | `src/repositories/admin/admin-api.ts` supports authenticated GET/POST/PATCH/DELETE and live/fallback state handling. |
| Dashboard home | Not done | `src/app/page.tsx` is still template/dashboard content using `components/dashboard/dashboard-data.ts`. |

## CRM

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Customers list | `/crm/customers`, `src/repositories/admin/customers.ts` | Partial | Live read exists, but no customer status change, block/unblock, wallet action, or direct support escalation action. |
| Customer detail | `/crm/customers/[id]`, `src/repositories/admin/customers.ts` | Partial | Live read exists, but no edit/save path, no role-state controls, no restriction controls, no linked command actions. |
| Riders | `/crm/riders` | Not done | Static page only. No repository or backend integration. |
| Corporate accounts | `/crm/corporate-accounts` | Not done | Static page only. No repository or backend integration. |
| Wallets | `/crm/wallets` | Not done | Static page only. No live wallet ledger or manual adjustment tools. |
| Ratings & reviews | `/crm/ratings-reviews` | Not done | Static page only. No ratings API integration. |
| Blocked users | `/crm/blocked-users` | Not done | Static page only. No live restriction or appeal workflow. |
| CRM overview | `/crm` | Alias | Redirects to `/crm/customers`. |

## Dispatch

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Live map | `/dispatch/live-map`, `components/dispatch/live-dispatch-map.tsx`, `live-map.data.ts` | Not done | Page chrome uses static `section-data`; map markers and operations are local/demo data, not live dispatch telemetry. |
| Manual dispatch | `/dispatch/manual-dispatch` | Not done | Entire workflow is local seeded state. No live assignment, override, or dispatch action API. |
| Scheduled rides | `/dispatch/scheduled-rides` | Not done | Static/local workflow. No live scheduling or supply rebalance integration. |
| Dispatch exceptions | `components/dispatch/dispatch-exception-queue-page.tsx` | Not done | Local-only queue. No backend exception feed or operator action persistence. |
| Dispatch overview | `/dispatch` | Alias | Redirects to `/dispatch/live-map`. |

## Fleet

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Fleet overview analytics | `/fleet` | Not done | Static analytics page, not sourced from backend. |
| Driver applications | `/fleet/driver-applications`, `tasker-application-queue-page.tsx` | Not done | Entire application queue is local state. No live review, approve, reject, or reassignment persistence. |
| Driver documents | `/fleet/driver-documents`, `tasker-document-queue-page.tsx` | Not done | Entire document queue is local state. No live approve/reject/suspend persistence. |
| Vehicles | `/fleet/vehicles` | Not done | Static `section-data` page. No fleet asset integration. |
| Tasker list/data source | `src/repositories/admin/taskers.ts` | Not done | Repository is fixture-only. No backend tasker list/detail contract is wired. |

## Logistics

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Shipments list | `/logistics/shipments`, `src/repositories/admin/shipments.ts` | Partial | Live read exists. Missing live create, edit, assign, intervene, or status-transition actions. |
| Shipment detail | `/logistics/shipments/[id]` | Partial | Live read exists. No operator action panel wired to backend. |
| Shipment tracking | `/logistics/tracking`, `/logistics/tracking/[id]` | Partial | Live read exists. No real intervention, escalation, or exception action path. |
| Shipment create | `/logistics/shipments/create` | Not done | UI exists, but no live mutation path. |
| Shipment edit | `/logistics/shipments/[id]/edit` | Not done | Uses local getter/fallback, no save path. |
| Taskers | `/logistics/taskers`, `src/repositories/admin/taskers.ts` | Not done | Fixture-backed only. |
| Exceptions | `/logistics/exceptions` | Not done | Static/local page. |
| Zones & geofencing | `/logistics/zones-geofencing` | Not done | Static/local controls, no backend integration. |
| Service types | `/logistics/service-types` | Not done | Static page only. |
| Pricing & commission | `/logistics/pricing-commission` | Not done | Static page only. |
| Logistics overview | `/logistics` | Alias | Redirects to shipments. |

## Sales

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Orders list | `/sales/orders`, `src/repositories/admin/orders.ts` | Partial | Live read exists. Missing order status transitions, escalation, refund-review action, and other operator mutations. |
| Order detail | `/sales/orders/[id]` | Partial | Live read exists. No real intervention actions wired. |
| Order create | `/sales/orders/create` | Not done | UI only. No backend create mutation. |
| Order edit | `/sales/orders/[id]/edit` | Not done | UI only. No backend save mutation. |
| Payments queue | `/sales/payments`, `src/repositories/admin/finance.ts` | Partial | Live read exists. Missing retry/release/resolve/close persistence actions. |
| Refund queue | `/sales/refunds`, `src/repositories/admin/finance.ts` | Partial | Live read exists. Missing approve/deny/release persistence actions. |
| Payout approvals | `/sales/payouts`, `payout-approval-queue-page.tsx` | Not done | Entire payout queue is local seed state. |
| Invoices list/detail/create/edit/builder | `/sales/invoices/*`, `src/repositories/admin/invoices.ts` | Not done | Repository is fixture-only. No backend invoice integration. |
| Sales customers | `/sales/customers` | Alias-ish / Not done | No dedicated feature behavior beyond redirect/placeholder patterns. |
| Sales overview | `/sales` | Alias | Redirects to invoices. |

## Marketplace

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Vendors list | `/marketplace/vendors`, `src/repositories/admin/vendors.ts` | Not done | Repository is fixture-only. |
| Vendor detail | `/marketplace/vendors/[slug]` | Not done | Local data only. |
| Vendor edit | `/marketplace/vendors/[slug]/edit` | Not done | Local data only. No save mutation. |
| Vendor create | `/marketplace/vendors/create` | Not done | UI only. No live create mutation. |
| Vendor applications | `/marketplace/vendor-applications`, `vendor-application-queue-page.tsx` | Not done | Entire workflow is local state. |
| Products list | `/marketplace/products`, `src/repositories/admin/products.ts` | Not done | Repository is fixture-only. |
| Product detail | `/marketplace/products/[slug]` | Not done | Local data only. |
| Product edit | `/marketplace/products/[slug]/edit` | Not done | Local data only. No live save. |
| Product create | `/marketplace/products/create` | Not done | UI only. No live create mutation. |
| Categories list | `/marketplace/categories`, `src/repositories/admin/categories.ts` | Not done | Repository is fixture-only. |
| Category edit | `/marketplace/categories/[id]/edit` | Not done | Local data only. |
| Category create | `/marketplace/categories/create` | Not done | UI only. No live create mutation. |
| Reviews | `/marketplace/reviews` | Not done | Static/local `crud-data` page. |
| Marketplace overview | `/marketplace` | Alias | Redirects to vendors. |

## Support

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Inbox | `/support/inbox`, `src/repositories/admin/support.ts` | Partial to near-done | Live list/thread/reply exists. Missing richer case editing, stronger linked-entity actions, and fuller staff workflow state handling. |
| Tickets queue | `/support/tickets`, `src/repositories/admin/support.ts` | Partial to near-done | Live list exists. Missing richer mutate/update workflow and broader command actions. |
| Escalations | `/support/escalations`, `src/repositories/admin/support.ts` | Partial to near-done | Live list and decision action exist. Missing deeper case tooling and linked operational actions. |
| Disputes | `/support/disputes`, `src/repositories/admin/support.ts` | Partial to near-done | Live list and decision action exist. Missing richer finance/order/shipment intervention workflow. |
| Support dashboard | `/support`, `support-dashboard-page.tsx` | Not done | Static support overview only. |
| Templates list/detail/create/edit | `/support/templates/*`, `src/repositories/admin/support-templates.ts` | Not done | Entire template system is fixture-only. No backend template CRUD. |

## Risk

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Fraud risk | `/risk/fraud-risk` | Not done | Static `section-data` page only. |
| Safety & compliance | `/risk/safety-compliance` | Not done | Static page only, despite backend KYC admin routes existing. |
| SOS / emergency | `/risk/sos-emergency` | Not done | Static page only. |
| Risk overview | `/risk` | Alias | Redirects to fraud. |

## Growth

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Promotions | `/growth/promotions` | Not done | Static `section-data` page only. |
| Notifications | `/growth/notifications` | Not done | Static `section-data` page only. |
| Driver incentives | `/growth/driver-incentives` | Not done | Static `section-data` page only. |
| Growth overview | `/growth` | Alias | Redirects to promotions. |

## Platform

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Roles and permissions | `/roles-permissions`, `src/repositories/admin/platform-access.ts` | Partial to near-done | Live CRUD exists for staff roles and admin users. Missing fuller audit linkage and broader IAM governance behavior. |
| Admin users route | `/platform/admin-users` | Alias | Redirects into roles/permissions flow rather than being an independent page. |
| Reports & analytics | `/platform/reports-analytics` | Not done | Static `section-data` page only. |
| Content management | `/platform/content-management` | Not done | Static `section-data` page only. |
| App version control | `/platform/app-version-control` | Not done | Static page only. |
| System health | `/platform/system-health` | Not done | Static page only. |
| Platform settings | `/platform/settings` | Not done | Static page only. |
| Admin activity logs | `/platform/admin-activity-logs` | Not done | Static page only. |
| Platform overview | `/platform` | Alias | Redirects to reports. |

## Profile and preferences

| Feature | Route / source | Status | What is not done |
| --- | --- | --- | --- |
| Profile details | `/profile-settings/profile`, `profile-details-page.tsx` | Not done | Pure presentational form. No save wiring. |
| Password settings | `/profile-settings/password` | Not done | Presentational form only. No password update integration. |
| Notification settings | `/profile-settings/notification` | Not done | Presentational settings only. No persistence. |
| Profile root | `/profile` | Alias | Redirects to profile settings. |
| Profile settings root | `/profile-settings` | Alias-ish | Redirect wrapper to profile subpage flow. |

## Legacy aliases and wrappers

| Route | Status | Notes |
| --- | --- | --- |
| `/customers` | Alias | Redirects to CRM customers. |
| `/deliveries` | Alias | Redirects to logistics shipments. |
| `/drivers` | Alias | Redirects to logistics taskers. |
| `/vendors` | Alias | Redirects to marketplace vendors. |
| `/content` | Alias | Redirects to platform content. |
| `/settings` | Alias | Redirects to platform settings. |
| `/catalog` | Alias | Redirects to marketplace products. |
| `/email-templates` | Alias | Redirects to support templates. |

## Readiness summary

### Closest to usable

- admin auth/session
- support inbox
- support tickets
- support escalations
- support disputes
- platform access roles/users
- customer read paths
- order read paths
- shipment read paths

### Still primarily read-only

- customers
- orders
- shipments
- payments
- refunds

### Still mostly scaffolded or fixture-backed

- vendors
- taskers
- products
- categories
- invoices
- support templates
- dispatch queues
- fleet queues
- payouts
- risk pages
- growth pages
- platform reporting/settings/health pages
- profile settings

## Practical conclusion

The Next.js admin frontend is **not yet fully implemented as an operations-grade ERP**.

Its current state is:

- a real admin auth surface
- a real admin API client
- a partially live support/CRM/orders/logistics surface
- a large amount of scaffolded ERP UI that still needs backend contracts and persistence wiring

The biggest implementation gaps are:

1. vendor/tasker/product/category live data and write flows
2. queue/action persistence for fleet, dispatch, and payouts
3. risk/growth/platform modules still being mostly static dashboards
4. profile/settings pages having presentational UI without persistence
5. shipment/order/customer pages needing operator actions, not just read paths
