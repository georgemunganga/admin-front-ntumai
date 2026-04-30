# Admin Module Audit

This audit is based on the current Next.js admin workspace and is intended to guide the NestJS admin API integration layer.

## Audited frontend sources

- `src/components/crm/customer-data.ts`
- `src/components/logistics/shipment-data.ts`
- `src/components/sales/order-data.ts`
- `src/components/marketplace/vendor-data.ts`
- `src/components/support/support-ticket-queue-page.tsx`
- `src/components/support/support-escalation-queue-page.tsx`
- `src/components/support/dispute-review-queue-page.tsx`
- `src/components/finance/payment-ops-queue-page.tsx`
- `src/components/finance/refund-approval-queue-page.tsx`

## Current shared patterns found in the frontend

- `status`
  - repeated across CRM, logistics, marketplace, support, finance, and dispatch
  - normalized values: `live | stable | review | monitoring | queued | paused | at_risk`
- `timeline`
  - repeated as `{ label, detail, time }`
- `links`
  - repeated as operator workflow exits to related records or queues
- `notes`
  - repeated in queue drawers and detail views
- `riskFlags`
  - repeated in finance and disputes flows

These are now centralized in `src/contracts/admin-domain.ts`.

## Minimum backend entities already implied by the UI

- `Customer`
  - profile, wallet posture, lifecycle status, support history, payment method, timeline
- `Vendor`
  - segment, fulfillment mode, visibility, payout settings, metrics, timeline
- `Order`
  - order number, customer, vendor, city, delivery address, totals, payment state, tracking, timeline
- `Shipment`
  - tracking id, customer, recipient, pickup, dropoff, tasker, lane, timeline
- `SupportCase`
  - ticket/escalation/dispute lane, summary, notes, workflow links, related entities
- `PaymentCase`
  - lane, source summary, amount, method, risk flags, related customer/order
- `RefundCase`
  - lane, destination, amount, risk flags, related customer/order
- `DispatchCase`
  - lane, route issue, tasker state, related customer/order/shipment

## Minimum relationships required for clean admin integration

- `SupportCase.customerId`
- `SupportCase.vendorId`
- `SupportCase.taskerId`
- `SupportCase.orderId`
- `SupportCase.shipmentId`
- `PaymentCase.customerId`
- `PaymentCase.orderId`
- `RefundCase.customerId`
- `RefundCase.orderId`
- `Shipment.orderId`
- `Shipment.taskerId`
- `Order.customerId`
- `Order.vendorId`

Without these foreign keys, the admin UI must keep falling back to module-level links instead of exact record routes.

## Recommended NestJS module boundaries

- `crm`
  - customers, wallets, ratings, blocked users
- `marketplace`
  - vendors, products, categories, reviews
- `sales`
  - orders, invoices, payments, refunds, payouts
- `logistics`
  - shipments, tracking, taskers, exceptions, zones
- `support`
  - inbox, tickets, escalations, disputes, templates
- `dispatch`
  - manual dispatch, scheduled rides, recovery queues

## Recommended DTO direction

- shared enums:
  - `AdminStatus`
  - lane enums per domain: `SupportLane`, `PaymentLane`, `RefundLane`, `DispatchLane`
- shared structs:
  - `TimelineEntryDto`
  - `ActionLinkDto` only if the backend intentionally drives workflow actions
  - `EntityRefsDto`
- per-resource DTOs:
  - `CustomerSummaryDto`
  - `CustomerDetailDto`
  - `OrderSummaryDto`
  - `OrderDetailDto`
  - `ShipmentSummaryDto`
  - `ShipmentDetailDto`
  - `SupportCaseSummaryDto`
  - `SupportCaseDetailDto`
  - `PaymentCaseSummaryDto`
  - `RefundCaseSummaryDto`

## Integration priority

1. `customers`
2. `orders`
3. `shipments`
4. `support cases`
5. `payments`
6. `refunds`
7. `vendors`
8. `taskers`

This order matches the highest-traffic cross-linking already present in the admin UI.
