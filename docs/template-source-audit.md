# Ntumai Admin Template Source Audit

This document is the implementation guardrail for the admin frontend.

Rule:
- reuse exact Furyroad page families and shared interaction pieces first
- do not write new UI if the template already has the page or interaction
- if the route family is known but the exact page source is not preserved locally, treat it as `recover-first`, not as permission to redesign

## Source Status Labels

- `verified-current`
  Exact reusable source exists in the current admin repo.
- `verified-route-family`
  The Furyroad route family is confirmed from the extracted template config, but the exact page source is not preserved locally.
- `shared-primitive`
  Reusable template interaction primitives exist, such as modal, drawer, search, or shared shell pieces.
- `custom-drift`
  The current Ntumai page exists, but it was composed by us instead of copied directly enough from the template family.

## Template Evidence We Actually Have

### Confirmed route families from extracted template config

From [`template-standalone-reference/src/config/routes.ts`](/home/ntumai/web/admin.ntumai.com_backup/template-standalone-reference/src/config/routes.ts:1):

- `eCommerce`
  - `/ecommerce`
  - `/ecommerce/products`
  - `/ecommerce/products/create`
  - `/ecommerce/products/[slug]`
  - `/ecommerce/products/[slug]/edit`
  - `/ecommerce/categories`
  - `/ecommerce/categories/create`
  - `/ecommerce/categories/[id]/edit`
  - `/ecommerce/orders`
  - `/ecommerce/orders/create`
  - `/ecommerce/orders/[id]`
  - `/ecommerce/orders/[id]/edit`
  - `/ecommerce/reviews`
- `invoice`
  - `/invoice`
  - `/invoice/create`
  - `/invoice/[id]`
  - `/invoice/[id]/edit`
  - `/invoice/builder`
- `support`
  - `/support`
  - `/support/inbox`
  - `/support/snippets`
  - `/support/snippets/create`
  - `/support/snippets/[id]`
  - `/support/snippets/[id]/edit`
  - `/support/templates`
  - `/support/templates/create`
  - `/support/templates/[id]`
  - `/support/templates/[id]/edit`
- `logistics`
  - `/logistics`
  - `/logistics/shipments`
  - `/logistics/shipments/create`
  - `/logistics/shipments/[id]`
  - `/logistics/shipments/[id]/edit`
  - `/logistics/tracking/[id]`

### Confirmed shared template interaction primitives

These exist both in the extracted backup and in the current repo:

- drawer container and hook
  - [container.tsx](/home/ntumai/web/admin.ntumai.com/src/app/shared/drawer-views/container.tsx:1)
  - [use-drawer.ts](/home/ntumai/web/admin.ntumai.com/src/app/shared/drawer-views/use-drawer.ts:1)
- modal container and hook
  - [container.tsx](/home/ntumai/web/admin.ntumai.com/src/app/shared/modal-views/container.tsx:1)
  - [use-modal.ts](/home/ntumai/web/admin.ntumai.com/src/app/shared/modal-views/use-modal.ts:1)
- modal component
  - [modal.tsx](/home/ntumai/web/admin.ntumai.com/src/components/modal.tsx:1)
- search system traces still exist in backup
  - [page-links.data.ts](/home/ntumai/web/admin.ntumai.com_backup/template-standalone-reference/src/components/search/page-links.data.ts:1)
  - [search.tsx](/home/ntumai/web/admin.ntumai.com_backup/template-standalone-reference/src/components/search/search.tsx:1)

This means row actions, delete confirmations, detail drawers, and case modals should preferentially use these primitives instead of new patterns.

## Route Map

### Marketplace

| Ntumai Route | Target Furyroad Family | Source Status | Current State | Action |
|---|---|---:|---|---|
| `/marketplace` | route entry only | `verified-current` | redirects to the main marketplace working route | keep |
| `/marketplace/products` | `ecommerce/products` | `verified-current` + `verified-route-family` | works, but some row/detail/edit/create UI was recomposed | tighten toward exact e-commerce list/detail/edit/create family |
| `/marketplace/products/create` | `ecommerce/products/create` | `verified-route-family` + `custom-drift` | current page is still too hand-composed | replace with stricter template-family create page, aligned to mobile vendor product workflow |
| `/marketplace/products/[slug]` | `ecommerce/products/[slug]` | `verified-route-family` + `custom-drift` | aligned enough for now | keep |
| `/marketplace/products/[slug]/edit` | `ecommerce/products/[slug]/edit` | `verified-route-family` + `custom-drift` | aligned enough for now | keep |
| `/marketplace/vendors` | closest to `ecommerce/products` CRUD family | `verified-current` but adapted | currently adapted from product-family patterns | acceptable for now, tighten once vendor-specific source exists |
| `/marketplace/vendors/create` | adapted e-commerce CRUD form | `custom-drift` | aligned enough for now | keep |
| `/marketplace/vendors/[slug]` | adapted e-commerce detail | `custom-drift` | aligned enough for now | keep |
| `/marketplace/vendors/[slug]/edit` | adapted e-commerce edit | `custom-drift` | aligned enough for now | keep |
| `/marketplace/categories` | `ecommerce/categories` | `verified-route-family` + `custom-drift` | current page is simpler list-first | keep until exact category page source is recovered |
| `/marketplace/categories/create` | `ecommerce/categories/create` | `verified-route-family` + `custom-drift` | current page is hand-composed | refactor later |
| `/marketplace/categories/[id]/edit` | `ecommerce/categories/[id]/edit` | `verified-route-family` + `custom-drift` | current page is hand-composed | refactor later |
| `/marketplace/reviews` | `ecommerce/reviews` | `verified-route-family` + `custom-drift` | current page is simpler list-first | acceptable for now |
| `/marketplace/vendor-applications` | no direct CRUD family, use queue/case primitives | `shared-primitive` | correct operational page type | keep |

### Sales

| Ntumai Route | Target Furyroad Family | Source Status | Current State | Action |
|---|---|---:|---|---|
| `/sales/invoices` | `invoice` list | `verified-current` + `verified-route-family` | best-preserved commerce page family | keep tightening from invoice family |
| `/sales/invoices/create` | `invoice/create` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/sales/invoices/[id]` | `invoice/[id]` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/sales/invoices/[id]/edit` | `invoice/[id]/edit` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/sales/invoices/builder` | `invoice/builder` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/sales/orders` | `ecommerce/orders` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/sales/orders/create` | `ecommerce/orders/create` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/sales/orders/[id]` | `ecommerce/orders/[id]` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/sales/orders/[id]/edit` | `ecommerce/orders/[id]/edit` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/sales/payments` | operations queue | `shared-primitive` | correct queue/case type | keep |
| `/sales/refunds` | operations queue | `shared-primitive` | correct queue/case type | keep |
| `/sales/payouts` | operations queue | `shared-primitive` | correct queue/case type | keep |

### Logistics

| Ntumai Route | Target Furyroad Family | Source Status | Current State | Action |
|---|---|---:|---|---|
| `/logistics` | route entry only | `verified-current` | redirects to the main logistics working route | keep |
| `/logistics/shipments` | `logistics/shipments` | `verified-route-family` + `custom-drift` | current page is simpler list-first | acceptable for now |
| `/logistics/shipments/create` | `logistics/shipments/create` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/logistics/shipments/[id]` | `logistics/shipments/[id]` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/logistics/shipments/[id]/edit` | `logistics/shipments/[id]/edit` | `verified-route-family` + `custom-drift` | current page exists but was reassembled | tighten later |
| `/logistics/tracking` | `logistics/tracking/[id]` family | `verified-route-family` + `custom-drift` | aligned enough for now | keep |
| `/logistics/exceptions` | operations queue | `shared-primitive` | correct queue/case type | keep |
| `/logistics/drivers` | no exact logistics entity family preserved | `custom-drift` | current page is simplified list-first | acceptable until a stricter template source exists |

### Support

| Ntumai Route | Target Furyroad Family | Source Status | Current State | Action |
|---|---|---:|---|---|
| `/support/inbox` | `support/inbox` | `verified-current` + `verified-route-family` | closest to a direct app-kit page | keep |
| `/support/tickets` | operations queue | `shared-primitive` | correct queue/case type | keep |
| `/support/disputes` | operations queue | `shared-primitive` | correct queue/case type | keep |
| `/support/escalations` | operations queue | `shared-primitive` | correct queue/case type | keep |
| `/support/snippets` | `support/snippets` | `verified-route-family` only | not implemented | recover-first |
| `/support/templates` | `support/templates` | `verified-route-family` only | not implemented | recover-first |

## Mobile Workflow Alignment Notes

The admin page should reflect the mobile workflow when the mobile app is the operational source.

### Marketplace products

Mobile source:
- [AddProductScreen.tsx](/home/ntumai/apps/ntumai-mobile/app/(vendor)/AddProductScreen.tsx:1)
- [EditProductScreen.tsx](/home/ntumai/apps/ntumai-mobile/app/(vendor)/EditProductScreen.tsx:1)
- marketplace service
  - [createVendorProduct](/home/ntumai/apps/ntumai-mobile/src/api/modules/marketplace/service.ts:987)
  - [getVendorStoreProducts](/home/ntumai/apps/ntumai-mobile/src/api/modules/marketplace/service.ts:1205)
  - [updateVendorProduct](/home/ntumai/apps/ntumai-mobile/src/api/modules/marketplace/service.ts:1211)

Real mobile create/edit fields:
- name
- description
- price
- stock
- category
- subcategory
- availability
- vendor store readiness
- business type used for product grouping suggestions

That means `Marketplace > Products > Create/Edit` should not be generic catalog forms. They should visibly support:
- store selection or store context
- category + subcategory flow
- price + stock
- active/publish handling
- review or QA visibility when needed

## Implementation Rules From This Audit

1. If the page is `support queue/case`, `finance queue/case`, `dispatch queue/case`, or `application review`, reuse the shared drawer/modal primitives already present.
2. If the page belongs to `products`, `categories`, `orders`, `invoices`, or `shipments`, first map it to the exact Furyroad CRUD family before editing.
3. `verified-route-family` does not mean “invent a similar page.” It means “recover or tighten toward that family.”
4. The old generic scaffold layer has been removed. Remaining drift is now page-family specific, not wrapper-driven.

## Next Tightening Order

1. `Marketplace > Products > Create`
   - highest-priority mismatch
   - route family confirmed
   - mobile workflow documented
2. `Marketplace > Categories`
   - list/create/edit should be pulled closer to the e-commerce category family
3. `Sales > Orders`
   - list/detail/edit/create should be tightened as one family
4. `Sales > Invoices`
   - detail/edit/create/builder should be tightened as one family
5. `Logistics > Shipments`
   - list/detail/edit/create should be tightened as one family
6. `Support > Snippets` and `Templates`
   - recover-first, not redesign

## Focused Pause Audit

This section is the current stop/go checkpoint after the latest tightening passes.

### Stable Enough To Stop Touching For Now

These pages are aligned enough to pause unless:
- a missing backend workflow forces a new control
- we recover a more exact local Furyroad source
- the user explicitly asks for more literal template matching

#### Operations and case flows

- `Support > Inbox`
  - direct enough to the support app-kit direction
- `Support > Tickets`
- `Support > Disputes`
- `Support > Escalations`
- `Sales > Payments`
- `Sales > Refunds`
- `Sales > Payouts`
- `Fleet > Tasker Applications`
- `Fleet > Tasker Documents`
- `Marketplace > Vendor Applications`
- `Logistics > Exceptions`

Reason:
- these are queue/case pages, not classic CRUD pages
- they already use the shared drawer/modal primitives correctly
- they are operationally useful and do not need template-perfect CRUD treatment

#### CRUD families that are good enough for now

- `Marketplace > Products > Create`
  - now aligned to the mobile vendor product workflow
- `Marketplace > Categories > Create`
- `Marketplace > Categories > Edit`
- `Sales > Orders > Detail`
- `Sales > Orders > Create`
- `Sales > Orders > Edit`
- `Sales > Invoices > Create`
- `Sales > Invoices > Edit`
- `Sales > Invoices > Builder`
- `Logistics > Shipments > Create`
- `Logistics > Shipments > Edit`

Reason:
- these were the most obvious drift pages in their families
- they now carry the real workflow fields from mobile or finance flows
- further work here would mostly be “more exact template literalness,” not a workflow gap

#### Simple list-first CRUD pages that should stay simple

- `Marketplace > Vendors`
- `Marketplace > Categories`
- `Marketplace > Reviews`
- `CRM > Customers`
- `CRM > Riders`
- `CRM > Corporate Accounts`
- `CRM > Wallets`
- `CRM > Ratings & Reviews`
- `CRM > Blocked Users`
- `Logistics > Taskers`
- `Logistics > Shipments`

Reason:
- these are better as list-first screens
- they already follow the simpler admin rule the user asked for
- more decoration would likely make them worse, not better

### Still Drifting Or Temporary

These are the pages that still have clear custom drift or incomplete template recovery and are the best candidates if work resumes.

#### Marketplace

No urgent workflow gaps remain in the main marketplace CRUD family. Remaining differences are mostly about template literalness, not missing staff capability.

#### Sales / Finance

#### Logistics

No major overview-specific drift remains after redirecting the generic logistics entrypoint to the working shipment list.

#### Global temporary scaffolds

The generic scaffold layer has been removed.

What was removed:
- `ModulePage`
- `SectionPage`
- fallback `[slug]` module routes
- unused marketplace / sales / logistics entity-list wrappers

Remaining drift is now page-specific, not wrapper-driven.

### Practical Resume Order

If work resumes later, the best next targets are:

1. selective polish on `Platform > Settings / Admin Users / Activity Logs / App Version Control`
2. selective polish on `Logistics > Zones / Service Types / Pricing`
3. support app-kit recovery for `Snippets` and `Templates`
