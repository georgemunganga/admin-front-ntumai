"use client";

import type { AdminStatus } from "@/contracts/admin-domain";
import { customerProfiles, type CustomerProfile } from "@/components/crm/customer-data";

export type CustomerListRecord = {
  id: string;
  name: string;
  context: string;
  segment: string;
  status: AdminStatus;
  owner: string;
  updatedAt: string;
  email: string;
  phone: string;
  city: string;
};

export function listCustomerProfiles(): CustomerProfile[] {
  return customerProfiles;
}

export function getCustomerProfileById(id: string): CustomerProfile | undefined {
  return customerProfiles.find((customer) => customer.id === id);
}

export function listCustomerRecords(): CustomerListRecord[] {
  return customerProfiles.map((customer) => ({
    id: customer.id,
    name: customer.name,
    context: customer.notes,
    segment: customer.segment,
    status: customer.status,
    owner: customer.owner,
    updatedAt: customer.updatedAt,
    email: customer.email,
    phone: customer.phone,
    city: customer.city,
  }));
}

export function listCustomerSegments(): string[] {
  return Array.from(new Set(customerProfiles.map((customer) => customer.segment)));
}
