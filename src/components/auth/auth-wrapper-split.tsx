"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Text, Title } from "rizzui";
import cn from "@/utils/class-names";

function OrSeparation({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-gray-200" />
      <span className="text-center text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
        {title}
      </span>
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

export default function AuthWrapperSplit({
  children,
  title,
  description,
  bannerTitle,
  bannerDescription,
  pageImage,
  isSocialLoginActive = false,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  description?: string;
  bannerTitle?: string;
  bannerDescription?: string;
  pageImage?: React.ReactNode;
  isSocialLoginActive?: boolean;
}) {
  return (
    <>
      <div className="min-h-screen justify-between gap-x-8 bg-[#f5f1e8] px-4 py-8 pt-10 md:pt-12 lg:flex lg:p-6 xl:gap-x-10 xl:p-7 2xl:p-10 2xl:pt-10 [&>div]:min-h-[calc(100vh-80px)]">
        <div className="relative flex w-full items-center justify-center lg:w-5/12 2xl:justify-end 2xl:pe-24">
          <div className="w-full max-w-sm md:max-w-md lg:py-7 lg:ps-3 lg:pt-16 2xl:w-[630px] 2xl:max-w-none 2xl:ps-20 2xl:pt-7">
            <div className="mb-7 px-6 pt-3 text-center md:pt-0 lg:px-0 lg:text-start xl:mb-8 2xl:mb-10">
              <Link href="/" className="mb-6 inline-flex items-center xl:mb-8">
                <Image
                  src="/brand/ntumai-logo-dark.png"
                  alt="Ntumai"
                  width={164}
                  height={48}
                  className="h-11 w-auto"
                  priority
                />
              </Link>
              <Title
                as="h2"
                className="mb-5 text-[26px] leading-snug md:text-3xl md:!leading-normal lg:mb-7 lg:pe-16 lg:text-[28px] xl:text-3xl 2xl:pe-8 2xl:text-4xl"
              >
                {title}
              </Title>
              {description ? (
                <Text className="leading-[1.85] text-gray-700 md:leading-loose lg:pe-8 2xl:pe-14">
                  {description}
                </Text>
              ) : null}
            </div>

            {isSocialLoginActive ? (
              <>
                <div className="grid grid-cols-1 gap-4 pb-5 md:grid-cols-2 md:pb-6 xl:gap-5 xl:pb-7">
                  <Button variant="outline" className="h-11 w-full">
                    Continue with Google
                  </Button>
                  <Button variant="outline" className="h-11 w-full">
                    Continue with Microsoft
                  </Button>
                </div>
                <OrSeparation title="OR" className="mb-5 2xl:mb-7" />
              </>
            ) : null}

            {children}
          </div>
        </div>

        <div className="hidden w-7/12 items-center justify-center rounded-[20px] bg-gray-50 px-6 lg:flex xl:justify-start 2xl:px-16">
          <div className="pb-8 pt-10 text-center xl:pt-16 2xl:block 2xl:w-[1063px]">
            <div className="mx-auto mb-10 max-w-sm pt-2 2xl:max-w-lg">
              <Title
                as="h2"
                className="mb-5 font-semibold !leading-normal lg:text-[26px] 2xl:px-10 2xl:text-[32px]"
              >
                {bannerTitle}
              </Title>
              <Text className="leading-[1.85] text-gray-700 md:leading-loose 2xl:px-6">
                {bannerDescription}
              </Text>
            </div>
            {pageImage}
          </div>
        </div>
      </div>
    </>
  );
}
