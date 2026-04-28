"use client";

export type SalesInvoice = {
  id: string;
  customer: string;
  dueDate: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue" | "Draft";
  createdAt: string;
  notes: string;
  items: Array<{ label: string; amount: string }>;
  timeline: Array<{ label: string; detail: string; time: string }>;
};

export const salesInvoices: SalesInvoice[] = [
  {
    id: "INV-4021",
    customer: "QuickBite Kitchens",
    dueDate: "Apr 29, 2026",
    amount: "ZMW 8,450",
    status: "Paid",
    createdAt: "Apr 20, 2026",
    notes: "Merchant settlement invoice already cleared.",
    items: [
      { label: "Marketplace sales", amount: "ZMW 9,120" },
      { label: "Delivery commission", amount: "- ZMW 520" },
      { label: "Adjustments", amount: "- ZMW 150" },
    ],
    timeline: [
      { label: "Invoice created", detail: "Weekly merchant billing cycle generated.", time: "Apr 20" },
      { label: "Sent to merchant", detail: "Shared through finance delivery channel.", time: "Apr 21" },
      { label: "Marked paid", detail: "Settlement received and reconciled.", time: "Apr 24" },
    ],
  },
  {
    id: "INV-4020",
    customer: "Green Basket Market",
    dueDate: "May 02, 2026",
    amount: "ZMW 5,120",
    status: "Pending",
    createdAt: "Apr 19, 2026",
    notes: "Pending merchant settlement confirmation.",
    items: [
      { label: "Marketplace sales", amount: "ZMW 5,640" },
      { label: "Delivery commission", amount: "- ZMW 420" },
      { label: "Adjustments", amount: "- ZMW 100" },
    ],
    timeline: [
      { label: "Invoice created", detail: "Settlement draft prepared.", time: "Apr 19" },
      { label: "Shared with merchant", detail: "Finance follow-up opened.", time: "Apr 20" },
    ],
  },
  {
    id: "INV-4019",
    customer: "CityCare Pharmacy",
    dueDate: "Apr 27, 2026",
    amount: "ZMW 2,380",
    status: "Overdue",
    createdAt: "Apr 17, 2026",
    notes: "Compliance hold slowed payment clearance.",
    items: [
      { label: "Marketplace sales", amount: "ZMW 2,660" },
      { label: "Delivery commission", amount: "- ZMW 220" },
      { label: "Adjustments", amount: "- ZMW 60" },
    ],
    timeline: [
      { label: "Invoice created", detail: "Pharmacy settlement cycle prepared.", time: "Apr 17" },
      { label: "Due date reached", detail: "Still waiting on merchant-side clearance.", time: "Apr 27" },
    ],
  },
  {
    id: "INV-4018",
    customer: "HomeBox Supplies",
    dueDate: "May 05, 2026",
    amount: "ZMW 6,975",
    status: "Draft",
    createdAt: "Apr 16, 2026",
    notes: "Draft invoice awaiting final adjustment review.",
    items: [
      { label: "Marketplace sales", amount: "ZMW 7,220" },
      { label: "Delivery commission", amount: "- ZMW 195" },
      { label: "Adjustments", amount: "- ZMW 50" },
    ],
    timeline: [
      { label: "Draft created", detail: "Settlement still open for review.", time: "Apr 16" },
    ],
  },
];

export function getSalesInvoice(id: string) {
  return salesInvoices.find((invoice) => invoice.id === id);
}
