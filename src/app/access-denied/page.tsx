"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Title } from "rizzui";
import { PiHouseLineBold } from "react-icons/pi";

export default function AccessDeniedPage() {
  return (
    <div className="flex grow items-center px-6 xl:px-10">
      <div className="mx-auto text-center">
        <div className="relative mx-auto max-w-[370px]">
          <div className="mx-auto mb-8 flex aspect-[360/326] max-w-[256px] items-center justify-center rounded-[32px] border border-dashed border-gray-300 bg-[#fff7ec] lg:mb-12 2xl:mb-16 xs:max-w-[370px]">
            <Image
              src="/brand/ntumai-logo-dark.png"
              alt="forbidden"
              width={220}
              height={64}
              className="h-auto w-[180px]"
              priority
            />
          </div>
          <div className="absolute right-10 top-10 hidden h-16 w-16 items-center justify-center rounded-full bg-[#f8e1af] text-2xl font-bold text-gray-900 sm:flex">
            403
          </div>
        </div>
        <Title as="h1" className="text-2xl font-bold leading-normal text-gray-1000 lg:text-3xl">
          Access Denied
        </Title>
        <p className="mt-3 text-sm leading-loose text-gray-500 lg:mt-6 lg:text-base lg:leading-loose">
          You do not have permission to access this page.
          <br className="hidden xs:inline-block" />
          Please contact your site administrator to request access.
        </p>
        <Link href="/">
          <Button size="xl" as="span" className="mt-8 h-12 px-4 xl:h-14 xl:px-6">
            <PiHouseLineBold className="mr-1.5 text-lg" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
