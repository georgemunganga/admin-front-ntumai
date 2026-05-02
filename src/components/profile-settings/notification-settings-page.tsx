"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Switch, Text } from "rizzui";
import ProfileHeader from "@/components/profile-settings/profile-header";
import ProfileSettingsNav from "@/components/profile-settings/profile-settings-nav";
import FormGroup from "@/components/profile-settings/form-group";
import DataSourceState from "@/components/admin/data-source-state";
import { useAuth } from "@/components/auth/auth-provider";
import {
  type AdminUserPreferences,
  updateAdminProfilePreferences,
  useAdminProfilePreferences,
} from "@/repositories/admin/profile-settings";

const groups: Array<{
  title: string;
  description: string;
  section: keyof AdminUserPreferences;
  options: Array<{ key: string; label: string; helper: string }>;
}> = [
  {
    title: "General notifications",
    description: "Core platform notifications that affect the admin account itself.",
    section: "notifications",
    options: [
      { key: "orderUpdates", label: "Order updates", helper: "Order state changes and delivery progress notices." },
      { key: "promotions", label: "Promotions", helper: "Campaign and offer visibility updates." },
      { key: "newRestaurants", label: "New vendors", helper: "New marketplace vendor or catalog onboarding activity." },
      { key: "priceDrops", label: "Price drops", helper: "Pricing or fee movement that affects active commerce flows." },
    ],
  },
  {
    title: "Tasker operations",
    description: "Signals relevant to tasker supply, job availability, and earnings activity.",
    section: "taskerNotifications",
    options: [
      { key: "newJobs", label: "New jobs", helper: "Fresh job offers and job supply movement." },
      { key: "jobReminders", label: "Job reminders", helper: "Follow-up reminders on accepted or pending jobs." },
      { key: "earningsUpdates", label: "Earnings updates", helper: "Tasker earnings changes, adjustments, and summaries." },
      { key: "weeklyReport", label: "Weekly report", helper: "A weekly operations digest for tasker performance." },
    ],
  },
  {
    title: "Vendor operations",
    description: "Store and marketplace notifications that matter for vendor management.",
    section: "vendorNotifications",
    options: [
      { key: "newOrders", label: "New orders", helper: "New marketplace order creation against vendor stores." },
      { key: "orderReminders", label: "Order reminders", helper: "Operational reminders on pending prep and handoff." },
      { key: "lowStock", label: "Low stock", helper: "Inventory warnings that may block marketplace readiness." },
      { key: "dailyReport", label: "Daily report", helper: "A daily summary of vendor activity." },
      { key: "customerReviews", label: "Customer reviews", helper: "Ratings and review events from marketplace orders." },
    ],
  },
];

export default function NotificationSettingsPage() {
  const { user } = useAuth();
  const { data, isLoading, isLive, error, refresh } = useAdminProfilePreferences();
  const [form, setForm] = useState<AdminUserPreferences>(data);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const hasChanges = useMemo(() => JSON.stringify(form) !== JSON.stringify(data), [form, data]);

  async function handleSave() {
    setIsSaving(true);
    setFeedback(null);

    try {
      const next = await updateAdminProfilePreferences(form);
      setForm(next);
      setFeedback({ type: "success", message: "Notification settings updated successfully." });
      refresh();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to update notification settings.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <ProfileHeader
        title={user?.name || "Ntumai Ops"}
        description="Select which admin and operations notifications you want to receive."
      />
      <ProfileSettingsNav />
      <div className="@container mx-auto w-full max-w-screen-2xl py-8">
        <div className="mb-6 flex justify-end">
          <DataSourceState isLoading={isLoading} isLive={isLive} error={error} />
        </div>

        <div className="space-y-8">
          {groups.map((group, groupIndex) => (
            <FormGroup
              key={group.title}
              title={group.title}
              description={group.description}
              className={groupIndex === groups.length - 1 ? "border-0 py-0" : "border-b border-dashed border-muted pb-8"}
            >
              <div className="space-y-0 rounded-2xl border border-gray-100 bg-white">
                {group.options.map((option, optionIndex) => {
                  const checked = form[group.section][option.key as keyof typeof form[typeof group.section]] as boolean;
                  return (
                    <div
                      key={option.key}
                      className={`flex items-start justify-between gap-5 px-5 py-5 ${
                        optionIndex === group.options.length - 1 ? "" : "border-b border-gray-100"
                      }`}
                    >
                      <div className="pr-4">
                        <Text className="text-sm font-medium text-gray-900">{option.label}</Text>
                        <Text className="mt-2 text-sm leading-6 text-gray-500">{option.helper}</Text>
                      </div>
                      <Switch
                        checked={checked}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            [group.section]: {
                              ...current[group.section],
                              [option.key]: event.target.checked,
                            },
                          }))
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </FormGroup>
          ))}
        </div>

        {feedback ? (
          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setForm(data);
              setFeedback(null);
            }}
          >
            Reset
          </Button>
          <Button disabled={!hasChanges || isSaving} isLoading={isSaving} onClick={handleSave}>
            Save Notifications
          </Button>
        </div>
      </div>
    </>
  );
}
