"use client";

import dayjs from "dayjs";
import Calendar from "react-calendar";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Progressbar,
  Tab,
  Text,
  Title,
} from "rizzui";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  activeTaskMonths,
  activeTasks,
  activityData,
  clientList,
  overallProgressData,
  projectStatisticsData,
  recentActivities,
  summaryRows,
  taskDetails,
} from "@/components/dashboard/dashboard-data";
import ShellCard from "@/components/admin/shell-card";
import StatusBadge from "@/components/admin/status-badge";
import { PiArrowLeft, PiArrowRight } from "react-icons/pi";

const markedDates = [
  dayjs().add(1, "day").toDate(),
  dayjs().add(3, "day").toDate(),
  dayjs().add(6, "day").toDate(),
  dayjs().subtract(1, "day").toDate(),
];

export function DashboardProjectStatistics({ className = "" }: { className?: string }) {
  return (
    <ShellCard
      title="Project Statistics"
      className={className}
      action={<Legend items={["Completed", "In Progress", "Active"]} colors={["#1ABAA6", "#FFE737", "#81868F"]} />}
    >
      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <Box className="h-[20rem] pt-6 lg:h-[24rem] 3xl:h-[25rem]">
          <ResponsiveContainer width="100%" height="100%" minWidth={800}>
            <ComposedChart data={projectStatisticsData} margin={{ left: -6 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.435} strokeDasharray="8 10" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="completed" fill="#1ABAA6" barSize={24} radius={4} />
              <Bar dataKey="inProgress" fill="#FFE737" barSize={24} radius={4} />
              <Bar dataKey="active" fill="#81868F" barSize={24} radius={4} />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </div>
    </ShellCard>
  );
}

export function DashboardOverallProgress({ className = "" }: { className?: string }) {
  return (
    <ShellCard title="Overall Progress" className={className}>
      <Box className="relative h-60 w-full translate-y-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 40, right: 10 }}>
            <Pie
              data={overallProgressData}
              endAngle={-10}
              stroke="none"
              startAngle={190}
              paddingAngle={1}
              cornerRadius={12}
              dataKey="percentage"
              innerRadius={"85%"}
              outerRadius={"100%"}
            >
              {overallProgressData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box className="absolute bottom-20 start-1/2 -translate-x-1/2 text-center">
          <Text className="text-2xl font-bold text-gray-800">72%</Text>
          <Text className="font-medium">Completed</Text>
        </Box>
      </Box>
      <Box className="grid grid-cols-2 gap-8 text-center sm:flex sm:flex-wrap sm:justify-center sm:text-start">
        {overallProgressData.map((item) => (
          <Box key={item.name}>
            <Text className="block text-xl font-bold" style={{ color: item.color }}>
              {item.count}
            </Text>
            <Text className="whitespace-nowrap">{item.name}</Text>
          </Box>
        ))}
      </Box>
    </ShellCard>
  );
}

export function DashboardActivities({ className = "" }: { className?: string }) {
  return (
    <ShellCard title="Activities" className={className} action={<Legend items={["Completed", "In Progress"]} colors={["#1ABAA6", "#365486"]} />}>
      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <Box className="h-[24rem] w-full pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={activityData} margin={{ top: 0, right: 0, bottom: 0, left: -10 }}>
              <CartesianGrid vertical horizontal={false} strokeOpacity={1} strokeDasharray="0" />
              <XAxis type="number" tickLine={false} />
              <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar radius={12} barSize={16} dataKey="completed" fill="#1ABAA6" />
              <Bar radius={12} barSize={16} dataKey="inProgress" fill="#365486" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </div>
    </ShellCard>
  );
}

export function DashboardClientList({ className = "" }: { className?: string }) {
  return (
    <ShellCard
      title="Client List"
      className={className}
      action={
        <Button as="span" variant="text" className="h-auto p-0 underline">
          View All
        </Button>
      }
    >
      <div className="custom-scrollbar -me-2 mt-6 h-[24rem] overflow-x-auto pe-2">
        <Box className="space-y-3.5">
          {clientList.map((client) => (
            <Box
              key={client.id}
              className="space-y-4 rounded-lg border border-muted/50 px-4 py-3 lg:flex lg:items-center lg:justify-between lg:space-y-0"
            >
              <Flex align="center">
                <Avatar name={client.name} />
                <Box className="space-y-0.5">
                  <Text className="flex items-center gap-2 text-gray-700">
                    <strong>{client.name}</strong> {client.address}
                  </Text>
                  <Text>{client.workType}</Text>
                </Box>
              </Flex>
              <Progressbar className="lg:max-w-44" value={client.workProgress} label={`${client.workProgress}%`} />
            </Box>
          ))}
        </Box>
      </div>
    </ShellCard>
  );
}

export function DashboardActiveTasks({ className = "" }: { className?: string }) {
  return (
    <ShellCard title="Active Task" className={className}>
      <div className="custom-scrollbar -mb-3 mt-6 overflow-x-auto pb-3">
        <Box className="min-w-[900px] space-y-2">
          {activeTasks.map((task) => (
            <Box key={task.title} className="group grid grid-cols-[120px_1fr] gap-2 text-center">
              <Box className="rounded-md bg-gray-100 px-2 py-3 group-hover:bg-gray-200">
                <Text className="text-gray-500">{task.title}</Text>
              </Box>
              <Box className="grid grid-cols-12 gap-1 rounded-md bg-gray-50 group-hover:bg-[#6CA787]/10">
                <Flex
                  align="center"
                  justify="center"
                  className="h-full gap-0 rounded-md bg-[#6CA787]"
                  style={{ gridColumnStart: task.start, gridColumnEnd: task.end } as React.CSSProperties}
                />
              </Box>
            </Box>
          ))}
          <Box className="grid grid-cols-[120px_1fr] gap-1 text-center">
            <Box />
            <Box className="mt-2 grid grid-cols-12 gap-1 text-center">
              {activeTaskMonths.map((month) => (
                <Text key={month} className="text-gray-500">
                  {month}
                </Text>
              ))}
            </Box>
          </Box>
        </Box>
      </div>
    </ShellCard>
  );
}

export function DashboardSummary({ className = "" }: { className?: string }) {
  return (
    <ShellCard title="Project Summary" className={className}>
      <div className="overflow-hidden rounded-lg border border-muted/60">
        <div className="grid grid-cols-4 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          <div>Area</div>
          <div>Owner</div>
          <div>Status</div>
          <div>Volume</div>
        </div>
        <div className="divide-y divide-gray-100">
          {summaryRows.map((row) => (
            <div key={row.name} className="grid grid-cols-4 items-center px-4 py-4 text-sm">
              <div className="font-semibold text-gray-900">{row.name}</div>
              <div className="text-gray-600">{row.owner}</div>
              <div><StatusBadge status={row.status} /></div>
              <div className="text-gray-600">{row.volume}</div>
            </div>
          ))}
        </div>
      </div>
    </ShellCard>
  );
}

export function DashboardTaskList({ className = "" }: { className?: string }) {
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      if (markedDates.find((d) => d.toDateString() === date.toDateString())) {
        return <span className="absolute inset-x-0 bottom-0 h-1 bg-primary" />;
      }
    }
    return null;
  };

  return (
    <ShellCard title="Task List" className={className}>
      <Calendar
        prev2Label={false}
        next2Label={false}
        selectRange={false}
        tileContent={tileContent}
        value={markedDates as any}
        className="job-schedule-calendar task-list-calendar"
        minDate={dayjs().subtract(1, "year").toDate()}
        prevLabel={<PiArrowLeft className="size-4" />}
        nextLabel={<PiArrowRight className="size-4" />}
      />
      <div className="mt-6 flex flex-col">
        <div>
          <Title as="h3" className="text-base font-semibold">
            Dispatch performance review
          </Title>
          <Text>Operations Team</Text>
          <div className="my-6 space-y-3 border-b border-muted pb-6">
            <div className="flex items-center justify-between gap-4">
              <Text className="font-semibold">Progress</Text>
              <Text className="font-semibold">80%</Text>
            </div>
            <Progressbar value={80} />
          </div>
        </div>
        <Title as="h3" className="mb-6 text-base font-semibold text-gray-800">
          Task Details
        </Title>
        <div className="space-y-3">
          {taskDetails.map((item, index) => (
            <div key={item} className="flex items-center gap-4">
              <Text className="rounded-md bg-gray-100 p-2 px-3.5">{index + 1}</Text>
              <Text as="span" className="block font-medium">
                {item}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </ShellCard>
  );
}

export function DashboardRecentActivities({ className = "" }: { className?: string }) {
  return (
    <ShellCard title="Recent Activities" className={className}>
      <Tab className="mt-4">
        <Tab.List className="grid w-full grid-cols-2 gap-0">
          <Tab.ListItem className="justify-center py-4">Activity</Tab.ListItem>
          <Tab.ListItem className="justify-center py-4">Update</Tab.ListItem>
        </Tab.List>
        <Tab.Panels>
          {[0, 1].map((panel) => (
            <Tab.Panel key={panel}>
              <div className="custom-scrollbar h-[505px] overflow-y-auto scroll-smooth">
                <Box className="space-y-2 p-0.5">
                  {recentActivities.map((activity) => (
                    <Box
                      key={`${panel}-${activity.id}`}
                      className="group cursor-pointer space-y-1 rounded-lg bg-gray-50 p-4 transition-shadow hover:shadow"
                    >
                      <Flex align="center" justify="between" className="gap-0">
                        <Text className="font-semibold group-hover:underline">
                          {activity.title}
                        </Text>
                        <Text className="text-gray-400">{activity.date}</Text>
                      </Flex>
                      <Text className="text-gray-400">{activity.activity}</Text>
                    </Box>
                  ))}
                </Box>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab>
    </ShellCard>
  );
}

function Legend({ items, colors }: { items: string[]; colors: string[] }) {
  return (
    <Flex gap="3" className="text-xs lg:gap-4">
      {items.map((item, index) => (
        <Flex align="center" key={item} className="w-auto gap-1.5">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: colors[index] }} />
          <span className="whitespace-nowrap">{item}</span>
        </Flex>
      ))}
    </Flex>
  );
}
