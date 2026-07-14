import {
  LayoutDashboard,
  ClipboardList,
  FolderKanban,
  ShoppingCart,
  Boxes,
  Wallet,
  Users,
  Truck,
  Wrench,
  ShieldAlert,
  Briefcase,
  FileText,
  Sparkles,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Executive Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Daily Reports", url: "/daily-reports", icon: ClipboardList, badge: "12" },
      { title: "AI Insights", url: "/ai-insights", icon: Sparkles },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Projects", url: "/projects", icon: FolderKanban },
      { title: "Procurement", url: "/procurement", icon: ShoppingCart },
      { title: "Inventory", url: "/inventory", icon: Boxes },
      { title: "Fleet & Transport", url: "/fleet", icon: Truck },
      { title: "Workshop", url: "/workshop", icon: Wrench },
      { title: "HSE", url: "/hse", icon: ShieldAlert },
    ],
  },
  {
    label: "Corporate",
    items: [
      { title: "Finance", url: "/finance", icon: Wallet },
      { title: "Human Resources", url: "/hr", icon: Users },
      { title: "Business Development", url: "/business-development", icon: Briefcase },
      { title: "Documents", url: "/documents", icon: FileText },
    ],
  },
  {
    label: "System",
    items: [{ title: "Settings", url: "/settings", icon: Settings }],
  },
];
