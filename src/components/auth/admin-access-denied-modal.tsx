"use client";

import { Button, Text, Title } from "rizzui";
import { PiLockKeyBold } from "react-icons/pi";
import { useModal } from "@/app/shared/modal-views/use-modal";

export default function AdminAccessDeniedModal({
  title = "Permission Required",
  message = "You do not have permission to perform this action.",
}: {
  title?: string;
  message?: string;
}) {
  const { closeModal } = useModal();

  return (
    <div className="rounded-3xl bg-white p-7 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PiLockKeyBold className="h-7 w-7" />
      </div>
      <Title as="h3" className="mt-5 text-lg font-semibold text-gray-900">
        {title}
      </Title>
      <Text className="mt-2 text-sm leading-6 text-gray-500">{message}</Text>
      <div className="mt-6 flex justify-center">
        <Button
          className="h-11 rounded-2xl bg-primary px-6 text-white hover:bg-primary/90"
          onClick={closeModal}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
