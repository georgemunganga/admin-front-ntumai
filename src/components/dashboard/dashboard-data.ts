export const crmStats = [
  {
    title: "Live orders",
    value: "1,248",
    percentage: 12.4,
    increased: true,
    lastMonth: "1,110",
  },
  {
    title: "Drivers online",
    value: "326",
    percentage: 5.6,
    increased: true,
    lastMonth: "309",
  },
  {
    title: "Support backlog",
    value: "41",
    percentage: 9.2,
    increased: false,
    lastMonth: "37",
  },
  {
    title: "Vendor exceptions",
    value: "18",
    percentage: 3.8,
    increased: false,
    lastMonth: "16",
  },
];

export const projectStatCards = [
  {
    title: "Dispatch health",
    amount: "92%",
    increased: true,
    percentage: 4.2,
  },
  {
    title: "Completion rate",
    amount: "97.1%",
    increased: true,
    percentage: 2.1,
  },
  {
    title: "Issues escalated",
    amount: "29",
    increased: false,
    percentage: 1.8,
  },
  {
    title: "Merchant SLA",
    amount: "88%",
    increased: true,
    percentage: 1.4,
  },
];

export const projectStatisticsData = [
  { label: "Mon", completed: 46, inProgress: 18, active: 11 },
  { label: "Tue", completed: 52, inProgress: 21, active: 15 },
  { label: "Wed", completed: 49, inProgress: 19, active: 12 },
  { label: "Thu", completed: 58, inProgress: 24, active: 16 },
  { label: "Fri", completed: 63, inProgress: 26, active: 17 },
  { label: "Sat", completed: 39, inProgress: 14, active: 9 },
  { label: "Sun", completed: 31, inProgress: 11, active: 7 },
];

export const activityData = [
  { label: "Dispatch", completed: 84, inProgress: 62 },
  { label: "Support", completed: 68, inProgress: 41 },
  { label: "Catalog", completed: 52, inProgress: 28 },
  { label: "Vendors", completed: 61, inProgress: 35 },
  { label: "Drivers", completed: 78, inProgress: 44 },
];

export const overallProgressData = [
  { name: "Completed", percentage: 72, count: "72%", color: "#1ABAA6" },
  { name: "In Review", percentage: 18, count: "18%", color: "#FFE737" },
  { name: "Blocked", percentage: 10, count: "10%", color: "#81868F" },
];

export const clientList = [
  { id: 1, name: "Lusaka Central", address: "Zone ops", workType: "Dispatch coverage", workProgress: 86 },
  { id: 2, name: "Woodlands", address: "Response watch", workType: "Courier balancing", workProgress: 61 },
  { id: 3, name: "Roma", address: "Stable lane", workType: "Errands and grocery", workProgress: 74 },
  { id: 4, name: "Longacres", address: "Merchant heavy", workType: "Peak-hour routing", workProgress: 69 },
];

export const activeTasks = [
  { title: "Shift balancing", start: 2, end: 5 },
  { title: "Delay recovery", start: 4, end: 8 },
  { title: "Wallet disputes", start: 6, end: 9 },
  { title: "Vendor review", start: 8, end: 11 },
  { title: "Route expansion", start: 9, end: 12 },
];

export const activeTaskMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const taskDetails = [
  "Review stalled dispatches",
  "Clear payment exceptions",
  "Approve merchant updates",
  "Audit courier onboarding",
  "Close escalated tickets",
];

export const recentActivities = [
  { id: 1, title: "Dispatch rules adjusted", date: "2m ago", activity: "Peak-hour balancing updated for two zones." },
  { id: 2, title: "Support escalation cleared", date: "14m ago", activity: "Wallet dispute resolved after finance review." },
  { id: 3, title: "Merchant menu approved", date: "39m ago", activity: "Catalog content pushed live for a high-volume partner." },
  { id: 4, title: "Driver batch verified", date: "1h ago", activity: "Eight onboarding profiles moved to active." },
];

export const summaryRows = [
  { name: "Orders desk", owner: "Ops pod A", status: "Live", volume: "214 active deliveries" },
  { name: "Support queue", owner: "Care team", status: "Monitoring", volume: "41 open tickets" },
  { name: "Vendors", owner: "Partner ops", status: "Review", volume: "18 exceptions" },
  { name: "Drivers", owner: "Fleet success", status: "Stable", volume: "326 online" },
];
