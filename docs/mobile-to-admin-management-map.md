# Mobile To Admin Management Map

Status: working analysis  
Date: May 1, 2026  
Purpose: identify the real operational workflows exposed by the mobile app and map them to the admin workflows that staff need in order to manage users, live operations, risk, and finance.

This document is a companion to:

- `docs/mobile-admin-workflow-audit.md`
- `docs/admin-feature-gap-report.md`
- `docs/nest-admin-endpoint-audit.md`

## Source of truth used

Primary mobile sources:

- mobile routes under `/home/ntumai/apps/ntumai-mobile/app`
- mobile API modules under `/home/ntumai/apps/ntumai-mobile/src/api/modules`
- mobile profile/preferences/wallet stores under `/home/ntumai/apps/ntumai-mobile/src`

Primary admin/backend sources:

- admin menu structure in `src/layouts/hydrogen/menu-items.tsx`
- admin repositories in `src/repositories/admin`
- backend admin routes in `/home/ntumai/web/api.ntumai.com/src/modules/admin/presentation/controllers/admin.controller.ts`
- backend auth/onboarding entities in `/home/ntumai/web/api.ntumai.com/src/modules/auth`

MCP note:

- `ntumaiDocs` and `ntumaiBackend` were attempted first, but both MCP servers failed to initialize in this session, so this map falls back to direct source inspection.

## What this answers

The question is not only “what screens exist on mobile?”

The question is:

- what can mobile users actually do
- what records and state transitions those actions create
- whether staff can currently see and manage those transitions in admin
- which staff workflows are missing even if the mobile workflow already exists

## Core relationship model

These are the main operating relationships implied by the current mobile app.

### Identity and access

- `User`
- `UserRoleAssignment`
- `activeRole`
- `roleStatuses`
- `kycStatuses`
- `activationStatuses`
- `preferences`
- `notification devices`

This matters because the same person can move between `customer`, `tasker`, and `vendor`, while admin must still see one unified operational history.

### Customer-side operations

- `Customer -> MarketplaceOrder -> Payment -> Refund/Dispute -> Shipment/Delivery -> Tasker -> Tracking -> SupportTicket`
- `Customer -> DeliveryRecord -> Tracking -> Rider/Tasker -> SupportTicket`
- `Customer -> Booking/Task -> Offer -> Accepted Tasker -> Progress -> Rating -> SupportTicket`
- `Customer -> Wallet/Transactions -> PaymentMethods -> Tips -> Loyalty -> Subscriptions`

### Vendor-side operations

- `Vendor User -> Vendor Store -> Products -> Categories/Brands -> Promotions -> Store Orders -> Dispatch Handoff`
- `Vendor -> Subscription Plan -> Billing State`
- `Vendor -> Payout Requests -> Settlements`
- `Vendor -> Onboarding Draft -> KYC -> Activation`

### Tasker-side operations

- `Tasker User -> Onboarding Draft -> KYC Documents -> Activation`
- `Tasker -> Shift -> Location Heartbeats -> Availability -> Job Offers`
- `Tasker -> Delivery/Booking Execution -> Progress Updates -> Ratings`
- `Tasker -> Compliance Cases -> Warnings -> Strikes -> Appeals`
- `Tasker -> Earnings -> Payout Requests -> Float`

### Cross-cutting operations

- `Notification -> User -> Device -> Linked Entity`
- `SupportTicket -> Customer/Tasker/Vendor + Order/Shipment/Booking/Payment context`
- `Public Tracking Link -> Tracking ID -> Delivery + Rider location`

## Mobile workflow families

## 1. Access, role, and onboarding workflows

### Mobile behavior identified

- login and OTP auth
- role confirmation when adding a secondary role
- onboarding intro and draft-save flows for `tasker` and `vendor`
- KYC upload, delete, submit
- role-based routing using `roleStatuses`, `kycStatuses`, and `activationStatuses`

Main source surfaces:

- `app/(auth)/role-confirmation.tsx`
- `src/api/modules/onboarding/service.ts`
- `src/api/modules/kyc/service.ts`
- backend auth DTOs and onboarding entities

### Relationships created

- user role request
- onboarding draft per role
- KYC document set per role
- approval/rejection status
- activation status

### Current admin management coverage

Partly covered:

- admin auth is now separate and real
- platform access management exists for admin staff users
- some customer list/detail visibility exists

Not operationally covered well:

- no role access request queue
- no unified onboarding command center
- no one-screen view for role status + KYC + activation + store/tasker readiness
- no proper resubmission / reviewer-notes workflow in admin frontend

### Admin workflows that must exist

- `Role Access Requests`
- `Tasker Onboarding Queue`
- `Vendor Onboarding Queue`
- `KYC Review Queue`
- `Rejected / Resubmission Queue`
- `Account Activation / Hold / Suspend workflow`

## 2. Customer marketplace workflows

### Mobile behavior identified

Customer can:

- browse vendors, products, categories, promotions
- manage cart
- calculate delivery
- create marketplace order
- process payment
- track order
- cancel order
- rate order
- reorder
- manage favorites and wishlist

Main source surfaces:

- `src/api/modules/marketplace/service.ts`
- `src/api/modules/customer-orders/service.ts`

### Relationships created

- customer
- vendor/store
- product/category
- cart
- order
- payment
- shipment/delivery
- review
- support/dispute

### Current admin management coverage

Partly covered:

- live admin order list/detail exists
- live shipment list/detail/tracking exists

Weak or missing:

- no admin command workflow for failed checkout
- no vendor fulfillment board tied to order handoff
- no review moderation queue
- no merchandising or discovery controls
- no promo governance across vendor promos and platform promos
- no unified order cancellation / refund / dispatch comparison page

### Admin workflows that must exist

- `Marketplace Order Command Page`
- `Vendor Fulfillment Board`
- `Order Cancellation + Refund Review flow`
- `Marketplace Review Moderation Queue`
- `Merchandising / Search / Visibility controls`
- `Promo Console: platform + vendor-owned promotions`

## 3. Customer direct parcel delivery workflows

### Mobile behavior identified

Customer can:

- estimate delivery price
- create a delivery request
- attach pricing
- choose payment method
- preflight and submit
- schedule future delivery
- cancel delivery
- track delivery privately and via public tracking link

Main source surfaces:

- `src/api/modules/deliveries/service.ts`
- `app/(customer)/SendParcelScreen.tsx`
- `src/api/modules/tracking/service.ts`
- `app/public-tracking/[trackingId].tsx`

### Relationships created

- customer
- delivery record
- stops
- payment method
- ready token / submission state
- assigned rider/tasker
- tracking events
- public tracking ID

### Current admin management coverage

Partly covered:

- shipments list/detail/tracking are live in admin

Missing:

- no delivery creation or editing flow in admin
- no staff-side intervention panel for stuck delivery lifecycle states
- no exception queue for submission failure, rider unassignment, stale tracking, or no-heartbeat cases
- no staff tooling for public tracking issues

### Admin workflows that must exist

- `Delivery Command Center`
- `Dispatch Exception Queue`
- `Public Tracking Diagnostics`
- `Manual Assignment / Reassignment`
- `Lifecycle override with audit trail`

## 4. Customer task / errand booking workflows

### Mobile behavior identified

Customer can:

- estimate task pricing
- create task booking
- include pickup/dropoff/extra stops
- attach shopping list, checklist, photos
- set waiting time, schedule, budget, and commitment amount
- cancel booking
- track booking progress and location
- rate tasker

Main source surfaces:

- `src/api/modules/matching/service.ts`
- `app/(customer)/DoTaskScreen.tsx`
- `src/api/modules/customer-orders/service.ts`

### Relationships created

- customer
- booking/task
- pricing estimate
- offer(s)
- selected tasker
- progress stages
- rating
- support case

### Current admin management coverage

Very weak:

- there is no proper admin booking/trip command workflow
- current admin uses `Sales > Orders` as a loose proxy
- no live task booking queue, offer monitor, or progress intervention tools were found in admin frontend

### Admin workflows that must exist

- `Bookings / Trips command page`
- `Offer Queue and Race Conditions monitor`
- `Task Booking Dispatch Board`
- `Task Progress Intervention panel`
- `Commitment Amount / spend-risk review workflow`

## 5. Tasker workforce workflows

### Mobile behavior identified

Tasker can:

- onboard and upload verification docs
- view compliance standing
- open violations and appeals
- go online/offline
- start/end shift
- update location
- accept or release delivery
- update task/delivery progress
- view nearby jobs
- manage scheduled shifts
- manage zones and availability
- view earnings and payouts
- create payout requests
- view heatmap and performance
- rate customer

Main source surfaces:

- `src/api/modules/tasker/service.ts`
- `src/api/modules/compliance/service.ts`
- `app/(tasker)/ProbationScreen.tsx`
- `app/(tasker)/ViolationsScreen.tsx`
- `app/(shared)/UrgentAlertsIntroScreen.tsx`

### Relationships created

- tasker
- onboarding state
- KYC documents
- compliance cases
- appeals
- shift
- location heartbeat
- zone preference
- job offer
- active delivery / booking
- earnings / payout request

### Current admin management coverage

Mostly missing:

- no live shift roster in admin
- no active offer/acceptance conflict view
- no compliance case management UI tied to tasker profile
- no appeals resolution console
- no tasker performance timeline in admin
- no float / payout command workflow

Only partial:

- shipments can expose linked tasker context
- finance queues are readable
- support disputes/escalations are partly wired

### Admin workflows that must exist

- `Tasker Command Page`
- `Live Shift Roster`
- `Offer / Acceptance / Timeout monitor`
- `Tasker Compliance + Appeals Queue`
- `Tasker Earnings / Payout / Float ledger`
- `Tasker Performance timeline`

## 6. Vendor marketplace-ops workflows

### Mobile behavior identified

Vendor can:

- save onboarding draft
- configure payout method during onboarding
- view store admin details
- pause/unpause store
- manage products
- manage categories/brands indirectly through product options
- manage promotions
- manage business hours
- manage vendor orders and progress statuses
- view analytics and export reports
- view wallet and payouts
- manage subscription plan

Main source surfaces:

- `src/api/modules/onboarding/service.ts`
- `src/api/modules/marketplace/service.ts`
- `src/api/modules/finance/service.ts`
- `app/(vendor)/*`

### Relationships created

- vendor user
- store
- products
- categories / brand options
- promotions
- orders
- business hours
- reports
- subscription
- payout requests

### Current admin management coverage

Weak overall:

- products, vendors, categories are still largely fixture-backed in admin
- no real vendor onboarding queue in admin frontend
- no store provisioning diagnostics view
- no vendor order operations board tied to dispatch handoff
- no vendor subscription management UI
- no vendor settlement queue in admin

### Admin workflows that must exist

- `Vendor Onboarding + Provisioning Queue`
- `Vendor Store Command Page`
- `Vendor Product Moderation Queue`
- `Vendor Order Handoff Board`
- `Vendor Hours / Pause / Closure controls`
- `Vendor Subscription and Billing State`
- `Vendor Settlements / Payout queue`

## 7. Support, compliance, and case workflows

### Mobile behavior identified

Users can:

- create support tickets
- list support tickets
- open help/support and support chat
- taskers can view compliance summary and cases
- taskers can submit appeals

Main source surfaces:

- `src/api/modules/support/service.ts`
- `src/api/modules/compliance/service.ts`

### Relationships created

- support ticket
- compliance case
- appeal
- linked order/delivery/booking/payment/user

### Current admin management coverage

Partly covered and strongest among current admin modules:

- support inbox
- support tickets
- support escalations
- support disputes
- reply actions

Still missing:

- a unified case console that merges support + compliance + finance context cleanly
- staff workflows for appeal resolution
- tighter entity binding for booking/task flows

### Admin workflows that must exist

- `Unified Case Console`
- `Appeals Review Queue`
- `Linked Entity Timeline per case`
- `Case ownership + SLA tracking`

## 8. Finance and wallet workflows

### Mobile behavior identified

Across customer/tasker/vendor, mobile exposes:

- finance summary
- transaction history
- payout request history
- create payout request
- vendor subscription selection
- customer subscriptions
- loyalty and redemption
- tips
- tasker earnings goals

Main source surfaces:

- `src/api/modules/finance/service.ts`
- `src/store/slices/walletSlice.ts`

### Important distinction

Not every visible mobile finance flow is actually fully backend-enabled.

Specifically:

- customer stored-value top-up is explicitly not enabled
- customer stored-value withdrawal is explicitly not enabled

That means admin should not be designed as if there is already a full customer wallet ledger with top-up/withdraw operations. Today it looks more like payment history plus role-based payout flows for `tasker` and `vendor`.

### Current admin management coverage

Partly covered:

- payment queue read path
- refund queue read path

Missing:

- payout approvals
- vendor settlement operations
- tasker payout operations
- customer subscription management
- vendor subscription management
- loyalty operations
- tips ledger
- earnings-goal campaign management

### Admin workflows that must exist

- `Payout Approval Queue`
- `Vendor Settlement Queue`
- `Tasker Payout Queue`
- `Customer Subscription Management`
- `Vendor Plan / Billing Management`
- `Loyalty and Reward Operations`
- `Tips Ledger by entity type`

## 9. Notifications and communication workflows

### Mobile behavior identified

Mobile supports:

- notification list
- mark read / mark all read / delete
- device registration to backend
- realtime notification socket
- role-targeted urgent alerts
- notification metadata linked to `order`, `delivery`, `booking`, `support_ticket`, and `payout_request`

Main source surfaces:

- `src/api/modules/notifications/service.ts`
- `src/api/modules/notifications/types.ts`
- `app/_layout.tsx`
- `app/(shared)/UrgentAlertsIntroScreen.tsx`

### Relationships created

- user
- notification
- device registration
- notification type
- linked entity

### Current admin management coverage

Mostly missing:

- growth notifications page is static
- no comms history by user
- no device registration audit
- no urgent-alert delivery observability
- no notification campaign console tied to role and entity type

### Admin workflows that must exist

- `Communications History`
- `Notification Delivery Audit`
- `Device Registration / Push Health view`
- `Campaign and Trigger Management`

## Current admin coverage summary

Current admin is best understood as:

- `partly live for records`: customers, orders, shipments, support, finance queues, platform access
- `still weak for staff action workflows`: dispatch, fleet, vendor ops, compliance ops, subscriptions, settlements, review moderation, notifications

So the missing work is not mainly “add more pages”.

It is:

- add queue ownership
- add explicit state machines
- add action panels
- add linked timelines
- add exception-first operations views

## Missing admin workflows by priority

## P0: must exist for operational control

- `Tasker onboarding, KYC, documents, activation, appeals`
- `Vendor onboarding, store provisioning, activation, pause/unpause`
- `Bookings / Trips command center`
- `Delivery / Shipment command center`
- `Dispatch exception queue`
- `Payout approval and settlements queue`
- `Unified support + compliance case console`

## P1: required for business management

- `Vendor product moderation and vendor order handoff board`
- `Customer subscription operations`
- `Vendor subscription and billing operations`
- `Tasker performance and live shift roster`
- `Review moderation`
- `Customer wallet/payment method visibility`
- `Notification delivery audit`

## P2: useful but secondary

- `Merchandising and search controls`
- `Loyalty operations`
- `Tips ledger`
- `Public tracking diagnostics dashboard`
- `Preference and device troubleshooting views`

## Recommended admin build model

Admin should not be built as isolated static pages.

It should be built around these primitives:

- `Queues`
- `Command pages`
- `Case timelines`
- `Intervention actions`
- `Reason codes`
- `Audit trail`
- `Ownership and SLA`

In practical terms, the next implementation step should be a workflow-first matrix with these columns:

- `Workflow`
- `Mobile trigger`
- `Entities touched`
- `Current backend route`
- `Current admin frontend coverage`
- `Missing staff action`
- `Priority`

## Bottom line

Yes, the mobile app already exposes enough real workflows to tell us what the admin must manage.

The biggest missing admin capability is not raw CRUD. It is operational management of live workflow state:

- onboarding and approval
- tasker and vendor readiness
- bookings and delivery intervention
- compliance and appeals
- settlements and payouts
- communications and notification audit

That is the clearest path to deciding what should be built next in admin.
