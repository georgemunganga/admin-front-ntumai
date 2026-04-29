import { ROLES } from "@/config/constants";

export const permissions = ["Read", "Write", "Delete"] as const;
export const statuses = ["Active", "Deactivated", "Pending"] as const;

export type RoleUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  permissions: string[];
  status: (typeof statuses)[number];
};

export const roleUsers: RoleUser[] = [
  {
    id: 1001,
    fullName: "George Munganga",
    email: "george@ntumai.com",
    role: ROLES.Administrator,
    createdAt: "2026-03-12T10:30:00.000Z",
    permissions: ["Read", "Write", "Delete"],
    status: "Active",
  },
  {
    id: 1002,
    fullName: "Mercy Tembo",
    email: "mercy.ops@ntumai.com",
    role: ROLES.Manager,
    createdAt: "2026-03-18T08:15:00.000Z",
    permissions: ["Read", "Write"],
    status: "Active",
  },
  {
    id: 1003,
    fullName: "Ruth Mwape",
    email: "ruth.support@ntumai.com",
    role: ROLES.Support,
    createdAt: "2026-03-22T12:05:00.000Z",
    permissions: ["Read"],
    status: "Pending",
  },
  {
    id: 1004,
    fullName: "Benson Phiri",
    email: "benson.finance@ntumai.com",
    role: ROLES.Sales,
    createdAt: "2026-04-01T09:40:00.000Z",
    permissions: ["Read", "Write"],
    status: "Deactivated",
  },
];

const roleAvatars = [
  "/avatars/avatar-1.webp",
  "/avatars/avatar-2.webp",
  "/avatars/avatar-3.webp",
  "/avatars/avatar-4.webp",
];

export const rolesList = [
  { name: ROLES.Administrator, color: "#2465FF", users: roleAvatars },
  { name: ROLES.Manager, color: "#F5A623", users: roleAvatars },
  { name: ROLES.Sales, color: "#FF1A1A", users: roleAvatars },
  { name: ROLES.Support, color: "#8A63D2", users: roleAvatars },
  { name: ROLES.Developer, color: "#EF4444", users: roleAvatars },
  { name: ROLES.HRD, color: "#11A849", users: roleAvatars },
  { name: ROLES.RestrictedUser, color: "#4E36F5", users: roleAvatars },
  { name: ROLES.Customer, color: "#0070F3", users: roleAvatars },
];
