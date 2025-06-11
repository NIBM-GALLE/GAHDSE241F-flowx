import { useUserStore } from "@/stores/useUserStore";
import { TfiAnnouncement } from "react-icons/tfi";
import { BiDonateHeart } from "react-icons/bi";
import { LiaDonateSolid } from "react-icons/lia";
import { MdOutlineAnnouncement, MdDashboard, MdEventNote } from "react-icons/md";
import { FaUsers, FaWater, FaHome, FaUserInjured, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { ModeToggle } from "@/components/ui/mode-toggle";

import logo from '/src/assets/images/logo.svg';
import Statistics from "@/pages/Statistics";

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
  const navigate = useNavigate();
  const { user } = useUserStore();

  // Role-specific navigation
  const navMain = {
    admin: [
      {
        title: "Dashboard",
        icon: MdDashboard,
        items: [
          { title: "Overview", url: "/dashboard" },
          { title: "Statistics", url: "/statistics" },
        ],
      },
      {
        title: "Flood Management",
        icon: FaWater,
        items: [
          { title: "New Flood", url: "/create-flood-event" },
          { title: "Flood Events", url: "/flood-events" },
        ],
      },
      {
        title: "Daily Flood Details",
        icon: MdEventNote,
        items: [
          { title: "Create Details", url: "/create-flood-details" },
          { title: "Flood Details", url: "/flood-details" },
        ],
      },
      {
        title: "Profile",
        icon: FaUserCircle,
        items: [
          {
            title: "My Profile",
            url: "/profile",
          },
        ],
      },
    ],
    government_officer: [
      {
        title: "Subsidies",
        icon: BiDonateHeart,
        items: [
          { title: "Current Subsidies", url: "/subsidy-notes" },
          { title: "Approved History", url: "/subsidy-givers" },
        ],
      },
      {
        title: "Shelters",
        icon: FaHome,
        items: [
          { title: "New Requests", url: "/shelter-request" },
          { title: "Approved Requests", url: "/shelter-request" },
          { title: "Created Shelters", url: "/create-shelter" },
        ],
      },
      {
        title: "Victims",
        icon: FaUserInjured,
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
          { title: "Pending Announcements", url: "/announcements/list" },
        ],
      },
      {
        title: "Donations",
        icon: LiaDonateSolid,
        badge: user?.notifications,
        items: [
          { title: "New Donations", url: "/donations/new-requests" },
          { title: "Pending Donations", url: "/donations/pending" },
          { title: "Donations History", url: "/donations/history" },
        ],
      },
      {
        title: "Profile",
        icon: FaUserCircle,
        items: [
          {
            title: "My Profile",
            url: "/profile",
          },
        ],
      },
    ],
    grama_sevaka: [
      {
        title: "Victims",
        icon: FaUserInjured,
        badge: user?.notifications,
        items: [
          { title: "New Requests", url: "/victims/new" },
          { title: "Approved Requests", url: "/victims/approved" },
          { title: "History", url: "/victims/history" },
        ],
      },
      {
        title: "Subsidies",
        icon: BiDonateHeart,
        items: [
          { title: "New Subsidies", url: "/subsidy-notes" },
          { title: "Pending Subsidies", url: "/subsidy-givers" },
          { title: "Approved History", url: "/subsidy-givers" },
        ],
      },
      {
        title: "Announcements",
        icon: TfiAnnouncement,
        items: [
          { title: "New Announcements", url: "/announcements/create" },
          { title: "Pending Announcements", url: "/announcements/list" },
        ],
      },
      {
        title: "Profile",
        icon: FaUserCircle,
        items: [
          {
            title: "My Profile",
            url: "/profile",
          },
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
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/dashboard')}>
                  <img src={logo} alt="Logo" className="w-10 h-10 drop-shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200" />
                  <span className="hidden lg:inline text-lg font-bold tracking-wide text-blue-700 dark:text-blue-300 group-hover:text-blue-500 transition-colors duration-200">FlowX</span>
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
