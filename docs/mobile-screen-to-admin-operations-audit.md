# Mobile Screen To Admin Operations Audit

Date: 2026-05-01

## Scope

This audit starts from the mobile app UI, not from the backend or the current admin UI.

The question it answers is:

1. What does the mobile app let users do, screen by screen and workflow by workflow?
2. When those user workflows are viewed from a management and operations perspective, what admin workflows must exist?
3. Which of those admin workflows already exist, which are partial, and which are still missing?

## Method

- Preferred MCP sources were attempted first per `AGENTS.md`:
  - `ntumaiDocs`
  - `ntumaiBackend`
- Both MCP servers failed to initialize in this session with the same handshake error, so this report falls back to direct source inspection.
- Mobile route inventory was taken from `apps/ntumai-mobile/app`.
- The following mobile source areas were inspected directly:
  - routing and auth orchestration
  - app shell boot and notification/location behavior
  - onboarding and KYC flows
  - customer booking, delivery, order, wallet, support, notification, and subscription flows
  - tasker dashboard, active job, compliance, onboarding, and payout-adjacent flows
  - vendor dashboard, onboarding, store ops, and order progression flows
  - public tracking flow
- The current admin and backend were then compared against those mobile workflows.

## Confidence Legend

- `Inspected`: route/component or service code was read directly.
- `Inferred`: purpose is inferred from filename, route placement, store/service usage, or adjacent routes.

## Executive Conclusion

The mobile app is already behaving like three operational products inside one shell:

- a customer commerce and delivery app
- a tasker workforce and dispatch app
- a vendor store and fulfillment app

The current admin does not yet operate at the same level of workflow maturity.

The biggest gap is not generic CRUD. The biggest gap is that mobile users are already moving through live operational state machines, while the admin is still missing many of the command, approval, intervention, exception, and audit surfaces needed to manage those state machines.

The most important management truths revealed by the mobile app are:

- identity is person-level, but operations are role-level
- onboarding is draft-driven, resumable, and stateful
- KYC is document-driven and reviewer-driven
- dispatch is live, location-aware, and intervention-heavy
- customer demand spans marketplace orders, parcel deliveries, and errand/task bookings
- notifications are not cosmetic; they are operational triggers
- support is not just a help inbox; it is a linked-case system across orders, deliveries, bookings, payouts, onboarding, and compliance
- compliance, suspensions, and appeals are already visible to taskers in the mobile UX, so admin must become the policy console behind them

## Bird's-Eye Translation

From a top management perspective, the mobile app translates into the following admin operating domains:

| Domain | What mobile is doing | What admin must do |
| --- | --- | --- |
| Identity and role orchestration | One person can add and switch roles across customer, tasker, and vendor | staff must manage person records, role grants, role activation, role suspension, and cross-role audit history |
| Admin auth and staff access | staff admin is separate from consumer-facing users | admin must own its own authentication, staff roles, permissions, and audit logs |
| Onboarding | vendor and tasker onboarding are resumable drafts | admin must review applications, request fixes, approve, reject, suspend, and reactivate |
| KYC | users upload documents, delete them, resubmit, and see reviewer notes | admin must run a real document review queue with case history and reviewer actions |
| Dispatch and fulfillment | taskers go online, accept jobs, release jobs, progress live steps, and share location | admin must supervise the live pool, resolve exceptions, reassign work, and inspect route/progress evidence |
| Marketplace order ops | vendors progress orders through real fulfillment states | admin must monitor SLAs, override statuses, resolve cancellations, and coordinate customer-vendor-tasker failures |
| Delivery and booking ops | customers create parcel and errand flows with rich metadata | admin must manage quotes, scheduling, multi-stop tasks, commitment amounts, substitutions, and dispute contexts |
| Finance and payouts | wallet activity, subscriptions, tips, and payout requests are visible | admin must approve/deny payouts, inspect balances, supervise subscriptions, and handle payment/refund exceptions |
| Support and communications | support tickets and chats are linked to operational entities | admin must treat support as a case layer connected to orders, deliveries, bookings, onboarding, payouts, and compliance |
| Compliance and safety | taskers see warnings, strikes, case history, and suspension status | admin must own the policy engine, case review, appeals, and disciplinary actions |
| Notifications | push notifications route users into specific operational screens | admin must audit delivery failures, retry behavior, and event-trigger correctness |
| Public tracking | external users can track active work from a public URL | admin must monitor tracking health, abuse risk, and public visibility failures |

## App Shell And Global Orchestration

These are not just technical details. They tell you what the admin must be able to observe and control globally.

| Route or file | Confidence | Mobile behavior | Admin translation | Admin gap |
| --- | --- | --- | --- | --- |
| `app/_layout.tsx` | Inspected | boots notifications, sockets, location behaviors, and incoming offer navigation | admin needs system-level observability for notification delivery, socket health, live offers, and location heartbeat | `system health` page is still mostly static |
| `src/providers/AuthProvider.tsx` | Inspected | auth context drives role-aware session behavior | admin needs person-level session and role-state visibility | only partial through admin auth and platform access |
| `src/navigation/routes.ts` | Inspected | explicit role-specific route map | admin planning should mirror route families by operational domain | current admin structure is broader than the real mobile workflow map |
| `src/navigation/authRouting.ts` | Inspected | decides where users land after OTP based on role ownership and onboarding state | admin must understand and control role activation and onboarding state transitions | no dedicated admin onboarding command center yet |

## Full Mobile Route Inventory

This is the raw route coverage baseline from `apps/ntumai-mobile/app`. It is grouped so the detailed workflow sections below can focus on the screens that actually create or mutate operational state.

### Auth And Launch

- `(auth)/login-input.tsx`
- `(auth)/otp-verification.tsx`
- `(auth)/role-confirmation.tsx`
- `(launch)/onboarding.tsx`
- `(launch)/role-selection.tsx`
- `(launch)/splash.tsx`
- `(guest)/dashboard.tsx`
- `index.tsx`
- `oauth/callback.tsx`

### Shared

- `(shared)/ProfileScreen.tsx`
- `(shared)/EditProfileScreen.tsx`
- `(shared)/AddressesScreen.tsx`
- `(shared)/AddNewAddressScreen.tsx`
- `(shared)/EditAddressScreen.tsx`
- `(shared)/PaymentMethodsScreen.tsx`
- `(shared)/AddPaymentMethodScreen.tsx`
- `(shared)/WalletScreen.tsx`
- `(shared)/WithdrawFundsScreen.tsx`
- `(shared)/HelpSupportScreen.tsx`
- `(shared)/ChatScreen.tsx`
- `(shared)/IncomingOfferScreen.tsx`
- `(shared)/NotificationHistoryScreen.tsx`
- `(shared)/UrgentAlertsIntroScreen.tsx`
- `(shared)/ReferralScreen.tsx`
- `(shared)/LegalContentScreen.tsx`

### Customer

- tab shell: home, marketplace, orders, profile
- `AddLocation`
- `AddressBookScreen`
- `CancelOrderScreen`
- `Cart`
- `Checkout`
- `CheckoutScreen`
- `CustomerDashboard`
- `CustomerSettingsScreen`
- `DeliveryChatScreen`
- `DeliveryTrackingScreen`
- `DoTaskScreen`
- `FavoritesScreen`
- `Home`
- `LiveTrackingScreen`
- `LoyaltyScreen`
- `Marketplace`
- `MarketplaceSearch`
- `NotificationHistoryScreen`
- `NotificationPreferencesScreen`
- `OrderHistoryScreen`
- `OrderTracking`
- `OrderTrackingScreen`
- `PaymentMethodsScreen`
- `ProductDetail`
- `Profile`
- `RateOrder`
- `RateTaskerScreen`
- `RatingScreen`
- `RestaurantDetail`
- `ScheduleDeliveryScreen`
- `ScheduledOrdersScreen`
- `SendParcelScreen`
- `SubscriptionsScreen`
- `SupportChatScreen`
- `TaskDetail`
- `TipHistoryScreen`
- `VendorDetail`
- `WalletScreen`
- `WishlistScreen`
- `dashboard`

### Tasker

- tab shell: dashboard, jobs, earnings, profile
- `ActiveJobScreen`
- `AvailableJobsScreen`
- `BuyFloatScreen`
- `DeliveryHistory`
- `DriverOnboarding`
- `EarningsDashboardScreen`
- `EarningsGoalsScreen`
- `EarningsScreen`
- `FloatTopUpScreen`
- `GeofencingScreen`
- `IncomingJobScreen`
- `JobDetailScreen`
- `JobOfferScreen`
- `LicenseVerificationScreen`
- `MapCacheSettingsScreen`
- `OnboardingIntro`
- `OrderDeliveryFirstStep`
- `OrderDeliverySecondStep`
- `OrderDeliveryLastStep`
- `ProbationScreen`
- `RateCustomerScreen`
- `ShiftSchedulingScreen`
- `TaskerDashboard`
- `TaskerEarnings`
- `TaskerEarningsScreen`
- `TaskerHeatMapScreen`
- `TaskerOrders`
- `TaskerProfile`
- `TaskerRoutes`
- `TaskerSetting`
- `TaskerSettingsScreen`
- `VerificationScreen`
- `ViolationsScreen`
- `VoiceNavigationScreen`
- `WithdrawEarningsScreen`
- `dashboard`

### Vendor

- tab shell: dashboard, orders, products, profile
- `AddProductScreen`
- `AnalyticsScreen`
- `BusinessHoursScreen`
- `CreateBrand`
- `CreateCategory`
- `CreatePromotion`
- `EditCategory`
- `EditProduct`
- `EditProductScreen`
- `EditPromotion`
- `ManageProductsScreen`
- `OnboardingIntro`
- `OnboardingWizard`
- `OrderAcceptanceScreen`
- `PayoutHistoryScreen`
- `PreviewPromotion`
- `ProductScreen`
- `SalesReportsScreen`
- `VendorAnalyticsScreen`
- `VendorNotifications`
- `VendorOnboardingScreen`
- `VendorOrderDetailScreen`
- `VendorPerformanceScreen`
- `VendorProducts`
- `VendorProductsScreen`
- `VendorProfile`
- `VendorPromosScreen`
- `VendorReports`
- `VendorSettingsScreen`
- `VendorSubscriptionScreen`
- `VendorWalletScreen`
- `VerificationScreen`
- `dashboard`

### Public

- `public-tracking/[trackingId].tsx`

## Detailed Workflow Audit

The sections below focus on the routes that either:

- change user state
- create operational work
- progress operational work
- request review or approval
- trigger communication or escalation
- expose data that requires an admin owner behind it

### 1. Auth, Role Entry, And Role Expansion

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(auth)/login-input.tsx` | Inspected | starts OTP using phone or email and a requested role | switch auth method, submit OTP start, demo quick login, route to OTP screen | admin needs audit of OTP starts by contact, requested role, and blocked starts | admin auth now separated, but no staff-facing auth ops dashboard |
| `(auth)/otp-verification.tsx` | Inspected | verifies OTP and is routed by role and onboarding state | verify OTP, resend OTP, use different contact, demo shortcuts | admin needs OTP verification audit, session lifecycle visibility, and failure review | auth works, but no admin auth diagnostics UI |
| `(auth)/role-confirmation.tsx` | Inspected | adds a new role to an existing person | continue as new role, stay on current role | admin must see person-level role additions and who authorized them | no explicit admin workflow for approving or auditing role additions |
| `(launch)/role-selection.tsx` | Inspected | chooses vendor vs tasker after initial auth or during role add | select role, continue | admin must understand role intent versus role ownership and when onboarding tokens exist | only indirectly visible through backend/auth state |
| `(launch)/onboarding.tsx` | Inferred | early intro to Ntumai usage paths | continue into auth or role selection | mostly marketing, but still part of acquisition funnel | not an admin ops priority |
| `(launch)/splash.tsx` | Inferred | boot and session entry | continue based on session state | system health and route decision observability | missing |
| `(guest)/dashboard.tsx` | Inferred | unauthenticated browsing surface | browse before login | conversion funnel analytics | missing in admin |

### 2. Shared Identity, Support, Wallet, And Communication

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(shared)/ProfileScreen.tsx` | Inspected | switches roles and launches role-specific account actions | switch role, edit profile, addresses, payment methods, settings, customer history, referrals, tasker violations, vendor ops links, support, legal, logout | admin needs one person record with all roles, settings, restrictions, support history, and operational links | only fragments exist across customers, support, and platform access |
| `(shared)/EditProfileScreen.tsx` | Inferred | edits base profile data | save profile | admin must review person identity changes and possible fraud signals | missing |
| `(shared)/AddressesScreen.tsx` | Inferred | manages saved addresses | add, edit, remove | admin needs address audit because addresses affect quotes, serviceability, and fraud | missing |
| `(shared)/AddNewAddressScreen.tsx` | Inferred | creates address records | add address and return to prior workflow | admin needs address verification and serviceability issue handling | missing |
| `(shared)/EditAddressScreen.tsx` | Inferred | edits addresses | save address | admin needs change history | missing |
| `(shared)/PaymentMethodsScreen.tsx` | Inferred | views stored payment methods | add or remove methods | admin needs payment method support tooling and fraud review context | missing |
| `(shared)/AddPaymentMethodScreen.tsx` | Inferred | adds new payment method | submit new method | admin needs failure diagnostics and support visibility | missing |
| `(shared)/WalletScreen.tsx` | Inspected | views role-based finance summary and transactions | payment methods or withdraw funds, order history or payout history, filter transactions | admin needs balance inspection, payout review, transaction audit, and exception handling | only finance read queues exist partially |
| `(shared)/WithdrawFundsScreen.tsx` | Inferred | creates payout withdrawal request | submit payout request | admin must approve or reject payout requests and resolve payout failures | missing as live admin workflow |
| `(shared)/HelpSupportScreen.tsx` | Inspected | reads FAQ, creates tickets, opens support chat, opens legal links, contacts support | switch tabs, submit ticket, call/email/WhatsApp, open linked chat | admin needs ticket queue, linked conversation view, category routing, and issue-to-entity linking | support queues are the strongest current admin area |
| `(shared)/ChatScreen.tsx` | Inferred | chats in context of support, order, delivery, booking, or marketplace order | send message in entity context | admin needs conversation audit, reply console, SLA tracking, and linked-case context | support inbox exists, but not a unified conversation control layer across all entity types |
| `(shared)/IncomingOfferScreen.tsx` | Inferred | receives operational offer from push or socket | accept or inspect offer | admin needs offer dispatch audit, delivery diagnostics, and acceptance timing visibility | missing |
| `(shared)/NotificationHistoryScreen.tsx` | Inspected via re-export | shared entry to notification history | mark read, delete, open linked entity | admin needs notification audit by type, device, entity, and delivery status | missing |
| `(shared)/UrgentAlertsIntroScreen.tsx` | Inspected | primes vendor/tasker to enable urgent alerts | continue into permissions flow | admin needs visibility into who can or cannot receive urgent operational alerts | missing |
| `(shared)/ReferralScreen.tsx` | Inferred | manages referrals | share code or inspect rewards | admin needs referral fraud and reward audit | missing |
| `(shared)/LegalContentScreen.tsx` | Inferred | reads terms, privacy, vendor agreement, and about pages | open content type | admin needs content versioning and acceptance records | content/version admin pages are still static |

### 3. Customer Demand, Orders, Delivery, And Booking

#### 3.1 Customer Home And Discovery

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(customer)/(tabs)/index.tsx` | Inspected | launches core demand flows from home | open addresses, support, notifications, profile, search, marketplace, do task, send parcel, active order tracking, rating, add address prompt | admin needs unified customer timeline across marketplace, parcel, and task workflows | customer read view exists, but not a unified operations timeline |
| `(customer)/(tabs)/marketplace.tsx` | Inferred | browses marketplace catalog | search, open store, open product, cart | admin needs merchandising, category, product, and store moderation | current admin catalog areas are mostly fixture-backed |
| `(customer)/(tabs)/orders.tsx` | Inferred | views active customer orders | open tracking, details, cancel, rate | admin needs unified operational order feed | only partial read coverage |
| `(customer)/(tabs)/profile.tsx` | Inferred | entry to shared profile | role/account actions | same as shared profile requirements | partial only |
| `(customer)/Marketplace.tsx` | Inferred | full marketplace browsing | browse vendors/products | admin needs live catalog governance | missing |
| `(customer)/MarketplaceSearch.tsx` | Inferred | search vendors/products | search, filter, open result | admin needs search merchandising, ranking, and no-result diagnostics | missing |
| `(customer)/VendorDetail.tsx` | Inferred | views vendor/store details | open products, reviews, order | admin needs store profile, availability, and visibility controls | vendor admin missing |
| `(customer)/RestaurantDetail.tsx` | Inferred | views food vendor details | browse menu and order | same as vendor/store ops | missing |
| `(customer)/ProductDetail.tsx` | Inferred | views product details | add to cart, favorite | admin needs product moderation and price/content audit | missing |
| `(customer)/FavoritesScreen.tsx` | Inferred | manages saved favorites | add or remove favorites | admin only needs analytics and abuse context, not heavy operations | missing but lower priority |
| `(customer)/WishlistScreen.tsx` | Inferred | manages saved products | view and act on wishlisted items | merchandising analytics | missing, low priority |

#### 3.2 Marketplace Ordering

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(customer)/Cart.tsx` | Inferred | reviews and edits cart | change quantities, remove items, checkout | admin needs cart-abandonment analytics and pricing integrity investigation | no admin surface |
| `(customer)/Checkout.tsx` | Inferred | alternative checkout shell | move into place-order flow | same as checkout screen | no direct admin surface |
| `(customer)/CheckoutScreen.tsx` | Partly inspected | chooses address and payment method, then places order | add address, add payment method, select address, select payment method, place order, route to order tracking | admin needs order creation diagnostics, payment failure troubleshooting, and address/payment mismatch handling | orders read path exists; order creation oversight does not |
| `(customer)/CancelOrderScreen.tsx` | Inferred | requests order cancellation | cancel order with reason | admin needs cancellation queue, vendor coordination, and refund linkage | missing |
| `(customer)/OrderTracking.tsx` | Inferred | wrapper route to tracking | open tracking | admin needs same as tracking | partial through orders/shipment read |
| `(customer)/OrderTrackingScreen.tsx` | Inferred | tracks marketplace order after creation | view status, chat/call, maybe cancel or rate later | admin needs itemized order status, vendor fulfillment state, rider handoff state, and SLA view | only list/detail read today |
| `(customer)/RateOrder.tsx` | Inferred | rates completed marketplace order | submit rating/review | admin needs rating moderation and dispute context | reviews area not integrated |
| `(customer)/RatingScreen.tsx` | Inferred | generic rating surface | submit score and notes | rating governance | missing |

#### 3.3 Parcel Delivery

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(customer)/SendParcelScreen.tsx` | Inspected | creates a parcel delivery with pickup, dropoff, contacts, vehicle type, fragile flag, scheduling, notes, and quote | add address, use contact picker, select map points, calculate price, schedule, create delivery, route to live tracking | admin needs quote review, contact issue handling, scheduling ops, vehicle-type dispatch control, and create-delivery exception handling | shipments read exists, but not create/edit/intervene workflow |
| `(customer)/ScheduleDeliveryScreen.tsx` | Inferred | manages scheduled delivery setup | select schedule and confirm | admin needs scheduled delivery queue and reschedule tools | missing |
| `(customer)/ScheduledOrdersScreen.tsx` | Inferred | views future deliveries/orders | open, edit, cancel scheduled items | admin needs scheduled-work board | missing |
| `(customer)/DeliveryTrackingScreen.tsx` | Inferred | tracks a delivery-specific flow | view delivery state, call/message, refresh | admin needs same live dispatch oversight as general tracking | only shipment tracking read exists |
| `(customer)/DeliveryChatScreen.tsx` | Inferred | chats in delivery context | send messages to rider or support | admin needs delivery-thread visibility | missing |

#### 3.4 Task Booking And Errands

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(customer)/DoTaskScreen.tsx` | Inspected | creates errand and task bookings with category, pickup, dropoff, extra stops, shopping list, checklist, photos, waiting time, scheduling, budget range, commitment amount, and notes | pick category, add stops, add shopping items, apply templates, add checklist, choose waiting time, toggle commitment, schedule, post task, route to live tracking | admin needs a full bookings operations console, not just order pages; this includes shopping substitution policy, commitment handling, multi-stop visibility, and evidence review | missing |
| `(customer)/TaskDetail.tsx` | Inferred | views a task booking record | inspect progress, maybe cancel, message, or rate | admin needs booking detail with metadata and state history | missing |
| `(customer)/RateTaskerScreen.tsx` | Inferred | rates tasker after booking/delivery | submit rating and feedback | admin needs performance and dispute context | partial via tasker performance concept, but no live admin tooling |

#### 3.5 Unified Tracking, History, Wallet, Preferences, And Loyalty

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(customer)/LiveTrackingScreen.tsx` | Partly inspected | tracks order, delivery, or task in a unified live screen | go back, open detail route, message counterpart, call counterpart | admin needs unified live tracking view across entity types, not just shipments | missing |
| `(customer)/OrderHistoryScreen.tsx` | Inspected | views archived marketplace, delivery, and task items from one history feed | search history, open detail by entity type | admin needs the same unified cross-entity history for staff | only fragmented today |
| `(customer)/WalletScreen.tsx` | Inferred via shared wallet | customer finance activity view | payment methods, history, transaction view | admin needs payment/refund support and transaction audit | only partial |
| `(customer)/LoyaltyScreen.tsx` | Inferred | views loyalty progress and benefits | inspect reward history or benefits | admin needs loyalty rule management and fraud review | missing |
| `(customer)/TipHistoryScreen.tsx` | Inferred | views tip records | inspect tip activity | admin needs tip payout and dispute audit | missing |
| `(customer)/SubscriptionsScreen.tsx` | Inspected | manages recurring subscriptions | browse plans, subscribe, pause, resume, cancel | admin needs subscription plan governance, subscriber support, failed billing diagnostics, and delivery impact controls | missing in current admin |
| `(customer)/NotificationHistoryScreen.tsx` | Inspected | views and acts on notifications | filter all/unread, mark all read, delete, open linked entity | admin needs event-to-notification audit and device delivery observability | missing |
| `(customer)/NotificationPreferencesScreen.tsx` | Inferred | controls notification preferences | enable or disable classes of updates | admin needs preference support, suppression diagnostics, and consent audit | missing |
| `(customer)/SupportChatScreen.tsx` | Inferred | support conversation entry | message support in customer context | support case linkage requirement | partial via support inbox |
| `(customer)/CustomerSettingsScreen.tsx` | Inferred | edits customer-specific preferences | save settings | admin needs policy-level override and support visibility | missing |
| `(customer)/AddressBookScreen.tsx` | Inferred | customer address management entry | edit/add/select addresses | same address audit needs | missing |
| `(customer)/PaymentMethodsScreen.tsx` | Inferred | customer payment methods entry | add/remove/select methods | same payment support needs | missing |
| `(customer)/AddLocation.tsx` | Inferred | map/location capture helper | save location | admin needs geocoding and serviceability diagnostics | missing |
| `(customer)/Home.tsx`, `(customer)/CustomerDashboard.tsx`, `(customer)/Profile.tsx`, `(customer)/dashboard.tsx` | Inferred | alternative wrappers or aliases around main customer surfaces | route to core customer functions | low direct ops value, but they confirm multiple entry points into the same workflows | no separate admin implication |

### 4. Tasker Workforce, Dispatch, Compliance, And Earnings

#### 4.1 Tasker Entry, Dashboard, And Job Intake

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(tasker)/(tabs)/index.tsx` and `components/tasker/TaskerDashboardScreen.tsx` | Inspected | views dashboard, goes online/offline, sees available jobs, handles onboarding prompts | toggle online, accept job, reject job, add address, open notifications, open profile, continue onboarding or verification, open active job | admin needs live rider pool, online/offline visibility, onboarding restriction visibility, and job-offer timing metrics | missing |
| `(tasker)/AvailableJobsScreen.tsx` | Inferred | views pool of jobs/tasks | inspect offers, accept, decline | admin needs queue health, assignment failures, and manual dispatch | missing |
| `(tasker)/IncomingJobScreen.tsx` | Inferred | receives a live incoming job | accept or decline | admin needs real-time offer audit | missing |
| `(tasker)/JobOfferScreen.tsx` | Inferred | detailed offer view | inspect payout, route, and accept | admin needs dispatch transparency and quality control | missing |
| `(tasker)/JobDetailScreen.tsx` | Inferred | views selected job details before action | accept or inspect more deeply | admin needs job-detail command center | missing |
| `(shared)/IncomingOfferScreen.tsx` | Inferred | shared urgent-offer presentation | same live-offer behavior from push/socket | same as above | missing |

#### 4.2 Active Work Execution

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(tasker)/ActiveJobScreen.tsx` | Inspected | progresses active delivery or task booking, shares live location, calls/messages customer, advances steps, and can release delivery before transit | call customer, open chat, advance journey step, press individual steps, release delivery, open jobs if none active | admin needs live progress visibility, route evidence, release history, reassignment, stuck-job detection, and cross-entity chat context | missing |
| `(tasker)/OrderDeliveryFirstStep.tsx` | Inferred | guided delivery step UI | complete first stage | admin needs structured proof of progression if still used | missing |
| `(tasker)/OrderDeliverySecondStep.tsx` | Inferred | guided mid-journey step UI | continue progression | same | missing |
| `(tasker)/OrderDeliveryLastStep.tsx` | Inferred | guided completion UI | complete delivery | same | missing |
| `(tasker)/VoiceNavigationScreen.tsx` | Inferred | navigation aid during active work | navigate by voice | admin only needs diagnostic visibility if navigation failures affect completion | missing |
| `(tasker)/TaskerRoutes.tsx` | Inferred | route management or route list | inspect routes | admin needs dispatch geography tooling | missing |
| `(tasker)/GeofencingScreen.tsx` | Inferred | geofence or zone visibility | inspect service zones | admin needs zone governance | missing |
| `(tasker)/ShiftSchedulingScreen.tsx` | Inferred | views or manages scheduled shifts | choose or inspect shifts | admin needs shift plan, capacity planning, and approval controls | missing |
| `(tasker)/TaskerHeatMapScreen.tsx` | Inferred | views demand heatmap | inspect high-demand areas | admin needs a control-side heatmap and supply planning | missing |
| `(tasker)/MapCacheSettingsScreen.tsx` | Inferred | adjusts map/offline settings | manage cache | mostly support/diagnostic, low management priority | missing |

#### 4.3 Onboarding, Verification, Compliance

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(tasker)/OnboardingIntro.tsx` | Inferred | intro to tasker onboarding | continue to application | admin needs applicant funnel tracking | missing |
| `(tasker)/DriverOnboarding.tsx` | Partly inspected | completes tasker application draft with vehicle and document-related data | save and exit, discard, upload docs, delete docs, continue, route to verification | admin needs application review queue, draft visibility, missing-field review, and training/probation activation steps | missing |
| `(tasker)/VerificationScreen.tsx` plus `components/onboarding/KycVerificationScreen.tsx` | Inspected | uploads KYC docs, deletes docs, submits for review, reads reviewer notes, edits application after rejection, refreshes status | choose image, upload, delete doc, submit verification, save and exit, discard, edit application, open dashboard | admin needs a true KYC review desk with reviewer notes, document-level decisions, and activation controls | missing |
| `(tasker)/LicenseVerificationScreen.tsx` | Inferred | extra license verification presentation | upload/confirm license details | document-specific review | missing |
| `(tasker)/ProbationScreen.tsx` | Inspected | sees probation summary, warnings, strikes, and open cases | open violations, contact support | admin needs probation case management and progression rules | missing |
| `(tasker)/ViolationsScreen.tsx` | Inspected | sees compliance summary and case history | refresh, contact support | admin needs strike issuance, warning issuance, suspension, appeals, and case closure workflows | missing |

#### 4.4 Earnings, Float, And Payouts

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(tasker)/(tabs)/earnings.tsx` | Inferred | earnings entry tab | open earnings dashboards | payout and finance visibility | partial finance read only |
| `(tasker)/EarningsScreen.tsx` | Inferred | earnings summary | inspect totals | admin needs earnings audit | missing |
| `(tasker)/EarningsDashboardScreen.tsx` | Inferred | deeper earnings metrics | view trends | admin needs incentive and payout ops | missing |
| `(tasker)/TaskerEarnings.tsx` and `(tasker)/TaskerEarningsScreen.tsx` | Inferred | alias or expanded earnings pages | same | same | missing |
| `(tasker)/EarningsGoalsScreen.tsx` | Inferred | earnings targets | set or view goals | admin needs incentive program design and audit | missing |
| `(tasker)/WithdrawEarningsScreen.tsx` | Inferred | requests payout withdrawal | submit withdrawal | admin needs payout approval queue and failure handling | missing |
| `(tasker)/BuyFloatScreen.tsx` | Inferred | buys float for operations | initiate float purchase | admin needs float ledger and reconciliation | missing |
| `(tasker)/FloatTopUpScreen.tsx` | Inferred | tops up float | create float funding action | admin needs float controls | missing |
| `(tasker)/DeliveryHistory.tsx` | Inferred | views completed work history | inspect jobs and earnings | admin needs tasker performance timeline | missing |
| `(tasker)/RateCustomerScreen.tsx` | Inferred | rates customer after work | submit feedback | admin needs customer-quality signals and incident context | missing |
| `(tasker)/TaskerOrders.tsx`, `(tasker)/TaskerProfile.tsx`, `(tasker)/TaskerSetting.tsx`, `(tasker)/TaskerSettingsScreen.tsx`, `(tasker)/dashboard.tsx` | Inferred | wrappers and profile/settings views | navigate across tasker account surfaces | admin implications already covered in workforce and profile domains | mostly missing |

### 5. Vendor Onboarding, Store Ops, Catalog, And Fulfillment

#### 5.1 Vendor Entry And Store Activation

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(vendor)/(tabs)/index.tsx` | Inspected | views vendor dashboard, sees onboarding or verification prompts, sees store setup requirement, reads order/product/rating metrics, toggles store paused state | continue onboarding, continue verification, set store paused/unpaused, open all orders, manage products, business hours, open recent order | admin needs vendor activation desk, store provisioning review, pause/unpause oversight, and store readiness visibility | missing |
| `(vendor)/OnboardingIntro.tsx` | Inferred | intro to vendor onboarding | continue to application | admin needs applicant funnel tracking | missing |
| `(vendor)/VendorOnboardingScreen.tsx` | Inferred | earlier or alternate onboarding presentation | continue onboarding | same | missing |
| `(vendor)/OnboardingWizard.tsx` | Inspected | completes resumable vendor application draft with business type, business details, address, map location, payout method, and payout account data | save draft, restore draft, go back, save and exit, discard, continue, submit onboarding, route to verification | admin needs application review, payout detail verification, store setup readiness review, and reject/request-fix actions | missing |
| `(vendor)/VerificationScreen.tsx` plus `components/onboarding/KycVerificationScreen.tsx` | Inspected | uploads KYC/business docs, sees reviewer notes, submits for review, edits application after rejection | choose image, upload, delete, submit, edit application, refresh, save and exit | admin needs business KYC review desk | missing |

#### 5.2 Store Operations And Fulfillment

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(vendor)/(tabs)/orders.tsx` | Inferred | vendor order list | open order, filter status | admin needs vendor-side order operations | partial customer-side order read only |
| `(vendor)/OrderAcceptanceScreen.tsx` | Inferred | accepts or rejects fresh orders | accept, reject | admin needs missed-acceptance monitoring and override | missing |
| `(vendor)/VendorOrderDetailScreen.tsx` | Inspected | manages a live marketplace order from the vendor side | call customer, message customer, progress status through `PENDING -> ACCEPTED -> PREPARING -> PACKING -> OUT_FOR_DELIVERY`, cancel or reject if allowed | admin needs vendor fulfillment command page with override, timeline, and SLA controls | missing |
| `(vendor)/BusinessHoursScreen.tsx` | Inferred | manages business hours | update open/close windows | admin needs store-hours governance and serviceability impact tooling | missing |
| `(vendor)/VendorNotifications.tsx` | Inferred | vendor notification center | open order-related updates | admin needs vendor notification audit | missing |
| `(vendor)/VendorPerformanceScreen.tsx` | Inferred | sees performance metrics | inspect service metrics | admin needs performance governance and coaching tooling | missing |
| `(vendor)/AnalyticsScreen.tsx`, `(vendor)/VendorAnalyticsScreen.tsx`, `(vendor)/VendorReports.tsx`, `(vendor)/SalesReportsScreen.tsx` | Inferred | store analytics and reports | inspect sales and trends | admin needs live reporting, not static placeholders | missing |

#### 5.3 Catalog And Promotion Management

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(vendor)/(tabs)/products.tsx` | Inferred | product list tab | open manage products | admin needs product moderation and catalog ops | missing |
| `(vendor)/ManageProductsScreen.tsx` | Inferred | manages product catalog | add, edit, pause products | admin needs live vendor catalog oversight | missing |
| `(vendor)/VendorProducts.tsx`, `(vendor)/VendorProductsScreen.tsx`, `(vendor)/ProductScreen.tsx` | Inferred | product inventory and product detail surfaces | view and edit catalog items | same | missing |
| `(vendor)/AddProductScreen.tsx` | Inspected earlier in previous work | creates product | save product | admin needs product approval/moderation and bad-data correction | missing |
| `(vendor)/EditProduct.tsx`, `(vendor)/EditProductScreen.tsx` | Inferred | edits product | save changes | admin needs change audit | missing |
| `(vendor)/CreateCategory.tsx`, `(vendor)/EditCategory.tsx` | Inferred | vendor category management | create/edit category | admin needs category governance | current categories admin is still fixture-backed |
| `(vendor)/CreateBrand.tsx` | Inferred | creates brand records | save brand | admin needs brand governance | missing |
| `(vendor)/CreatePromotion.tsx`, `(vendor)/EditPromotion.tsx`, `(vendor)/PreviewPromotion.tsx`, `(vendor)/VendorPromosScreen.tsx` | Inferred | manages promos and previews | create, edit, preview promotions | admin needs promotion governance, abuse/fraud checks, and campaign review | missing |

#### 5.4 Vendor Finance And Billing

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `(vendor)/VendorWalletScreen.tsx` | Inferred via shared wallet pattern | views vendor balance and transactions | withdraw, open payout history | admin needs vendor ledger and settlement visibility | partial finance read only |
| `(vendor)/PayoutHistoryScreen.tsx` | Inferred | views payout request history | inspect payout states | admin needs payout case management | missing |
| `(vendor)/VendorSubscriptionScreen.tsx` | Inferred | manages vendor subscription/billing plan | subscribe, renew, inspect billing | admin needs vendor plan and billing management | missing |
| `(vendor)/VendorSettingsScreen.tsx` | Inferred | vendor-specific settings | update store settings | admin needs support and override visibility | missing |
| `(vendor)/VendorProfile.tsx`, `(vendor)/(tabs)/profile.tsx`, `(vendor)/dashboard.tsx` | Inferred | profile and wrapper surfaces | open vendor account functions | implications already covered above | missing |

### 6. Public Tracking

| Route | Confidence | What the user does | Main buttons or transitions | Admin translation | Current admin coverage |
| --- | --- | --- | --- | --- | --- |
| `public-tracking/[trackingId].tsx` | Inspected | unauthenticated user tracks an active delivery or shipment from public link | poll status every 15 seconds, call rider | admin needs public tracking diagnostics, abuse control, expiry policy, and broken-link handling | missing |

## What The Mobile App Reveals About Real Workflow State Machines

This is the most important part of the audit. These are the workflows the admin must own because the mobile app already exposes them to real users.

### A. Person, Role, And Activation State Machine

Observed from mobile:

- a person can exist once and then add roles later
- a requested role is not the same thing as an owned role
- an owned role is not the same thing as an active role
- onboarding and KYC status decide where the user is routed after OTP
- role switching happens inside the profile screen

Admin implications:

- admin must have a person-first view with all linked roles
- admin must be able to grant, revoke, suspend, and reactivate roles
- admin must be able to explain why a user was routed to onboarding, verification, probation, or home
- support staff need a single screen to answer: "why can this person not do X right now?"

Current admin state:

- partial only
- platform access is about staff admin users, not consumer role orchestration

### B. Onboarding Draft State Machine

Observed from mobile:

- tasker and vendor onboarding drafts are saved server-side
- users can save and exit
- users can discard and return later
- users can restore draft progress
- onboarding data includes business details, map location, vehicle and document data, and payout details

Admin implications:

- admin needs an application queue
- admin needs draft inspection before final submission
- admin needs "request missing information" and "return to applicant" actions
- admin needs reviewer notes, timestamps, and ownership
- admin needs store-provisioning readiness for vendors and training-readiness for taskers

Current admin state:

- missing

### C. KYC Review State Machine

Observed from mobile:

- docs are uploaded by type
- docs can be deleted before final review
- users can submit for review
- users can see rejection notes
- rejected users can edit application and resubmit
- approved users can continue to dashboard

Admin implications:

- admin needs a KYC work queue
- admin needs document-level approve/reject actions
- admin needs reviewer notes and rejection reasons
- admin needs resubmission history
- admin needs activation controls linked to KYC outcome

Current admin state:

- missing in current admin UI even though backend has relevant auth/KYC state

### D. Dispatch And Live Execution State Machine

Observed from mobile:

- taskers go online and offline
- taskers receive jobs from a live pool
- taskers accept or release work
- taskers share live location during active work
- active work can be delivery or booking
- booking progress stages differ from delivery progress stages
- customers can call and chat from live tracking
- vendors and taskers depend on urgent alerts for real-time operations

Admin implications:

- admin needs a live dispatch board
- admin needs manual dispatch and reassignment
- admin needs active route map and heartbeat visibility
- admin needs release reasons and no-response diagnostics
- admin needs exception queues for stalled pickups, missed arrivals, customer no-answer, and wrong-location cases
- admin needs alert-delivery diagnostics when job offers are missed

Current admin state:

- largely missing
- current dispatch pages are still static or local-state driven

### E. Marketplace Fulfillment State Machine

Observed from mobile:

- vendor order detail screen progresses order through fulfillment states
- vendor can call or message customer
- vendor can cancel/reject within allowed conditions
- customer can place order, track it, cancel, and rate after completion

Admin implications:

- admin needs order timeline with both customer-side and vendor-side actions
- admin needs status override and cancellation governance
- admin needs refund linkage
- admin needs SLA views for acceptance, preparation, packing, dispatch, and delivery

Current admin state:

- order reads exist
- vendor command workflows do not

### F. Parcel Delivery State Machine

Observed from mobile:

- customer creates delivery with sender/recipient details, pickup/dropoff, vehicle type, fragile flag, scheduling, and quote
- live tracking follows afterward

Admin implications:

- admin needs delivery creation audit
- admin needs quote mismatch handling
- admin needs sender/recipient contact issue resolution
- admin needs scheduled delivery intervention tools
- admin needs vehicle-type operations view

Current admin state:

- shipment read exists
- true delivery operations tooling is missing

### G. Task Booking And Errand State Machine

Observed from mobile:

- customers create richer workflows than standard order or parcel flows
- booking metadata can include extra stops, shopping items, checklist, photos, waiting time, substitution preference, budget band, account/reference metadata, and commitment amount

Admin implications:

- admin needs a booking operations module
- admin needs metadata-rich detail pages
- admin needs commitment and substitution governance
- admin needs escalation support because these tasks are human-variable and exception-prone

Current admin state:

- missing

### H. Finance, Payout, Subscription, And Ledger State Machine

Observed from mobile:

- wallet summary and transactions are role-aware
- tasker and vendor withdrawals are payout-request style workflows
- customer stored-value top-up and withdrawal are explicitly not enabled in the wallet store logic
- customer subscriptions can be created, paused, resumed, and cancelled
- loyalty and tips exist as customer-visible concepts

Admin implications:

- admin must not assume a consumer wallet ledger that does not yet exist
- admin needs payout approval workflow
- admin needs settlement and subscription operations
- admin needs payment-method support and failed-billing diagnostics
- admin needs tip and reward audit flows

Current admin state:

- payment and refund read queues exist
- payout, subscription, loyalty, and tip operations are missing

### I. Support, Case Management, And Communications State Machine

Observed from mobile:

- users can create support tickets
- support chat is contextual
- notifications can link to support tickets, orders, deliveries, bookings, conversations, and payout requests
- tasker compliance screens direct users back to support for manual review

Admin implications:

- support must be entity-linked
- support must bridge operations, finance, compliance, and onboarding
- admin needs one case console with linked timelines, not just a ticket list

Current admin state:

- this is the best-developed admin area
- still not fully unified across all mobile entity contexts

### J. Compliance And Safety State Machine

Observed from mobile:

- taskers see warnings, strikes, active cases, and suspension status
- appeals are implied by the compliance service and support path

Admin implications:

- admin must own rule enforcement, evidence review, case creation, appeal decisions, suspension, reinstatement, and note history

Current admin state:

- risk/compliance pages are still mostly static

### K. Notifications As Operational Infrastructure

Observed from mobile:

- notification history supports mark read, mark all read, delete, and deep-link navigation
- notification metadata references orders, deliveries, bookings, conversations, support tickets, and payout requests
- urgent alerts matter for tasker/vendor operations

Admin implications:

- admin needs a notification audit console
- admin needs device registration and push failure visibility
- admin needs event-trigger tracing from backend event to mobile route

Current admin state:

- missing

## Missing Admin Workflows, Ranked By Operational Severity

### P0: Must Exist To Truly Run The Mobile Product

- tasker onboarding application queue
- vendor onboarding application queue
- tasker KYC review queue
- vendor KYC review queue
- live dispatch board for deliveries and task bookings
- booking operations module for errand/task workflows
- payout approval and payout failure workflow
- unified person and role state page
- compliance and appeals console
- notification delivery and urgent alert diagnostics

### P1: Strongly Needed For Reliable Scale

- vendor order command center with override capability
- scheduled delivery and scheduled task operations board
- subscription operations console
- store pause/unpause governance and business-hours override tooling
- unified customer timeline across marketplace, delivery, and booking
- public tracking diagnostics
- transaction investigation and payment-method support tooling

### P2: Important, But Not The First Bottleneck

- loyalty operations
- referral moderation and fraud tooling
- ratings and reviews moderation
- advanced analytics and campaign management
- content/version acceptance admin

## Current Admin Versus Mobile Reality

The current admin is strongest in:

- admin auth
- support queues
- customer read paths
- order read paths
- shipment read paths
- basic finance queue reads
- staff access CRUD

The mobile app shows the admin is weakest in:

- onboarding and KYC review
- live dispatch and exception handling
- task bookings and errand management
- payout operations
- compliance and appeals
- subscriptions and recurring commerce operations
- notification operations
- vendor store and catalog governance

## Direct Recommendation

If the goal is to make the admin truly capable of managing what the mobile app already does, the next admin build sequence should be:

1. `Identity + role state page`
2. `Tasker/Vendor onboarding queue`
3. `Tasker/Vendor KYC review desk`
4. `Live dispatch + exception board`
5. `Booking operations module`
6. `Payout approval workflow`
7. `Compliance and appeals console`
8. `Notification audit console`
9. `Vendor fulfillment command center`
10. `Subscription operations`

## Final Judgment

The mobile app is ahead of the admin in workflow maturity.

That is not a design problem. It is an operating-model problem.

The mobile app already assumes that Ntumai has:

- reviewer workflows
- dispatcher workflows
- payout approver workflows
- compliance officer workflows
- vendor operations workflows
- support-to-operations escalation workflows

The current admin only covers part of that assumption.

The admin build should now be driven less by generic section labels and more by the actual user-state machines already exposed in mobile.
