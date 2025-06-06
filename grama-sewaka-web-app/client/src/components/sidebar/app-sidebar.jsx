import { useUserStore } from "@/stores/useUserStore";
import { TfiAnnouncement } from "react-icons/tfi";
import { BiDonateHeart } from "react-icons/bi";
import { LiaDonateSolid } from "react-icons/lia";
import { MdOutlineAnnouncement } from "react-icons/md";


import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { ModeToggle } from "@/components/ui/mode-toggle";

import logo from '/src/assets/images/logo.svg';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }) {
  const { user } = useUserStore();

  // Role-specific navigation
  const navMain = {
    admin: [
      {
        title: "Dashboard",
        icon: MdOutlineAnnouncement,
        items: [
          { title: "Overview", url: "/admin/dashboard" },
          { title: "Statistics", url: "/admin/statistics" },
        ],
      },
      {
        title: "Flood Management",
        icon: MdOutlineAnnouncement,
        items: [
          { title: "Flood Reports", url: "/admin/floods/reports" },
          { title: "Flood Alerts", url: "/admin/floods/alerts" },
          { title: "Flood History", url: "/admin/floods/history" },
        ],
      },
    ],
    government_officer: [
      {
        title: "Subsidies",
        icon: BiDonateHeart,
        items: [
          { title: "Current Subsidies", url: "/admin/subsidies/current" },
          { title: "Approved History", url: "/admin/subsidies/history" },
        ],
      },
      {
        title: "Shelters",
        icon: MdOutlineAnnouncement,
        items: [
          { title: "New Requests", url: "/admin/shelters/new" },
          { title: "Approved Requests", url: "/admin/shelters/approved" },
          { title: "Created Shelters", url: "/admin/shelters/created" },
        ],
      },
      {
        title: "Victims",
        icon: MdOutlineAnnouncement,
        items: [
          { title: "New Requests", url: "/victims/new" },
          { title: "Approved Requests", url: "/victims/approved" },
          { title: "History", url: "/victims/history" },
        ],
      },
      {
        title: "Announcements",
        icon: TfiAnnouncement,
        items: [
          { title: "New Announcements", url: "/announcements/create" },
          { title: "Pending Announcements", url: "/announcements/pending" },
        ],
      },
      {
        title: "Donations",
        icon: LiaDonateSolid,
        badge: user?.notifications,
        items: [
          { title: "New Donations", url: "/donations/new" },
          { title: "Pending Donations", url: "/donations/pending" },
          { title: "Donations History", url: "/donations/history" },
        ],
      },
    ],
    grama_sevaka: [
      {
        title: "Victims",
        icon: MdOutlineAnnouncement,
        badge: user?.notifications,
        items: [
          { title: "New Requests", url: "/victims/new" },
          { title: "Approved Requests", url: "/victims/approved" },
        ],
      },
      {
        title: "Subsidies",
        icon: BiDonateHeart,
        items: [
          { title: "New Subsidies", url: "/subsidies/new" },
          { title: "Pending Subsidies", url: "/subsidies/pending" },
          { title: "Approved History", url: "/subsidies/history" },
        ],
      },
      {
        title: "Announcements",
        icon: TfiAnnouncement,
        items: [
          { title: "New Announcements", url: "/announcements/new" },
          { title: "Pending Announcements", url: "/announcements/pending" },
        ],
      },
    ],
  }[user?.role] || [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Logo" className="w-10 h-10" />
                  <span className="hidden lg:inline text-lg font-bold">FlowX</span>
                </div>
                  <ModeToggle className="gap-2" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter className="border-t">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
