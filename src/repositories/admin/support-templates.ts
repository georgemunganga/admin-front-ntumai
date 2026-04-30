"use client";

import type { AdminWorkflowContext } from "@/contracts/admin-domain";
import { supportTemplates, type SupportTemplate } from "@/components/support/template-data";

export type SupportTemplateChannel = SupportTemplate["channel"];
export type SupportTemplateFolder =
  | "delivery_recovery"
  | "dispatch_updates"
  | "finance_settlements"
  | "trust_and_risk";

export type SupportTemplateRecord = SupportTemplate & {
  folder: SupportTemplateFolder;
  workflow: AdminWorkflowContext;
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
