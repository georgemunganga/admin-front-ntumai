"use client";

import Link from "next/link";
import { ReactElement, ReactNode, RefObject, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Title, Text, Popover, Avatar, Badge } from "rizzui";
import cn from "@/utils/class-names";
import { useMedia } from "@/hooks/use-media";
import SimpleBar from "@/components/ui/simplebar";
import { PiCheck } from "react-icons/pi";

dayjs.extend(relativeTime);

const data = [
  {
    id: 1,
    message: `It is nice to be chatting with you. Omnis,
        Dispatch requested support help for a payment edge case.`,
    avatar: [
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-01.webp",
    ],
    name: "Dispatch Desk",
    unRead: true,
    sendTime: "2023-06-01T09:35:31.820Z",
  },
  {
    id: 2,
    message: `Vendor ops flagged a product group that keeps failing image review.`,
    avatar: [
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-04.webp",
    ],
    name: "Vendor Operations",
    unRead: true,
    sendTime: "2023-05-30T09:35:31.820Z",
  },
  {
    id: 3,
    message: `Support needs approval before refunding a disputed wallet payment.`,
    avatar: [
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-12.webp",
    ],
    name: "Customer Care",
    unRead: false,
    sendTime: "2023-06-01T09:35:31.820Z",
  },
  {
    id: 4,
    message: `Finance wants the admin team to confirm yesterday's fee override batch.`,
    avatar: [
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-07.webp",
    ],
    name: "Finance Ops",
    unRead: false,
    sendTime: "2023-05-21T09:35:31.820Z",
  },
  {
    id: 5,
    message: `Growth uploaded the weekend banner set and needs a fast review pass.`,
    avatar: [
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-14.webp",
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-13.webp",
    ],
    name: "Growth Studio",
    unRead: true,
    sendTime: "2023-06-01T09:35:31.820Z",
  },
  {
    id: 6,
    message: `Driver success is asking for a filtered onboarding queue for new riders.`,
    avatar: [
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-01.webp",
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-05.webp",
    ],
    name: "Driver Success",
    unRead: true,
    sendTime: "2023-05-15T09:35:31.820Z",
  },
  {
    id: 7,

    name: "Trust and Safety",
    avatar: [
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-08.webp",
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-09.webp",
    ],
    unRead: false,
    sendTime: "2023-05-16T09:35:31.820Z",
  },
  {
    id: 8,
    message: `Merchants in one suburb are reporting stock sync gaps during lunch rush.`,
    avatar: [
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-11.webp",
    ],
    name: "Merchant Support",
    unRead: false,
    sendTime: "2023-05-01T09:35:31.820Z",
  },
  {
    id: 9,
    message: `Product wants this shell cleaned up before live CRUD wiring starts.`,
    avatar: [
      "https://isomorphic-furyroad.s3.amazonaws.com/public/avatars/avatar-03.webp",
    ],
    name: "Product Team",
    unRead: true,
    sendTime: "2023-04-01T09:35:31.820Z",
  },
];

function MessagesList({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-[320px] text-left sm:w-[360px] 2xl:w-[420px] rtl:text-right">
      <div className="mb-2 flex items-center justify-between ps-6">
          <Title as="h5">Team threads</Title>
        <Link
          href={"/support"}
          onClick={() => setIsOpen(false)}
          className="hover:underline"
        >
          Open support area
        </Link>
      </div>
      <SimpleBar className="max-h-[406px]">
        <div className="grid grid-cols-1 ps-4">
          {data.map((item) => (
            <div
              key={item.name + item.id}
              className="group grid cursor-pointer grid-cols-[auto_minmax(0,1fr)] gap-2.5 rounded-md px-2 py-2.5 pe-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-50"
            >
              <div className={cn("relative", item.avatar.length > 1 && "me-1")}>
                <Avatar
                  src={item.avatar[0]}
                  name={item.name}
                  className={cn(
                    item.avatar.length > 1 &&
                      "relative -end-1 -top-0.5 !h-9 !w-9",
                  )}
                />
                {item.avatar.length > 1 && (
                  <Avatar
                    src={item.avatar[1]}
                    name={item.name}
                    className="absolute -bottom-1 end-1.5 !h-9 !w-9 border-2 border-gray-0 dark:border-gray-100"
                  />
                )}
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center">
                <div className="w-full">
                  <Title as="h6" className="mb-0.5 text-sm font-semibold">
                    {item.name}
                  </Title>
                  <div className="flex">
                    <Text className="w-10/12 truncate pe-7 text-xs text-gray-500">
                      {item.message}
                    </Text>
                    <span className="ms-auto whitespace-nowrap pe-8 text-xs text-gray-500">
                      {dayjs(item.sendTime).fromNow(true)}
                    </span>
                  </div>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {item.unRead ? (
                    <Badge
                      renderAsDot
                      size="lg"
                      color="primary"
                      className="scale-90"
                    />
                  ) : (
                    <span className="inline-block rounded-full bg-gray-100 p-0.5 dark:bg-gray-50">
                      <PiCheck className="h-auto w-[9px]" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SimpleBar>
    </div>
  );
}

export default function MessagesDropdown({
  children,
}: {
  children: ReactElement;
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shadow="sm"
      placement={isMobile ? "bottom" : "bottom-end"}
    >
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content className="z-[9999] pb-6 pe-6 ps-0 pt-5 dark:bg-gray-100 [&>svg]:hidden sm:[&>svg]:inline-flex [&>svg]:dark:fill-gray-100">
        <MessagesList setIsOpen={setIsOpen} />
      </Popover.Content>
    </Popover>
  );
}
