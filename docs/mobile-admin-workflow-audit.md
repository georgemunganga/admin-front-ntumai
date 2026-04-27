# Ntumai Mobile-to-Admin Workflow Audit

Status: audit only  
Scope: mobile workflows mapped to current admin ERP modules  
Implementation: deferred until this audit is reviewed and approved

## How to read this

This document is meant to be understandable from either side:

- Mobile/frontend side: what the user is doing in the app, which screen they use, and which service/API module is involved.
- Admin/backend side: which staff team owns the workflow, which admin page should support it, and what action is still missing.

This is not a build spec yet. It is a staff-operations audit so we can make the admin app reduce manual work instead of just listing data.

## Source of truth used

Primary mobile sources reviewed:

- Mobile routes under `/home/ntumai/apps/ntumai-mobile/app`
- API modules under `/home/ntumai/apps/ntumai-mobile/src/api/modules`
- Role/onboarding routing in:
  - `/home/ntumai/apps/ntumai-mobile/app/(auth)/role-confirmation.tsx`
  - `/home/ntumai/apps/ntumai-mobile/app/(auth)/otp-verification.tsx`
  - `/home/ntumai/apps/ntumai-mobile/app/(tasker)/*`
  - `/home/ntumai/apps/ntumai-mobile/app/(vendor)/*`

Current admin structure reviewed:

- Sidebar/module structure in `/home/ntumai/web/admin.ntumai.com/src/layouts/hydrogen/menu-items.tsx`
- Admin routes under `/home/ntumai/web/admin.ntumai.com/src/app`

## Current admin module map

The admin already has the right top-level ERP direction:

- `Dispatch`
- `Logistics`
- `Fleet`
- `Sales`
- `Marketplace`
- `CRM`
- `Support`
- `Risk`
- `Growth`
- `Platform`

This is a good base. The main problem now is not module naming. It is whether each module actually helps staff complete the real job behind the mobile workflow.

## Staff owner model

This audit uses these staff owners:

- `Dispatch`: live assignment, trip/delivery intervention, failed matching, exception handling
- `Fleet`: tasker onboarding, tasker readiness, documents, vehicles, availability state
- `Logistics`: fulfillment operations, tracking, zones, service types, pricing by movement mode
- `Marketplace Ops`: vendor/store/product/order readiness
- `CRM`: customer profile, wallet, ratings, customer recovery, account flags
- `Support`: ticket handling, disputes, escalations, customer-tasker-vendor issue coordination
- `Risk & Compliance`: KYC, suspensions, fraud, safety, rejected onboarding, emergency flows
- `Finance`: payments, refunds, payouts, subscriptions, loyalty, incentives accounting
- `Growth`: promotions, incentives, notifications, retention mechanics
- `Platform`: staff roles, settings, reporting, content, app control, audit logs

## Workflow matrix

### 1. Auth, role access, and role switching

| Mobile workflow | Mobile screens / logic | Key API / data surface | Staff owner | Current admin alignment | Gap / risk | Recommended admin capability |
| --- | --- | --- | --- | --- | --- | --- |
| Role selection before login | `/(launch)/role-selection`, `/(launch)/onboarding`, `/(auth)/login-input` | role intent passed through auth flow | Platform, Risk | No explicit admin page for role-access requests | Staff cannot easily see who requested tasker/vendor access but did not finish | Add `Platform > Role Access Requests` with requested role, current role set, completion status |
| OTP verification and post-login routing | `/(auth)/otp-verification` | auth session, role-based redirect | Platform | No admin issue unless auth fails | Hard to diagnose “why user landed here” or “why routing changed” | Add auth event/audit view under `Platform > Admin Activity Logs` or future `Platform > User Access Logs` |
| Role confirmation and add-secondary-role flow | `/(auth)/role-confirmation` | user `roleStatuses`, active role, onboarding redirect | Platform, Risk | No direct admin tooling | Staff cannot manually reconcile mixed-role accounts cleanly | Add user role matrix on profile: customer/tasker/vendor access, active role, onboarding state, KYC state, activation state |
| Switching active role after account exists | implied by mobile auth state and role-gated layouts | auth store, role statuses | CRM, Fleet, Marketplace Ops | Not visible in current admin | Staff cannot tell which role the user is currently operating under | Add role-switch history and active-role display on user profile |

### 2. Tasker ops matrix

Tasker is the courier-side workforce umbrella. Vehicle mode is a subtype, not a separate people category.

| Mobile workflow | Mobile screens | Key API / service surface | Staff owner | Current admin module/page | Gap / risk | Recommended admin capability |
| --- | --- | --- | --- | --- | --- | --- |
| Tasker onboarding intro and draft save | `/(tasker)/OnboardingIntro`, `/(tasker)/DriverOnboarding`, `/(tasker)/VerificationScreen` | `onboardingService.getTaskerDraft`, `saveTaskerDraft` | Fleet, Risk | `Fleet > Tasker Applications`, `Fleet > Tasker Documents`, `Risk > Safety & Compliance` | Admin likely shows generic placeholders, not an approval queue with draft completeness | Add application queue with stage, missing fields, missing docs, last save time |
| Tasker onboarding submitted but waiting for review | mobile route gating via `roleStatuses`, `activationStatuses`, `kycStatuses` | auth user role metadata | Fleet, Risk | `Fleet`, `Risk` | Staff cannot see exact blocker state from one screen | Add unified onboarding decision page: onboarding status, KYC status, activation status, notes, approver |
| License verification / document review | `/(tasker)/LicenseVerificationScreen` | onboarding + KYC status | Risk, Fleet | `Fleet > Tasker Documents` | Missing approval actions, rejection reasons, expiry tracking, resubmission loop | Add per-document approve/reject, expiry center, resubmission request, audit trail |
| Probation / violations | `/(tasker)/ProbationScreen`, `/(tasker)/ViolationsScreen` | tasker account state, likely enforcement flags | Risk, Fleet | `Risk > Safety & Compliance`, `Fleet > Taskers` | No dedicated conduct/violation view | Add violation ledger, probation status, appeal notes, automatic restriction state |
| View nearby jobs | `/(tasker)/AvailableJobsScreen`, `/(tasker)/(tabs)/jobs` | `taskerService.getNearbyDeliveries` | Dispatch, Logistics | `Dispatch > Live Map`, `Dispatch > Bookings / Trips` | Staff cannot compare offered jobs vs accepted jobs vs abandoned jobs | Add offer queue and job pool monitor by zone, mode, age |
| Accept job / race conditions | `/(tasker)/IncomingJobScreen`, `JobOfferScreen` | `taskerService.acceptDelivery` with 409 conflict handling | Dispatch | `Dispatch > Manual Dispatch`, `Dispatch > Live Map` | Staff likely cannot see acceptance conflicts, stale offers, or job requeue state | Add dispatch exception feed: accepted elsewhere, no longer available, reassigned, timed out |
| Active job execution | `/(tasker)/ActiveJobScreen`, `OrderDeliveryFirstStep`, `SecondStep`, `LastStep` | `markDeliveryInTransit`, `completeDelivery`, `releaseDelivery` | Dispatch, Logistics, Support | `Dispatch`, `Logistics > Shipments`, `Support > Disputes` | Missing staff actions for manual progression, forced release, proof review, failure reason handling | Add delivery intervention panel with force state change, release reason, customer impact note |
| Rate customer after delivery | `/(tasker)/RateCustomerScreen` | `taskerService.rateCustomer` | CRM, Risk | `CRM > Ratings & Reviews` | Ratings likely not linked to delivery context or action history | Add two-sided ratings view tied to delivery/task ID |
| Delivery history | `/(tasker)/DeliveryHistory`, `TaskerOrders` | `taskerService.getDeliveryHistory` | Fleet, Support, Finance | `Fleet > Taskers`, `Sales > Orders`, `Logistics > Shipments` | No single tasker operating history screen | Add tasker timeline: jobs, cancellations, payouts, ratings, violations |
| Start/end shift | tasker dashboard, jobs, availability UX | `getCurrentShift`, `startShift`, `endShift` | Fleet, Dispatch | `Fleet > Taskers`, `Dispatch > Live Map` | Staff need live shift state, not only profile state | Add live shift roster with mode, current zone, online/offline, shift age |
| Update current location | background/location flows | `updateCurrentShiftLocation` | Dispatch | `Dispatch > Live Map` | If tasker stops updating, staff need stale-location alerts | Add stale GPS / no-heartbeat flags in live operations views |
| Tasker summary and performance | `TaskerDashboard`, `EarningsDashboardScreen` | `getSummary`, `getPerformance` | Fleet, Growth | `Fleet > Overview`, `Growth > Tasker Incentives` | Admin likely not broken down by availability, acceptance, completions, utilization | Add performance profile with acceptance, completion, cancellation, uptime, zone mix |
| Demand heat map | `TaskerHeatMapScreen` | `taskerService.getHeatmap` | Dispatch, Logistics | `Dispatch > Live Map`, `Logistics > Zones & Geofencing` | Needs city/zone demand control, not just display | Add demand overlays with intervention tools and zone-level comparisons |
| Scheduled shifts | `ShiftSchedulingScreen` | `getScheduledShifts`, `createScheduledShift`, cancel shift | Fleet, Dispatch | `Dispatch > Scheduled Rides`, `Fleet > Taskers` | Admin needs to approve/override or rebalance planned supply | Add shift planner view with bulk actions and shortage warnings |
| Zone preferences / geofencing | `GeofencingScreen` | `getZones`, `createZone`, toggle/delete zone | Logistics, Dispatch | `Logistics > Zones & Geofencing` | Need separation between user-saved preferences and company service zones | Add company zone editor plus tasker preferred zones overlay |
| Availability toggle | tasker dashboard / jobs | `updateAvailability` | Fleet, Dispatch | `Fleet > Taskers`, `Dispatch > Live Map` | Staff need to force availability state in edge cases | Add force-offline, pause reason, manual availability override |
| Earnings summary | `TaskerEarnings`, `TaskerEarningsScreen`, `EarningsDashboardScreen` | `financeService.getSummary`, `getTransactions` role `tasker` | Finance, Fleet | `Sales > Payments`, `Sales > Payouts`, `Fleet > Tasker Payouts` | Needs tasker-specific wallet/earnings view, not only generic finance lists | Add `Finance > Tasker Earnings` ledger tied to tasker profile |
| Payout request / withdraw earnings | `WithdrawEarningsScreen` | `getPayoutRequests`, `createPayoutRequest` role `tasker` | Finance | `Sales > Payouts` | Needs approval/hold/reject workflow and bank/mobile-money validation | Add payout approval queue with compliance flags |
| Float top-up / buy float | `FloatTopUpScreen`, `BuyFloatScreen` | likely finance/payment flows | Finance, Logistics | Not clearly represented | Cash/float operational risk if unmanaged | Add tasker float ledger and top-up approval/reconciliation |
| Earnings goals / incentives | `EarningsGoalsScreen` | `getTaskerEarningsGoals`, `createTaskerEarningsGoal`, cancel | Growth, Finance | `Growth > Tasker Incentives` | No admin link between incentive campaigns and individual goal state | Add campaign-to-tasker enrollment and earnings goal tracking |
| Voice navigation / map cache | `VoiceNavigationScreen`, `MapCacheSettingsScreen` | local/mobile behavior | Platform, Support | `Platform > Settings` at best | Usually support issue, not core ops | Add device/app troubleshooting notes, not a dedicated ERP module |

### 3. Customer ops matrix

| Mobile workflow | Mobile screens | Key API / service surface | Staff owner | Current admin module/page | Gap / risk | Recommended admin capability |
| --- | --- | --- | --- | --- | --- | --- |
| Customer dashboard and role home | `/(customer)/(tabs)/index`, `CustomerDashboard`, `Home` | auth role routing | CRM | `CRM > Customers`, `CRM > Riders` | Need one customer profile view across marketplace + task bookings + support | Add unified customer profile timeline |
| Address management | `AddLocation`, `AddressBookScreen`, shared address screens | profile/address data | CRM, Support | `CRM` only broadly | Staff cannot fix broken address records or default address issues fast | Add customer address manager with verification and geocode visibility |
| Marketplace browsing and search | `Marketplace`, `MarketplaceSearch`, `VendorDetail`, `ProductDetail`, `RestaurantDetail` | `marketplaceService.getVendors`, `getProducts`, `getAllProducts`, `getProductDetail` | Marketplace Ops, Growth | `Marketplace > Products`, `Marketplace > Vendors`, `Marketplace > Categories` | Admin needs visibility into discoverability, not only entity CRUD | Add merchandising/search ranking and vendor storefront visibility controls |
| Wishlist / favorites | `WishlistScreen`, `FavoritesScreen` | marketplace favorites flows | CRM, Growth | No explicit admin page | Useful for retention, not visible to staff | Add customer affinity signals in CRM profile and campaign targeting |
| Cart and checkout | `Cart`, `Checkout`, `CheckoutScreen` | marketplace cart/order flows | Marketplace Ops, Finance, Support | `Sales > Orders`, `Sales > Payments` | Staff need abandoned/failing checkout insight | Add failed checkout and payment-failure queue |
| Marketplace order history and detail | `OrderHistoryScreen`, customer orders tab | `customerOrdersService.list`, `getMarketplaceOrder` | CRM, Sales, Support | `Sales > Orders`, `CRM > Customers` | Need customer-visible and admin-visible order narratives aligned | Add customer order timeline with payment, vendor, dispatch, refund events |
| Marketplace tracking | `OrderTracking`, `OrderTrackingScreen`, `DeliveryTrackingScreen`, `LiveTrackingScreen` | `getMarketplaceOrderTracking`, `getDeliveryTracking`, `getDeliveryDispatchStatus` | Dispatch, Support | `Dispatch > Live Map`, `Logistics > Tracking`, `Support > Inbox` | Staff need exact divergence between tracking and actual dispatch | Add customer-facing-vs-internal-tracking comparison panel |
| Cancel order | `CancelOrderScreen` | `cancelMarketplaceOrder` | Sales, Support | `Sales > Orders`, `Support > Disputes` | Need policy-aware cancellation and fee reasoning | Add cancellation center with actor, reason, penalty, refund outcome |
| Rate order / rate tasker | `RateOrder`, `RateTaskerScreen`, `RatingScreen` | `rateMarketplaceOrder`, `rateDeliveryTasker`, `rateBookingTasker` | CRM, Marketplace Ops, Fleet | `CRM > Ratings & Reviews`, `Marketplace > Reviews` | Ratings need entity context and moderation flow | Add review moderation queue by target type: vendor, tasker, order |
| Send parcel / do task / book tasker | `SendParcelScreen`, `DoTaskScreen`, `TaskDetail` | matching, booking, dispatch status | Dispatch, Logistics, CRM | `Dispatch`, `Logistics`, `CRM > Riders` | Needs booking-type operations separate from marketplace orders | Add `Dispatch > Bookings / Trips` with booking lifecycle, matching state, reassignment |
| Booking tracking | task workflow tracking screens | `getBooking`, `getBookingTracking`, `getBookingDispatchStatus`, `getBookingLocation` | Dispatch, Support | `Dispatch > Live Map`, `Support > Inbox` | Staff need cross-view of booking, tasker, and customer | Add booking command page with live status, notes, interventions |
| Wallet | `WalletScreen`, shared wallet screens | finance wallet/summary flows | CRM, Finance | `CRM > Wallets`, `Sales > Payments` | Needs customer adjustments, holds, refunds, manual credits | Add customer wallet ledger and manual adjustment tools |
| Payment methods | customer/shared payment screens | saved payment methods | CRM, Finance | No explicit admin page | Staff may need to remove bad tokenized methods or see payment failures | Add customer payment-method status view, without exposing sensitive data |
| Loyalty | `LoyaltyScreen` | `financeService.getLoyalty`, `redeemLoyaltyReward` | Growth, CRM | `Growth > Promotions`, `CRM > Customers` | Loyalty and promo systems are not clearly connected | Add loyalty campaign console and redemption audit |
| Customer subscriptions | `SubscriptionsScreen` | `getCustomerSubscriptions`, create/pause/resume/cancel | Growth, Finance, CRM | No explicit admin page | Subscription ops will be support-heavy if unmanaged | Add subscription management queue with state, delivery address, pauses, renewal |
| Tips | `TipHistoryScreen` | `getTips`, `createTip` | Finance, CRM | `Sales > Payments` | Tips need attribution to order/delivery/booking and payout impact | Add tip ledger by context type |
| Notifications and preferences | notification screens | notifications settings/history | Growth, Support, Platform | `Growth > Notifications`, `Platform > Settings` | Need audit of what was sent and opt-out state | Add comms history and user notification preference center |
| Help and support | `SupportChatScreen`, `HelpSupportScreen`, shared support/chat | `supportService.list`, `create` | Support | `Support > Inbox`, `Support > Tickets`, `Support > Escalations` | Need tickets tied to order/booking/user automatically | Add ticket-to-entity binding and SLA tracking |

### 4. Vendor ops matrix

| Mobile workflow | Mobile screens | Key API / service surface | Staff owner | Current admin module/page | Gap / risk | Recommended admin capability |
| --- | --- | --- | --- | --- | --- | --- |
| Vendor onboarding intro and wizard | `/(vendor)/OnboardingIntro`, `OnboardingWizard`, `VendorOnboardingScreen` | `onboardingService.getVendorDraft`, `saveVendorDraft` | Marketplace Ops, Risk | `Marketplace > Vendors`, `Risk > Safety & Compliance` | Need application queue, draft completeness, business-type-specific validation | Add vendor onboarding queue with missing requirements and reviewer notes |
| Vendor pending approval / rejected / inactive | vendor route gating via `roleStatuses`, `activationStatuses`, `kycStatuses` | auth user role metadata | Marketplace Ops, Risk | `Marketplace > Vendors` | Staff need clear reason why vendor cannot operate | Add approval state machine with KYC state, activation blocker, store readiness blocker |
| Vendor store missing / store not provisioned | many vendor screens handle `vendor store not found` | `isVendorStoreMissingError`, `getVendorStoreAdmin` | Marketplace Ops, Platform | `Marketplace > Vendors` | This is a major operational gap if the account is approved but store provisioning failed | Add vendor provisioning diagnostics: store record, status, storeId, last sync |
| Vendor dashboard / store admin | vendor tabs index, `VendorAnalyticsDashboard` | `getVendorStoreAdmin`, `getVendorStoreOrders` | Marketplace Ops | `Marketplace > Vendors`, `Marketplace > Products` | Needs store health view, not only vendor list | Add vendor account command page with store state, pause state, recent orders, fulfillment load |
| Pause or unpause store | vendor dashboard | `setVendorStorePaused` | Marketplace Ops, Support | `Marketplace > Vendors` | Staff need emergency pause and reason history | Add store visibility controls with actor + reason |
| Product management | `VendorProductsScreen`, `AddProductScreen`, `EditProductScreen`, `ManageProductsScreen` | `getVendorStoreProducts`, `createVendorProduct`, `updateVendorProduct`, `deleteVendorProduct` | Marketplace Ops | `Marketplace > Products`, `Marketplace > Categories` | Needs review/moderation, stock state, availability issues, image quality controls | Add product moderation queue and product QA status |
| Categories / brands | `CreateCategory`, `EditCategory`, `CreateBrand` | vendor product option flows | Marketplace Ops | `Marketplace > Categories` | Need governance over shared taxonomy | Add central category/brand governance with vendor usage map |
| Vendor promotions | `VendorPromosScreen`, `CreatePromotion`, `EditPromotion`, `PreviewPromotion` | `getMyVendorPromotions`, `createMyVendorPromotion`, toggle/delete promo | Growth, Marketplace Ops | `Growth > Promotions`, `Marketplace > Vendors` | No unified view of vendor-driven promos vs platform promos | Add promo console segmented by owner: platform vs vendor |
| Orders list and detail | vendor tabs orders, `VendorOrderDetailScreen` | `getVendorStoreOrders` | Marketplace Ops, Support | `Sales > Orders`, `Marketplace > Vendors` | Need vendor fulfillment view tied to order SLAs | Add vendor order operations page with prep timers and pickup readiness |
| Order acceptance, preparation, packing, out-for-delivery handoff | `OrderAcceptanceScreen`, `VendorOrderDetailScreen` | `updateVendorStoreOrderStatus`, `cancelVendorStoreOrder` | Marketplace Ops, Dispatch, Support | `Sales > Orders`, `Dispatch > Bookings / Trips` | Need clean handoff from vendor readiness to tasker dispatch | Add vendor handoff state board with dispatch pickup dependency |
| Business hours | `BusinessHoursScreen` | store admin data | Marketplace Ops | `Marketplace > Vendors` | Need staff override and holiday controls | Add store-hours admin with emergency closures and holiday rules |
| Vendor analytics / reports | `VendorAnalyticsScreen`, `SalesReportsScreen`, `VendorReports`, `VendorPerformanceScreen` | `getVendorStoreReports`, export reports | Marketplace Ops, Platform | `Platform > Reports & Analytics`, `Marketplace > Vendors` | Admin needs cross-vendor comparison, not only per-vendor report access | Add marketplace analytics with cohort/vendor benchmarking |
| Vendor wallet / payouts | `VendorWalletScreen`, `PayoutHistoryScreen` | finance summary, transactions, payout requests role `vendor` | Finance, Marketplace Ops | `Sales > Payouts`, `Sales > Payments` | Needs vendor settlement queue and account health view | Add vendor settlements ledger with holds, reserves, failed payouts |
| Vendor subscription plans | `VendorSubscriptionScreen` | `getVendorSubscription`, `selectVendorSubscriptionPlan` | Finance, Growth, Marketplace Ops | No explicit page | Subscription changes can block store operations if unmanaged | Add vendor plan management and billing state view |
| Vendor notifications | `VendorNotifications` | notifications flows | Growth, Support | `Growth > Notifications` | Need vendor-targeted notification tracking | Add audience segmentation by vendor/store |
| Vendor settings and profile | `VendorSettingsScreen`, `VendorProfile` | profile/store data | Marketplace Ops, Support | `Marketplace > Vendors` | Need consolidated store settings and account status | Add vendor profile page with store + owner + compliance summary |

## Cross-cutting admin gaps

These are the biggest gaps across all workflow families.

## Second-pass operating model

This second pass applies a stricter industry lens:

- staff should not think in terms of app screens
- staff should think in terms of cases, queues, states, and actions
- the system should reduce decisions, not multiply them
- the same problem should not need three modules to solve

In practical terms, a good internal ERP for this business should make the hard things visible and the common things routine.

### Industry-standard practices that should not be omitted

Even if the final staff experience is simple, the system should still keep these standard practices underneath:

- explicit state machines, not informal status text
- role-based access control, not broad admin powers
- full audit trails for approvals, edits, payouts, suspensions, and overrides
- maker-checker separation for sensitive actions where needed
- queue ownership and SLA tracking
- reason codes for every destructive or financial action
- case notes and internal comments
- linked entity timelines
- exception-first monitoring
- reversible or compensating actions where possible
- soft blocks and hard blocks treated differently
- document versioning and resubmission history
- payout and refund controls with settlement visibility
- handoff metadata between teams
- search by person, order, trip, delivery, booking, store, phone, and tracking ID

The goal is not to make the system heavy. The goal is to hide operational complexity from staff without removing control, traceability, or safety.

### What staff work actually looks like

Staff work is usually one of these:

- review something
- approve or reject something
- intervene in something live
- correct bad data
- resolve a dispute
- pay someone
- pause or block someone
- hand a case to another team with enough context

That means the ERP should be built around:

- queues
- state machines
- timelines
- exception feeds
- action panels

Not around static pages alone.

### Simple and straightforward rule

If life is made easy for staff, the system should behave like this:

- one place to find the case
- one clear current status
- one clear next action
- one visible owner
- one visible audit trail

If staff have to open CRM, then Fleet, then Support, then Sales just to understand one issue, the system is not simple enough.

## What should be simple for staff

These should feel almost trivial in the final ERP.

### 1. Approving or rejecting a tasker

Should be simple:

- open tasker application
- see completeness, docs, KYC, violations, duplicates
- approve, reject, or request resubmission
- leave a reason
- trigger activation or hold

Should not require:

- searching across multiple pages
- guessing missing fields
- manually correlating onboarding and KYC

### 2. Understanding why a vendor cannot operate

Should be simple:

- open vendor account
- immediately see if the blocker is:
  - onboarding incomplete
  - KYC pending
  - KYC rejected
  - activation held
  - store missing
  - store paused
  - subscription/billing problem

Should not require:

- checking products, then settings, then reports, then backend logs mentally

### 3. Intervening in a live delivery or booking

Should be simple:

- open the trip/delivery/booking
- see customer, vendor, tasker, payment, live status, timeline
- reassign, pause, cancel, refund, or escalate
- leave an operator note

Should not require:

- bouncing between Dispatch, Support, and Sales without shared context

### 4. Handling a payout issue

Should be simple:

- open payout request
- see balance source, recent jobs/orders, prior payouts, risk flags, payout destination
- approve, hold, or reject
- attach reason and follow-up action

Should not require:

- manually comparing several ledgers or guessing whether earnings are settled

### 5. Handling a customer complaint

Should be simple:

- open the complaint
- see linked order/delivery/booking
- see all participants
- see prior tickets and refunds
- resolve, refund, escalate, or hand over

Should not require:

- rebuilding the story from scratch every time

## What is missing from the current ERP shape

The current admin module grouping is good, but from an operations background these missing structures matter more than more pages.

### 1. Work queues before dashboards

Dashboards are useful, but queues run the business.

The ERP needs first-class queues for:

- tasker applications
- vendor applications
- rejected/resubmitted KYC
- payout approvals
- refunds and disputes
- dispatch exceptions
- vendor provisioning failures
- SLA-breached support tickets

Without queues, staff become search-driven instead of workflow-driven.

### 2. Case pages before entity lists

Lists are not enough. Staff solve cases, not rows.

The ERP needs case pages for:

- application review
- live dispatch exception
- complaint/dispute
- payout request
- safety incident
- vendor readiness issue

Each case page should merge:

- entity identity
- current state
- related timeline
- related people
- actions
- internal notes

### 3. State machines before free-form status text

The mobile app already implies strict state transitions. The admin should expose them clearly.

Needed state machines:

- tasker onboarding
- vendor onboarding
- booking lifecycle
- delivery lifecycle
- vendor order lifecycle
- payout lifecycle
- support ticket lifecycle
- safety incident lifecycle

If a state exists in the backend but is not legible to staff, staff will compensate with guesswork.

### 4. Exception handling before analytics polish

From an industry point of view, operations breaks on exceptions, not averages.

The ERP should surface:

- accepted by another tasker
- no tasker available
- tasker offline during active job
- pickup overdue
- delivery stuck
- customer unreachable
- vendor store missing
- vendor prep late
- payout failed
- KYC rejected but account still trying to operate

This is more urgent than deeper charts.

### 5. Handoffs as a first-class feature

Real internal operations are cross-functional. Handoffs should be explicit.

Needed handoff patterns:

- Dispatch -> Support
- Support -> Finance
- Risk -> Fleet
- Marketplace Ops -> Dispatch
- CRM -> Growth

A handoff should carry:

- context
- reason
- urgency
- prior action
- current blocker

Not just a link to another page.

## Recommended staff-first module interpretation

The current sidebar can remain, but each module should be interpreted more strictly.

### Dispatch

Primary job:

- command center for live work

Should own:

- live map
- active bookings and deliveries
- reassignment
- stuck-job alerts
- manual dispatch
- operator notes

Should not become:

- a passive tracking page

### Fleet

Primary job:

- workforce readiness

Should own:

- tasker application review
- document review
- activation readiness
- shift participation
- vehicle and service-mode qualification
- performance and probation context

Should not become:

- just a directory of taskers

### Logistics

Primary job:

- movement rules and coverage

Should own:

- zones
- geofencing
- service types
- pricing logic by movement type
- shipment exception rules

Should not become:

- a duplicate of Dispatch

### Marketplace

Primary job:

- merchant/store operating readiness

Should own:

- vendors
- store health
- products
- categories
- reviews
- preparation and pickup readiness context

Should not become:

- only a catalog browser

### CRM

Primary job:

- customer truth and recovery

Should own:

- customer profile
- wallet
- reviews
- blocked users
- account history
- relationship signals

Should not become:

- a shallow contact list

### Support

Primary job:

- case resolution

Should own:

- inbox
- tickets
- disputes
- escalations
- SLA states
- handoff status

Should not become:

- only a message archive

### Risk

Primary job:

- trust, compliance, and restriction decisions

Should own:

- KYC decisions
- fraud flags
- safety incidents
- suspensions
- probation
- appeals

Should not become:

- a dumping ground for anything “serious”

### Sales and Finance

Primary job:

- money movement with accountability

Should own:

- order money trail
- payments
- refunds
- payouts
- settlements
- tip attribution

Should not become:

- detached accounting pages with no operational context

### 1. No unified user/role state page

The mobile app clearly depends on:

- `roleStatuses`
- `activationStatuses`
- `kycStatuses`
- active role

The admin needs one place where staff can see all of that together for a user. Right now, those states are scattered conceptually across CRM, Fleet, Marketplace, and Risk.

### 2. No explicit approval queues

Both tasker and vendor onboarding need structured queues:

- pending review
- missing docs
- rejected
- resubmitted
- approved but not activated
- approved but provisioning failed

Without queues, staff will fall back to searching manually.

### 3. No operational exception center

Mobile flows show many exceptions:

- task accepted by another tasker
- job no longer available
- vendor store not found
- payout request pending/failed
- onboarding completed but account still inactive
- tracking diverges from actual operations

The admin should have an exception queue, not just dashboards.

### 4. No unified event timeline per entity

Staff need timelines for:

- customer
- tasker
- vendor/store
- order
- delivery
- booking

Each timeline should show status changes, staff actions, ratings, tickets, payouts, and flags.

### 5. Weak handoffs between modules

The same real-world workflow crosses several teams:

- vendor handoff to dispatch
- customer dispute into support and finance
- tasker violation into fleet and risk
- promo or loyalty issue into growth and CRM

The admin must support the handoff, not only each module in isolation.

## Priority backlog

### P0: staff unblockers

1. Build a unified account state panel for any user:
   - roles
   - active role
   - role status
   - KYC status
   - activation status
   - onboarding completion

2. Build approval queues:
   - `Fleet > Tasker Applications`
   - `Fleet > Tasker Documents`
   - `Marketplace > Vendor Applications`
   - `Risk > Safety & Compliance`

3. Build an exception queue:
   - dispatch failures
   - vendor provisioning failures
   - payout failures
   - rejected onboarding resubmissions

4. Build entity timelines:
   - tasker timeline
   - customer timeline
   - vendor/store timeline
   - order/delivery/booking timeline

5. Build work queues before more dashboards:
   - application queue
   - payout queue
   - dispatch exception queue
   - dispute queue
   - provisioning-failure queue

6. Build case pages for the most expensive workflows:
   - tasker review case
   - vendor review case
   - delivery/booking intervention case
   - complaint/dispute case
   - payout approval case

### P1: operational control

1. Dispatch command views:
   - booking/trip command page
   - delivery intervention page
   - stale-location and failed-assignment alerts

2. Finance operating pages:
   - tasker payout approvals
   - vendor settlements
   - refund and dispute routing
   - float / cash ledger

3. Marketplace operating pages:
   - vendor handoff readiness
   - product moderation
   - store pause/unpause controls

### P2: optimization

1. CRM and Growth:
   - loyalty console
   - subscriptions management
   - audience segmentation
   - campaign-to-outcome tracking

2. Platform:
   - auth/access logs
   - role request logs
   - app version rollouts and feature flags

## Recommended next audit slices

Implementation should not start everywhere at once. The best next slices are:

1. `Tasker onboarding to active shift`
   - Fleet
   - Risk
   - Dispatch

2. `Customer marketplace order to delivery completion`
   - Marketplace
   - Sales
   - Dispatch
   - Support

3. `Vendor onboarding to order handoff`
   - Marketplace
   - Risk
   - Sales
   - Dispatch

Those three slices will expose most of the admin gaps that matter in daily operations.

## Industry-lens conclusion

The first pass answered: do we cover the workflows?

The second pass answers: would staff actually enjoy using this system to do their jobs?

Right now, not yet.

The current admin is moving in the right ERP direction, but it still thinks too much in terms of pages and modules. A stronger operations-grade system should think in terms of:

- queues
- cases
- states
- timelines
- interventions
- handoffs

That is the difference between an admin dashboard and an internal operations system.

## Immediate admin alignment notes

These naming and grouping choices should remain:

- Courier-side workforce should be `Taskers`
- Transport mode should live under:
  - tasker profile
  - service type
  - fleet/logistics segmentation
- `Customers` belongs under `CRM`
- `Vendors`, `Products`, `Categories`, `Reviews` belongs under `Marketplace`
- `Dispatch` should own live movement and assignment
- `Fleet` should own tasker readiness
- `Risk` should own approvals, fraud, safety, and compliance actions

## Conclusion

The current admin structure is directionally right, but it is still more of a grouped dashboard than a true operations ERP.

The mobile app already tells us what the ERP must support:

- multi-role accounts
- onboarding and approval gates
- live dispatch and tracking
- tasker shift operations
- vendor/store lifecycle
- payouts, subscriptions, loyalty, and support

The next implementation work should be driven from these workflows, not from static admin pages.
