"use client";

import Image from "next/image";
import { Title, Text } from "rizzui";
import { PiSealCheckFill } from "react-icons/pi";

export default function ProfileHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative z-0 -mx-4 px-4 pt-28 before:absolute before:start-0 before:top-0 before:h-40 before:w-full before:bg-gradient-to-r before:from-[#F8E1AF] before:to-[#F6CFCF] md:-mx-5 md:px-5 lg:-mx-8 lg:px-8 xl:-mx-6 xl:px-6 3xl:-mx-[33px] 3xl:px-[33px] 4xl:-mx-10 4xl:px-10">
      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-wrap items-end justify-start gap-6 border-b border-dashed border-muted pb-10">
        <div className="relative aspect-square w-[110px] overflow-hidden rounded-full border-[6px] border-white bg-gray-100 shadow-sm">
          <Image
            src="/brand/ntumai-logo-light.png"
            alt="profile-pic"
            fill
            className="object-contain bg-primary p-4"
          />
        </div>
        <div>
          <Title as="h2" className="mb-2 inline-flex items-center gap-3 text-xl font-bold text-gray-900">
            {title}
            <PiSealCheckFill className="h-5 w-5 text-primary md:h-6 md:w-6" />
          </Title>
          {description ? <Text className="text-sm text-gray-500">{description}</Text> : null}
        </div>
        {action ? <div className="w-full sm:w-auto md:ms-auto">{action}</div> : null}
      </div>
    </div>
  );
}
