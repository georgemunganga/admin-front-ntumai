"use client";

import { useState } from "react";
import { Button, Checkbox, Radio, RadioGroup, Switch, Text, Title } from "rizzui";
import ProfileHeader from "@/components/profile-settings/profile-header";
import ProfileSettingsNav from "@/components/profile-settings/profile-settings-nav";
import FormGroup from "@/components/profile-settings/form-group";

const generalOptions = [
  "I'm mentioned in a message",
  "Someone replies to any message",
  "I'm assigned a task",
  "A task is overdue",
  "A task status is updated",
];

const summaryOptions = ["Daily summary", "Weekly summary", "Monthly summary", "Quarterly summary"];
const buttonOptions = ["None", "In-app", "Email"];

function ButtonGroup() {
  const [selected, setSelected] = useState<string>("In-app");

  return (
    <div className="inline-flex gap-1">
      {buttonOptions.map((option) => (
        <Button
          key={option}
          variant={selected === option ? "solid" : "outline"}
          onClick={() => setSelected(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}

export default function NotificationSettingsPage() {
  const [reminderValue, setReminderValue] = useState("important_only");
  const [activityValue, setActivityValue] = useState("all_reminder_activity");

  return (
    <>
      <ProfileHeader
        title="Ntumai Ops"
        description="Select when and how you will be notified."
      />
      <ProfileSettingsNav />
      <div className="@container mx-auto w-full max-w-screen-2xl py-8">
        <FormGroup
          title="General notifications"
          description="Select when you'll be notified when the following changes occur."
          className="border-b border-dashed border-muted pb-8"
        >
          <div className="space-y-0">
            {generalOptions.map((title) => (
              <div key={title} className="flex items-center justify-between border-b border-muted py-6 last:border-none last:pb-0">
                <Text className="text-sm font-medium text-gray-900">{title}</Text>
                <ButtonGroup />
              </div>
            ))}
          </div>
        </FormGroup>

        <FormGroup
          title="Summary notifications"
          description="Select when you'll be notified when the following summaries or reports are ready."
          className="border-b border-dashed border-muted py-8"
        >
          <div className="space-y-0">
            {summaryOptions.map((title) => (
              <div key={title} className="flex items-center justify-between border-b border-muted py-6 last:border-none last:pb-0">
                <Text className="text-sm font-medium text-gray-900">{title}</Text>
                <ButtonGroup />
              </div>
            ))}
          </div>
        </FormGroup>

        <FormGroup
          title="Comments"
          description="These are notifications for comments on your posts and replies to your comments."
          className="border-b border-dashed border-muted py-8"
        >
          <div className="space-y-5">
            <Switch label="Do not notify me" variant="flat" labelClassName="font-medium text-sm text-gray-900" />
            <Switch label="Mentions only" variant="flat" labelClassName="font-medium text-sm text-gray-900" />
            <Switch label="All comments" variant="flat" labelClassName="font-medium text-sm text-gray-900" />
          </div>
        </FormGroup>

        <FormGroup
          title="Notifications from us"
          description="These are notifications for updates and product research invitations."
          className="border-b border-dashed border-muted py-8"
        >
          <div className="space-y-5">
            <div>
              <Checkbox label="News and updates" />
              <Text className="mt-2 ms-8 text-sm text-gray-500">
                News about product and feature updates.
              </Text>
            </div>
            <div>
              <Checkbox label="Tips and tutorials" />
              <Text className="mt-2 ms-8 text-sm text-gray-500">
                Tips on getting more out of Ntumai admin.
              </Text>
            </div>
            <div>
              <Checkbox label="User research" />
              <Text className="mt-2 ms-8 text-sm text-gray-500">
                Participate in beta testing and product research.
              </Text>
            </div>
          </div>
        </FormGroup>

        <FormGroup
          title="Reminders"
          description="These are notifications to remind you of updates you might have missed."
          className="border-b border-dashed border-muted py-8"
        >
          <RadioGroup value={reminderValue} setValue={setReminderValue}>
            <div className="flex w-full flex-col">
              <Radio name="reminders" label="Do not notify me" value="do_not_notify" className="mb-5" />
              <div className="mb-5">
                <Radio name="reminders" label="Important reminders only" value="important_only" />
                <Text className="mt-2 ms-8 text-sm text-gray-500">
                  Only notify me if the reminder is tagged as important.
                </Text>
              </div>
              <div>
                <Radio name="reminders" value="all_reminder" label="All reminders" />
                <Text className="mt-2 ms-8 text-sm text-gray-500">
                  Notify me for all reminders.
                </Text>
              </div>
            </div>
          </RadioGroup>
        </FormGroup>

        <FormGroup
          title="More activity about you"
          description="These are notifications for posts on your profile, likes and other reactions to your posts, and more."
          className="border-0 py-8 pb-0"
        >
          <RadioGroup value={activityValue} setValue={setActivityValue}>
            <div className="flex w-full flex-col">
              <Radio name="activity" label="Do not notify me" value="do_not_notify_activity" className="mb-5" />
              <div>
                <Radio name="activity" value="all_reminder_activity" label="All reminders" />
                <Text className="mt-2 ms-8 text-sm text-gray-500">
                  Notify me for all reminders.
                </Text>
              </div>
            </div>
          </RadioGroup>
        </FormGroup>
      </div>
    </>
  );
}
