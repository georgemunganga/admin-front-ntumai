"use client";

import { useMemo } from "react";
import type { AdminWorkflowContext } from "@/contracts/admin-domain";
import { supportTemplates, type SupportTemplate } from "@/components/support/template-data";
import {
  patchAdminData,
  postAdminData,
  useAdminResource,
} from "@/repositories/admin/admin-api";

export type SupportTemplateChannel = SupportTemplate["channel"];
export type SupportTemplateFolder =
  | "delivery_recovery"
  | "dispatch_updates"
  | "finance_settlements"
  | "trust_and_risk";

export type SupportTemplateRecord = SupportTemplate & {
  folder: SupportTemplateFolder;
  workflow: AdminWorkflowContext;
  createdAt?: string;
};

type SupportTemplateApiItem = {
  id: string;
  name: string;
  channel: "Email" | "SMS" | "Push";
  audience: string;
  status: "live" | "review" | "queued";
  owner: string;
  subject: string;
  preview: string;
  folder: SupportTemplateFolder;
  variables: string[];
  createdAt?: string;
  updatedAt?: string;
};

type SupportTemplateApiPayload = {
  items?: SupportTemplateApiItem[];
  item?: SupportTemplateApiItem;
};

type SupportTemplateMutationInput = {
  name: string;
  channel: "Email" | "SMS" | "Push";
  audience: string;
  status: "live" | "review" | "queued";
  owner: string;
  subject: string;
  preview: string;
  folder: SupportTemplateFolder;
  variables?: string[];
};

const folderByTemplateId: Record<string, SupportTemplateFolder> = {
  "TPL-1001": "delivery_recovery",
  "TPL-1002": "dispatch_updates",
  "TPL-1003": "finance_settlements",
};

const workflowByTemplateId: Record<string, AdminWorkflowContext> = {
  "TPL-1001": {
    actor: "customer",
    source: "support_recovery",
    state: "resolved",
    ownerTeam: "support",
    summary: "Customer-facing delivery closure and recovery messaging for completed orders.",
  },
  "TPL-1002": {
    actor: "tasker",
    source: "delivery",
    state: "assigned",
    ownerTeam: "dispatch",
    summary: "Tasker-facing dispatch update used when live delivery assignments change.",
  },
  "TPL-1003": {
    actor: "vendor",
    source: "payout_request",
    state: "submitted",
    ownerTeam: "finance",
    summary: "Vendor-facing settlement message used during payout and invoice release cycles.",
  },
};

export function listSupportTemplates(): SupportTemplateRecord[] {
  return supportTemplates.map(toSupportTemplateRecord);
}

export function getSupportTemplateById(id: string): SupportTemplateRecord | undefined {
  const template = supportTemplates.find((item) => item.id === id);
  return template ? toSupportTemplateRecord(template) : undefined;
}

export function listSupportTemplateChannels(): SupportTemplateChannel[] {
  return Array.from(new Set(supportTemplates.map((template) => template.channel)));
}

export function listSupportTemplateFolders(): SupportTemplateFolder[] {
  return Array.from(new Set(Object.values(folderByTemplateId)));
}

export function useAdminSupportTemplates(params?: {
  search?: string;
  channel?: string;
  status?: string;
  folder?: string;
}) {
  const fallback = useMemo(() => listSupportTemplates(), []);
  return useAdminResource<SupportTemplateRecord[]>({
    path: buildSupportTemplatesPath(params),
    fallback,
    map: mapSupportTemplatesPayload,
  });
}

export function useAdminSupportTemplateDetail(id: string) {
  const fallback = useMemo(() => getSupportTemplateById(id) ?? null, [id]);
  return useAdminResource<SupportTemplateRecord | null>({
    path: `/api/v1/admin/support/templates/${id}`,
    fallback,
    map: mapSupportTemplateDetailPayload,
    enabled: Boolean(id),
  });
}

export async function createAdminSupportTemplate(input: SupportTemplateMutationInput) {
  return postAdminData<{ item: SupportTemplateApiItem }>(
    "/api/v1/admin/support/templates",
    sanitizeSupportTemplatePayload(input),
  );
}

export async function updateAdminSupportTemplate(
  id: string,
  input: SupportTemplateMutationInput,
) {
  return patchAdminData<{ item: SupportTemplateApiItem }>(
    `/api/v1/admin/support/templates/${id}`,
    sanitizeSupportTemplatePayload(input),
  );
}

function buildSupportTemplatesPath(params?: {
  search?: string;
  channel?: string;
  status?: string;
  folder?: string;
}) {
  const qs = new URLSearchParams();
  qs.set("limit", "100");
  if (params?.search?.trim()) qs.set("search", params.search.trim());
  if (params?.channel && params.channel !== "all") qs.set("channel", params.channel);
  if (params?.status && params.status !== "all") qs.set("status", params.status);
  if (params?.folder && params.folder !== "all") qs.set("folder", params.folder);
  return `/api/v1/admin/support/templates?${qs.toString()}`;
}

function mapSupportTemplatesPayload(payload: unknown): SupportTemplateRecord[] {
  const items = (payload as SupportTemplateApiPayload)?.items ?? [];
  return items.map(mapSupportTemplateItemToRecord);
}

function mapSupportTemplateDetailPayload(payload: unknown): SupportTemplateRecord | null {
  const item = (payload as SupportTemplateApiPayload)?.item;
  return item ? mapSupportTemplateItemToRecord(item) : null;
}

function mapSupportTemplateItemToRecord(item: SupportTemplateApiItem): SupportTemplateRecord {
  return {
    id: item.id,
    name: item.name,
    channel: item.channel,
    audience: item.audience,
    status: item.status,
    updatedAt: formatDateTime(item.updatedAt || item.createdAt),
    owner: item.owner,
    subject: item.subject,
    preview: item.preview,
    variables: item.variables ?? [],
    folder: item.folder,
    workflow: workflowForTemplate(item),
    createdAt: item.createdAt,
  };
}

function workflowForTemplate(item: Pick<SupportTemplateApiItem, "folder" | "audience" | "channel" | "status">): AdminWorkflowContext {
  switch (item.folder) {
    case "dispatch_updates":
      return {
        actor: "tasker",
        source: "delivery",
        state: "assigned",
        ownerTeam: "dispatch",
        summary: "Dispatch and tasker messaging used while live delivery assignments are changing.",
      };
    case "finance_settlements":
      return {
        actor: "vendor",
        source: "payout_request",
        state: item.status === "live" ? "approved" : "submitted",
        ownerTeam: "finance",
        summary: "Finance messaging used for settlements, payout notifications, and vendor finance workflows.",
      };
    case "trust_and_risk":
      return {
        actor: "customer",
        source: "support_recovery",
        state: "under_review",
        ownerTeam: "support",
        summary: "Trust, risk, and review messaging used in sensitive support and compliance flows.",
      };
    default:
      return {
        actor: item.audience.toLowerCase().includes("vendor")
          ? "vendor"
          : item.audience.toLowerCase().includes("tasker")
            ? "tasker"
            : "customer",
        source: "support_recovery",
        state: item.status === "live" ? "resolved" : "submitted",
        ownerTeam: "support",
        summary: "Support communication used to manage a live Ntumai workflow.",
      };
  }
}

function toSupportTemplateRecord(template: SupportTemplate): SupportTemplateRecord {
  return {
    ...template,
    folder: folderByTemplateId[template.id] ?? "delivery_recovery",
    workflow: workflowByTemplateId[template.id] ?? {
      actor: "customer",
      source: "support_recovery",
      state: "submitted",
      ownerTeam: "support",
      summary: "Support communication used to manage a live mobile workflow.",
    },
  };
}

function sanitizeSupportTemplatePayload(input: SupportTemplateMutationInput) {
  return {
    name: input.name,
    channel: input.channel,
    audience: input.audience,
    status: input.status,
    owner: input.owner,
    subject: input.subject,
    preview: input.preview,
    folder: input.folder,
    variables: input.variables ?? [],
  };
}

function formatDateTime(value?: string) {
  if (!value) return "Unknown";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
