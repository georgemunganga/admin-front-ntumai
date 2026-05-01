"use client";

import { useModal } from "@/app/shared/modal-views/use-modal";
import AdminAccessDeniedModal from "@/components/auth/admin-access-denied-modal";
import { useAuth } from "@/components/auth/auth-provider";

type GuardRequirement = "read" | "write" | "delete";

function getRequirementCopy(requirement: GuardRequirement) {
  if (requirement === "delete") {
    return {
      title: "Delete Permission Required",
      message: "Your staff role does not allow delete actions on this admin surface.",
    };
  }
  if (requirement === "write") {
    return {
      title: "Write Permission Required",
      message: "Your staff role can view this page, but it cannot create or edit records here.",
    };
  }
  return {
    title: "Read Permission Required",
    message: "Your staff role does not allow access to this admin surface.",
  };
}

export function useAdminActionGuard() {
  const { openModal } = useModal();
  const { canRead, canWrite, canDelete } = useAuth();

  function isAllowed(requirement: GuardRequirement) {
    if (requirement === "delete") return canDelete;
    if (requirement === "write") return canWrite;
    return canRead;
  }

  function openDeniedModal(requirement: GuardRequirement, message?: string) {
    const copy = getRequirementCopy(requirement);
    openModal({
      view: (
        <AdminAccessDeniedModal
          title={copy.title}
          message={message ?? copy.message}
        />
      ),
      customSize: 420,
    });
  }

  function guardAction(
    requirement: GuardRequirement,
    onAllowed: () => void,
    deniedMessage?: string,
  ) {
    if (isAllowed(requirement)) {
      onAllowed();
      return;
    }
    openDeniedModal(requirement, deniedMessage);
  }

  return {
    canRead,
    canWrite,
    canDelete,
    isAllowed,
    openDeniedModal,
    guardAction,
  };
}
