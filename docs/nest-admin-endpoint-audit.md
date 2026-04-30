# Nest Admin Endpoint Audit

Status: audited against the live NestJS source in `/home/ntumai/web/api.ntumai.com`  
Purpose: map the current admin frontend repositories to real backend routes and identify what staff-facing endpoints still need to be added before full integration.

## Summary

The backend is **not empty**. It already has usable domain endpoints for:

- auth / role / KYC
- marketplace orders and vendor product operations
- deliveries
- tracking
- finance payout requests and finance summaries
- support tickets

The main problem is **endpoint shape and ownership consistency**:

- some routes are consumer/mobile routes
- some routes are domain ops routes
- some routes are generic admin routes
- the current `AdminModule` is still too thin for the staff workflows the admin UI now supports

For Ntumai, the admin should remain **staff-first**:

- staff manage customers
- staff manage taskers
- staff manage vendors only as part of customer/tasker/order/settlement workflows
- queues and case views need exact linked records, not broad module lists

## Current backend modules relevant to admin

### Already present and useful

- `auth`
  - role selection
  - profile
  - addresses
  - onboarding draft/completion
  - KYC submission and admin review
- `customer-orders`
  - unified customer feed across marketplace, delivery, and task bookings
- `deliveries`
  - delivery creation, list, detail, dispatch status, rider progression
- `tracking`
  - delivery tracking timeline, booking tracking, public tracking
- `marketplace`
  - categories, products, stores, vendor orders, customer orders
- `support`
  - user-scoped support tickets
- `finance`
  - finance summary
  - transactions
  - payout requests
  - payout rules
  - loyalty
  - subscriptions
  - tasker earnings goals
- `admin`
  - generic users, categories, brands, banners, settings, stores, products, support ticket list/update

### Present but not yet admin-ready for our UI

- `payments`
  - only payment methods, not payments ops queue
- `support`
  - no escalations, disputes, inbox, or template admin APIs
- `deliveries` / `tracking`
  - strong mobile ops routes, but no admin list/detail contracts shaped for staff dashboards
- `customer-orders`
  - customer-scoped feed only, not admin order command pages

## Frontend repository to backend route mapping

### 1. Customers

Frontend repository:

- `src/repositories/admin/customers.ts`

Current backend routes that partially help:

- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:userId`
- `GET /api/v1/auth/me`
- `PATCH /api/v1/auth/me`
- `GET /api/v1/auth/me/addresses`

What works now:

- admin can list users generically
- admin can update basic user fields and role
- auth module exposes role status / KYC / activation state patterns

What is still missing for the current admin UI:

- dedicated customer list contract
- dedicated customer detail contract
- linked wallet / payments / support / orders summary in one payload
- exact “customer profile” admin endpoint

Recommended new admin endpoints:

- `GET /api/v1/admin/customers`
- `GET /api/v1/admin/customers/:customerId`
- `PATCH /api/v1/admin/customers/:customerId/status`
- `GET /api/v1/admin/customers/:customerId/timeline`

Minimum DTO target:

- `CustomerSummaryDto`
- `CustomerDetailDto`
- `CustomerTimelineDto`

Must include:

- `customerId`
- active role
- role matrix
- wallet posture
- linked order count
- linked delivery count
- support ticket count
- latest finance flags

### 2. Orders

Frontend repository:

- `src/repositories/admin/orders.ts`

Current backend routes that partially help:

- `GET /api/v1/customer/orders`
- `GET /api/v1/marketplace/customer/orders`
- `GET /api/v1/marketplace/customer/orders/:orderId`
- `GET /api/v1/marketplace/customer/orders/:orderId/tracking`
- `POST /api/v1/marketplace/customer/orders/:orderId/cancel`
- `GET /api/v1/marketplace/vendor/stores/:storeId/orders`
- `PATCH /api/v1/marketplace/vendor/stores/:storeId/orders/:orderId/status`

What works now:

- backend already knows marketplace order detail
- customer unified feed already merges marketplace + delivery + task concepts
- vendor-side order operations exist

What is still missing for the admin UI:

- admin order list endpoint with filters
- admin order detail endpoint with customer, vendor, payment, dispatch, and support context
- admin status transition endpoints for staff interventions

Recommended new admin endpoints:

- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/orders/:orderId`
- `PATCH /api/v1/admin/orders/:orderId/status`
- `POST /api/v1/admin/orders/:orderId/escalate`
- `POST /api/v1/admin/orders/:orderId/refund-review`

Minimum DTO target:

- `OrderSummaryDto`
- `OrderDetailDto`

Must include:

- `orderId`
- `customerId`
- `vendorId`
- linked `shipmentId` or `deliveryId`
- payment status
- fulfillment status
- cancellation status
- support/dispute flags

### 3. Shipments / deliveries / tracking

Frontend repositories:

- `src/repositories/admin/shipments.ts`

Current backend routes that partially help:

- `GET /deliveries`
- `GET /deliveries/:id`
- `GET /deliveries/:id/dispatch-status`
- `GET /tracking/delivery/:deliveryId`
- `GET /tracking/public/:trackingId`

What works now:

- delivery detail and dispatch-status routes exist
- public and internal tracking routes already exist
- deliveries contain enough structure to back shipment-like admin pages

What is still missing for the admin UI:

- admin shipment list contract with filters and pagination
- admin shipment detail contract shaped for staff pages
- exact tasker + customer + linked order context bundled together
- route naming consistency with the admin’s `shipment` vocabulary

Recommended new admin endpoints:

- `GET /api/v1/admin/shipments`
- `GET /api/v1/admin/shipments/:shipmentId`
- `GET /api/v1/admin/shipments/:shipmentId/tracking`
- `POST /api/v1/admin/shipments/:shipmentId/assign`
- `POST /api/v1/admin/shipments/:shipmentId/intervene`

Minimum DTO target:

- `ShipmentSummaryDto`
- `ShipmentDetailDto`
- `ShipmentTrackingDto`

Must include:

- `shipmentId`
- `trackingId`
- `orderId`
- `customerId`
- `taskerId`
- pickup / dropoff summary
- ETA / SLA state
- dispatch state
- latest exception state

### 4. Support

Frontend repositories:

- `src/repositories/admin/support.ts`
- `src/repositories/admin/support-templates.ts`

Current backend routes that partially help:

- `GET /api/v1/support/tickets`
- `POST /api/v1/support/tickets`
- `GET /api/v1/support/tickets/:ticketId`
- `GET /api/v1/admin/support/tickets`
- `PATCH /api/v1/admin/support/tickets/:id`

What works now:

- ticket entity exists
- user-scoped ticket routes exist
- generic admin list/update exists

What is still missing for the admin UI:

- no support inbox API
- no escalation API
- no dispute API
- no support template API
- no staff-facing case detail payload with linked order/shipment/payment/customer/tasker/vendor refs

Recommended new admin endpoints:

- `GET /api/v1/admin/support/tickets`
- `GET /api/v1/admin/support/tickets/:ticketId`
- `PATCH /api/v1/admin/support/tickets/:ticketId`
- `GET /api/v1/admin/support/escalations`
- `GET /api/v1/admin/support/disputes`
- `GET /api/v1/admin/support/inbox`
- `GET /api/v1/admin/support/templates`
- `GET /api/v1/admin/support/templates/:templateId`
- `PATCH /api/v1/admin/support/templates/:templateId`

Minimum DTO target:

- `SupportCaseSummaryDto`
- `SupportCaseDetailDto`
- `SupportTemplateSummaryDto`
- `SupportTemplateDetailDto`

Must include:

- `supportCaseId`
- `customerId`
- `taskerId`
- `vendorId`
- `orderId`
- `shipmentId`
- lane
- priority
- owner
- internal notes
- timeline
- next action state

### 5. Payments / refunds / payouts

Frontend repositories:

- `src/repositories/admin/finance.ts`

Current backend routes that partially help:

- `GET /api/v1/finance/summary`
- `GET /api/v1/finance/transactions`
- `GET /api/v1/finance/payout-requests`
- `POST /api/v1/finance/payout-requests`
- `PATCH /api/v1/finance/payout-requests/:id/status`
- `GET /api/v1/finance/admin/payout-settings`
- `PATCH /api/v1/finance/admin/payout-settings`

What works now:

- payout request lifecycle already exists
- finance summary and transaction primitives exist
- admin payout rule controls already exist

What is still missing for the admin UI:

- no payment ops queue endpoint
- no refund queue endpoint
- no dispute-to-refund resolution endpoint
- no staff-facing finance case detail route
- no exact `PaymentCase` / `RefundCase` payloads

Recommended new admin endpoints:

- `GET /api/v1/admin/payments`
- `GET /api/v1/admin/payments/:paymentId`
- `GET /api/v1/admin/refunds`
- `GET /api/v1/admin/refunds/:refundId`
- `PATCH /api/v1/admin/refunds/:refundId/status`
- `GET /api/v1/admin/payout-requests`
- `GET /api/v1/admin/payout-requests/:payoutRequestId`

Minimum DTO target:

- `PaymentCaseSummaryDto`
- `PaymentCaseDetailDto`
- `RefundCaseSummaryDto`
- `RefundCaseDetailDto`
- `PayoutRequestAdminDto`

Must include:

- `paymentId`
- `refundId`
- `payoutRequestId`
- `customerId`
- `taskerId`
- `vendorId`
- `orderId`
- amount
- currency
- source / destination
- risk flags
- approval state
- notes / audit info

## Existing routes usable immediately in the next frontend integration pass

These can be wired first with minimal backend changes:

- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:userId`
- `GET /api/v1/admin/categories`
- `POST /api/v1/admin/categories`
- `PATCH /api/v1/admin/categories/:id`
- `GET /api/v1/admin/products`
- `PATCH /api/v1/admin/products/:id`
- `GET /api/v1/admin/support/tickets`
- `PATCH /api/v1/admin/support/tickets/:id`
- `GET /api/v1/finance/payout-requests`
- `PATCH /api/v1/finance/payout-requests/:id/status`
- `GET /api/v1/finance/admin/payout-settings`
- `PATCH /api/v1/finance/admin/payout-settings`
- `GET /tracking/delivery/:deliveryId`
- `GET /deliveries/:id`
- `GET /deliveries/:id/dispatch-status`
- `GET /api/v1/auth/admin/kyc/submissions`
- `POST /api/v1/auth/admin/kyc/:userId/:role/review`

## Backend gaps that must be filled before full admin parity

### High priority

- exact customer profile admin endpoint
- exact order detail admin endpoint
- exact shipment list/detail admin endpoints
- support escalations/disputes/inbox endpoints
- refund ops endpoints
- staff access / roles endpoint shaped for admin users page

### Medium priority

- support template CRUD endpoints
- vendor detail endpoint for admin use
- tasker detail endpoint for admin use
- finance payment-case list/detail endpoints

## Recommended backend structure from here

Do **not** push everything into the current generic `AdminModule`.

Preferred pattern:

- keep `AdminModule` only for:
  - cross-domain summary
  - shared admin settings
  - platform-wide admin utilities
- add per-domain admin controllers:
  - `AdminCustomersController`
  - `AdminOrdersController`
  - `AdminShipmentsController`
  - `AdminSupportController`
  - `AdminFinanceController`
  - `AdminTaskersController`
  - `AdminVendorsController`

Each one should live inside its owning domain module wherever possible.

## Immediate frontend integration sequence

1. Wire the frontend to existing admin/user/category/product/support-ticket/payout endpoints.
2. Add admin shipment list/detail endpoints in NestJS.
3. Add admin customer detail + order detail endpoints.
4. Add support escalations/disputes/inbox endpoints.
5. Add refunds and payment-case admin endpoints.

This order matches the current staff workflows in the admin UI and keeps the customer/tasker-management focus intact.
