"use client";

export type CustomerProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: string;
  status: "live" | "stable" | "review" | "monitoring" | "queued" | "at_risk";
  city: string;
  address: string;
  owner: string;
  joinedAt: string;
  updatedAt: string;
  walletBalance: string;
  lifetimeSpend: string;
  totalOrders: string;
  completedOrders: string;
  cancelledOrders: string;
  lastOrder: string;
  appVersion: string;
  paymentMethod: string;
  notes: string;
  tags: string[];
  timeline: Array<{
    label: string;
    detail: string;
    time: string;
  }>;
};

export const customerProfiles: CustomerProfile[] = [
  {
    id: "CUS-881",
    name: "Martha Bwalya",
    email: "martha.bwalya@ntumai.test",
    phone: "+260 97 330 1142",
    segment: "High value",
    status: "monitoring",
    city: "Lusaka",
    address: "Kabulonga, Lusaka",
    owner: "CRM desk",
    joinedAt: "12 Jan 2025",
    updatedAt: "29 Apr 2026, 09:04",
    walletBalance: "ZMW 186",
    lifetimeSpend: "ZMW 12,440",
    totalOrders: "148",
    completedOrders: "139",
    cancelledOrders: "9",
    lastOrder: "Today, 08:44",
    appVersion: "Customer App v5.18.0",
    paymentMethod: "Visa ending 1182",
    notes: "High-frequency groceries and marketplace buyer with recent inactivity trend after a support complaint cluster.",
    tags: ["VIP", "Wallet enabled", "Priority recovery"],
    timeline: [
      { label: "Customer profile reviewed", detail: "CRM opened retention watch after order cadence softened this week.", time: "09:04" },
      { label: "Support recovery applied", detail: "Wallet credit issued after delayed grocery handoff.", time: "Yesterday" },
      { label: "Marketplace purchase completed", detail: "Home essentials basket delivered successfully.", time: "27 Apr" },
    ],
  },
  {
    id: "CUS-880",
    name: "Josephine Mwila",
    email: "josephine.mwila@ntumai.test",
    phone: "+260 96 442 0081",
    segment: "Trust review",
    status: "review",
    city: "Ndola",
    address: "Itawa, Ndola",
    owner: "Trust team",
    joinedAt: "03 Mar 2025",
    updatedAt: "29 Apr 2026, 08:50",
    walletBalance: "ZMW 44",
    lifetimeSpend: "ZMW 2,910",
    totalOrders: "39",
    completedOrders: "31",
    cancelledOrders: "8",
    lastOrder: "28 Apr 2026, 19:18",
    appVersion: "Customer App v5.17.4",
    paymentMethod: "MTN MoMo",
    notes: "Wallet verification and manual KYC are still open before higher-value flows can be cleared.",
    tags: ["KYC review", "Wallet hold"],
    timeline: [
      { label: "Wallet verification opened", detail: "Finance requested manual customer verification before wallet release.", time: "08:50" },
      { label: "Customer submitted ID", detail: "Identity resubmission entered review queue.", time: "Yesterday" },
      { label: "Account restriction lifted partially", detail: "Ordering remains active while wallet actions stay gated.", time: "25 Apr" },
    ],
  },
  {
    id: "CUS-879",
    name: "Ciela Household",
    email: "ciela.household@ntumai.test",
    phone: "+260 95 220 4449",
    segment: "Weekly repeat",
    status: "stable",
    city: "Kitwe",
    address: "Parklands, Kitwe",
    owner: "Success team",
    joinedAt: "22 Aug 2024",
    updatedAt: "29 Apr 2026, 08:21",
    walletBalance: "ZMW 0",
    lifetimeSpend: "ZMW 8,760",
    totalOrders: "102",
    completedOrders: "99",
    cancelledOrders: "3",
    lastOrder: "Today, 07:55",
    appVersion: "Customer App v5.18.0",
    paymentMethod: "Airtel Money",
    notes: "Healthy repeat household with strong order cadence across groceries and quick errands.",
    tags: ["Healthy cadence", "Marketplace repeat"],
    timeline: [
      { label: "Repeat basket delivered", detail: "Scheduled grocery run completed within SLA.", time: "07:55" },
      { label: "Loyalty credit earned", detail: "Customer moved into the weekly repeat segment.", time: "Yesterday" },
      { label: "Profile refreshed", detail: "Address and preference data updated from recent orders.", time: "26 Apr" },
    ],
  },
  {
    id: "CUS-878",
    name: "Brian Tembo",
    email: "brian.tembo@ntumai.test",
    phone: "+260 97 114 3892",
    segment: "Refunds",
    status: "at_risk",
    city: "Lusaka",
    address: "Ibex Hill, Lusaka",
    owner: "Care pod",
    joinedAt: "14 Nov 2024",
    updatedAt: "29 Apr 2026, 08:00",
    walletBalance: "ZMW 62",
    lifetimeSpend: "ZMW 1,980",
    totalOrders: "27",
    completedOrders: "19",
    cancelledOrders: "8",
    lastOrder: "28 Apr 2026, 21:07",
    appVersion: "Customer App v5.16.9",
    paymentMethod: "Visa ending 4006",
    notes: "Customer has repeated refund follow-up contacts and needs recovery handling before churn risk grows further.",
    tags: ["Refund callbacks", "At risk"],
    timeline: [
      { label: "Refund follow-up logged", detail: "Customer called back about a missing wallet credit.", time: "08:00" },
      { label: "Finance note added", detail: "Refund desk confirmed the reversal is still pending settlement.", time: "Yesterday" },
      { label: "Retention watch opened", detail: "Support churn risk threshold was crossed.", time: "27 Apr" },
    ],
  },
  {
    id: "CUS-877",
    name: "Natasha Phiri",
    email: "natasha.phiri@ntumai.test",
    phone: "+260 97 411 2084",
    segment: "Growth",
    status: "live",
    city: "Lusaka",
    address: "Roma, Lusaka",
    owner: "Growth desk",
    joinedAt: "19 Apr 2026",
    updatedAt: "29 Apr 2026, 07:39",
    walletBalance: "ZMW 12",
    lifetimeSpend: "ZMW 480",
    totalOrders: "6",
    completedOrders: "6",
    cancelledOrders: "0",
    lastOrder: "28 Apr 2026, 18:14",
    appVersion: "Customer App v5.18.0",
    paymentMethod: "Cash on delivery",
    notes: "Newly onboarded referral customer with clean early usage and good conversion into first-week orders.",
    tags: ["Referral", "New user"],
    timeline: [
      { label: "Referral activation", detail: "Customer completed signup and first order journey.", time: "07:39" },
      { label: "First grocery order delivered", detail: "Initial conversion flow completed successfully.", time: "Yesterday" },
      { label: "Campaign attribution locked", detail: "Growth source confirmed for onboarding reporting.", time: "27 Apr" },
    ],
  },
];

export function getCustomerProfile(id: string) {
  return customerProfiles.find((customer) => customer.id === id);
}
