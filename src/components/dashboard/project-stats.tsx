"use client";

import { useState } from "react";
import { Box, Flex, Select, Text, Title } from "rizzui";
import { PiArrowDownRightBold, PiArrowUpRightBold, PiChartBarDuotone, PiHeadsetDuotone, PiPackageDuotone, PiTruckDuotone } from "react-icons/pi";
import { projectStatCards } from "@/components/dashboard/dashboard-data";

const icons = [PiTruckDuotone, PiPackageDuotone, PiHeadsetDuotone, PiChartBarDuotone];

export default function DashboardProjectStats({
  className = "",
}: {
  className?: string;
}) {
  const [value, setValue] = useState("week");
  return (
    <Box className={`@container ${className}`}>
      <Flex justify="between" align="center" className="mb-6">
        <Title as="h1" className="text-base font-semibold sm:text-lg xl:text-xl">
          Overview
        </Title>
        <Select
          options={[
            { label: "This week", value: "week" },
            { label: "This month", value: "month" },
          ]}
          value={value}
          onChange={(option: any) => setValue(option?.value ?? "week")}
          className="min-w-[140px]"
          selectClassName="rounded-md border"
        />
      </Flex>
      <div className="custom-scrollbar overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:h-0">
        <Flex className="sm:gap-6 3xl:gap-8">
          {projectStatCards.map((stat, index) => {
            const Icon = icons[index];
            return (
              <Box
                key={stat.title}
                className="group inline-block w-full rounded-lg border border-muted p-6 first:bg-slate-900"
              >
                <Flex justify="between" gap="5" className="mb-4">
                  <Box className="grow space-y-2">
                    <Text className="text-[22px] font-bold text-gray-900 group-first:text-gray-0 3xl:text-3xl">
                      {stat.amount}
                    </Text>
                    <Text className="whitespace-nowrap font-medium text-gray-500 group-first:text-gray-0">
                      {stat.title}
                    </Text>
                  </Box>
                  <span className="flex rounded-lg bg-slate-200 p-2.5 text-gray-900 shadow-sm">
                    <Icon className="size-7" strokeWidth={2} />
                  </span>
                </Flex>
                <Flex align="center" className="gap-1.5">
                  <Flex
                    gap="1"
                    align="center"
                    className={stat.increased ? "text-green" : "text-red"}
                  >
                    <span className="flex rounded-full">
                      {stat.increased ? (
                        <PiArrowUpRightBold className="h-auto w-4" />
                      ) : (
                        <PiArrowDownRightBold className="h-auto w-4" />
                      )}
                    </span>
                    <span className="font-semibold leading-none">
                      {stat.increased ? "+" : "-"}
                      {stat.percentage}%
                    </span>
                  </Flex>
                  <Flex className="whitespace-nowrap leading-none text-gray-500 group-first:text-gray-0">
                    &nbsp;+1.01% this week
                  </Flex>
                </Flex>
              </Box>
            );
          })}
        </Flex>
      </div>
    </Box>
  );
}
