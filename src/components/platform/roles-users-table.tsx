"use client";

import { useMemo, useState } from "react";
import { Avatar, Badge, Button, Input, Select, Table, Text, Title } from "rizzui";
import { PiEnvelopeBold, PiMagnifyingGlassBold, PiPlusBold, PiTrashDuotone } from "react-icons/pi";
import { useModal } from "@/app/shared/modal-views/use-modal";
import CreateUserModal from "@/components/platform/create-user-modal";
import { useAuth } from "@/components/auth/auth-provider";
import {
  deletePlatformAccessUser,
  type PlatformAccessUser,
  type PlatformRoleCard,
  listPlatformUserStatuses,
  sendStaffInvite,
} from "@/repositories/admin/platform-access";

function StatusPill({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  if (normalized === "accepted" || normalized === "active") {
    return <span className="text-green-dark">● {value}</span>;
  }
  if (normalized === "rejected" || normalized === "deactivated") {
    return <span className="text-red-dark">● {value}</span>;
  }
  return <span className="text-orange-dark">● {value}</span>;
}

function InviteButton({ userId, status }: { userId?: string; status: string }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const normalizedStatus = status.toLowerCase();

  // Only show for Pending users that have a real userId (live backend record)
  if (normalizedStatus !== "pending" || !userId) return null;

  async function handleInvite() {
    setSending(true);
    const result = await sendStaffInvite(userId!);
    setSending(false);
    if (result.success) setSent(true);
  }

  if (sent) {
    return (
      <span className="text-xs font-medium text-green-dark">Invite sent</span>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={sending}
      onClick={handleInvite}
      className="rounded-2xl"
    >
      <PiEnvelopeBold className="me-1.5 size-3.5" />
      {sending ? "Sending…" : "Resend invite"}
    </Button>
  );
}

export default function RolesUsersTable({
  users,
  roles,
  onRefresh,
}: {
  users: PlatformAccessUser[];
  roles: PlatformRoleCard[];
  onRefresh: () => void;
}) {
  const { openModal } = useModal();
  const { canWrite, canDelete } = useAuth();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const roleOptions = useMemo(
    () =>
      [{ label: "All roles", value: "all" }].concat(
        roles.map((item) => ({ label: item.name, value: item.name })),
      ),
    [roles],
  );
  const statusOptions = useMemo(
    () => [{ label: "All statuses", value: "all" }].concat(listPlatformUserStatuses().map((value) => ({ label: value, value }))),
    [],
  );

  const rows = useMemo(() => {
    return users.filter((item) => {
      const q = query.toLowerCase();
      const queryMatch =
        q.length === 0 || [item.fullName, item.email, item.role, item.activeRole, item.accessScope].join(" ").toLowerCase().includes(q);
      const roleMatch = role === "all" || item.role === role;
      const statusMatch = status === "all" || item.status === status;
      return queryMatch && roleMatch && statusMatch;
    });
  }, [query, role, status, users]);

  const isFiltered = query.length > 0 || role !== "all" || status !== "all";

  async function handleDeleteUser(inviteId: string) {
    if (!canDelete) return;
    const confirmed = window.confirm("Delete this staff invite?");
    if (!confirmed) return;

    try {
      await deletePlatformAccessUser(inviteId);
      onRefresh();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to delete the staff invite.",
      );
    }
  }

  return (
    <div className="mt-14">
      <div className="mb-4 @container">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <Title as="h3" className="order-1 whitespace-nowrap pe-4 text-base font-semibold sm:text-lg">
            Staff Access Users
          </Title>
          <div className="order-4 grid gap-2 @lg:grid-cols-2 @4xl:order-2 @4xl:flex @4xl:flex-row">
            <Select
              options={statusOptions}
              value={status}
              onChange={(option: any) => setStatus(option?.value ?? "all")}
              selectClassName="rounded-2xl"
            />
            <Select
              options={roleOptions}
              value={role}
              onChange={(option: any) => setRole(option?.value ?? "all")}
              selectClassName="rounded-2xl"
            />
            {isFiltered ? (
              <Button
                size="sm"
                onClick={() => {
                  setQuery("");
                  setRole("all");
                  setStatus("all");
                }}
                variant="flat"
                className="h-9 w-full bg-gray-200/70 @lg:col-span-full @4xl:w-auto"
              >
                <PiTrashDuotone className="me-1.5 size-[17px]" /> Clear
              </Button>
            ) : null}
          </div>
          <Input
            type="search"
            clearable
            placeholder="Search for users..."
            value={query}
            onClear={() => setQuery("")}
            onChange={(e) => setQuery(e.target.value)}
            prefix={<PiMagnifyingGlassBold className="size-4" />}
            className="order-3 h-9 w-full @2xl:order-2 @2xl:ms-auto @2xl:max-w-60 @4xl:order-3"
          />
          {canWrite ? (
            <div className="order-2 ms-4 @2xl:order-3 @2xl:ms-0 @4xl:order-4 @4xl:shrink-0">
              <Button
                className="mt-0 rounded-2xl bg-primary text-white hover:bg-primary/90"
                onClick={() =>
                  openModal({
                    view: <CreateUserModal roles={roles} onSuccess={onRefresh} />,
                    customSize: 600,
                  })
                }
              >
                <PiPlusBold className="me-1.5 h-4 w-4" />
                Add New User
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-muted">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>User ID</Table.Head>
              <Table.Head>Name</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head>Active flow</Table.Head>
              <Table.Head>Created</Table.Head>
              <Table.Head>Permissions</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell>#{row.id}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <Avatar name={row.fullName} size="sm" />
                    <div>
                      <Text className="font-medium text-gray-900">{row.fullName}</Text>
                      <Text className="text-gray-500">{row.email}</Text>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>{row.role}</Table.Cell>
                <Table.Cell>
                  <div>
                    <Text className="font-medium text-gray-900">{row.activeRole}</Text>
                    <Text className="text-gray-500">{row.workflow.summary}</Text>
                  </div>
                </Table.Cell>
                <Table.Cell>{new Date(row.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <div className="flex flex-wrap gap-2">
                    {row.permissions.map((permission) => (
                      <Badge key={permission} rounded="lg" variant="outline" className="border-muted font-normal text-gray-500">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <StatusPill value={row.status} />
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {canWrite ? <InviteButton userId={row.userId} status={row.status} /> : null}
                    {canDelete ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(String(row.userId ?? row.id))}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
