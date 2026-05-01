import type { AdminSessionUser } from "@/repositories/admin/admin-session";

export const ADMIN_PERMISSION_READ = "Read";
export const ADMIN_PERMISSION_WRITE = "Write";
export const ADMIN_PERMISSION_DELETE = "Delete";

type GuardedUser = Pick<AdminSessionUser, "role" | "activeRole" | "roles" | "permissions"> | null | undefined;

const PUBLIC_PATHS = new Set([
  "/signin",
  "/auth/forgot-password-1",
  "/auth/otp-1",
  "/access-denied",
]);

const SELF_SERVICE_PATHS = [
  /^\/profile$/,
  /^\/profile-settings$/,
  /^\/profile-settings\/profile$/,
  /^\/profile-settings\/password$/,
  /^\/profile-settings\/notification$/,
];

const WRITE_PATHS = [
  /^\/marketplace\/products\/create$/,
  /^\/marketplace\/products\/[^/]+\/edit$/,
  /^\/marketplace\/vendors\/create$/,
  /^\/marketplace\/vendors\/[^/]+\/edit$/,
  /^\/marketplace\/categories\/create$/,
  /^\/marketplace\/categories\/[^/]+\/edit$/,
  /^\/sales\/orders\/create$/,
  /^\/sales\/orders\/[^/]+\/edit$/,
  /^\/sales\/invoices\/create$/,
  /^\/sales\/invoices\/builder$/,
  /^\/sales\/invoices\/[^/]+\/edit$/,
  /^\/logistics\/shipments\/create$/,
  /^\/logistics\/shipments\/[^/]+\/edit$/,
  /^\/support\/templates\/create$/,
  /^\/support\/templates\/[^/]+\/edit$/,
];

function normalizePath(pathname: string) {
  const [pathOnly] = pathname.split(/[?#]/, 1);
  if (!pathOnly) return "/";
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) {
    return pathOnly.slice(0, -1);
  }
  return pathOnly;
}

function hasLegacyAdminBypass(user: GuardedUser) {
  const roles = [user?.role, user?.activeRole, ...(user?.roles ?? [])]
    .filter(Boolean)
    .map((role) => String(role).toUpperCase());
  return roles.includes("ADMIN");
}

export function getEffectiveAdminPermissions(user: GuardedUser) {
  const explicit = (user?.permissions ?? [])
    .map((permission) => String(permission).trim())
    .filter(Boolean);

  if (explicit.length > 0) {
    return explicit;
  }

  // Keep bootstrap ADMIN accounts usable until every staff account has a StaffRole assignment.
  if (hasLegacyAdminBypass(user)) {
    return [
      ADMIN_PERMISSION_READ,
      ADMIN_PERMISSION_WRITE,
      ADMIN_PERMISSION_DELETE,
    ];
  }

  return [];
}

export function hasAdminPermission(user: GuardedUser, permission: string) {
  return getEffectiveAdminPermissions(user).includes(permission);
}

export function canReadAdmin(user: GuardedUser) {
  return (
    hasAdminPermission(user, ADMIN_PERMISSION_READ) ||
    hasAdminPermission(user, ADMIN_PERMISSION_WRITE) ||
    hasAdminPermission(user, ADMIN_PERMISSION_DELETE)
  );
}

export function canWriteAdmin(user: GuardedUser) {
  return (
    hasAdminPermission(user, ADMIN_PERMISSION_WRITE) ||
    hasAdminPermission(user, ADMIN_PERMISSION_DELETE)
  );
}

export function canDeleteAdmin(user: GuardedUser) {
  return hasAdminPermission(user, ADMIN_PERMISSION_DELETE);
}

export function isPublicAdminPath(pathname: string) {
  return PUBLIC_PATHS.has(normalizePath(pathname));
}

export function isSelfServiceAdminPath(pathname: string) {
  const normalized = normalizePath(pathname);
  return SELF_SERVICE_PATHS.some((pattern) => pattern.test(normalized));
}

export function requiresWriteAdmin(pathname: string) {
  const normalized = normalizePath(pathname);
  return WRITE_PATHS.some((pattern) => pattern.test(normalized));
}

export function canAccessAdminPath(pathname: string, user: GuardedUser) {
  if (isPublicAdminPath(pathname) || isSelfServiceAdminPath(pathname)) {
    return true;
  }

  if (requiresWriteAdmin(pathname)) {
    return canWriteAdmin(user);
  }

  return canReadAdmin(user);
}

