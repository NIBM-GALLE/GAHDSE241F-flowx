import { useAuth } from "@/context/AuthContext";
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
  const { user } = useAuth();

  // Role-specific navigation
  const navMain = {
    admin: [
      {
        title: "Subsidies",
        icon: BiDonateHeart,
        items: [
          { title: "Current Subsidies", url: "/admin/subsidies/current" },
          { title: "Approved History", url: "/admin/subsidies/history" },
        ],
      },
      {
        title: "Victims",
        icon: MdOutlineAnnouncement,
        items: [
          { title: "New Requests", url: "/admin/victims/new" },
          { title: "Approved Requests", url: "/admin/victims/approved" },
          { title: "History", url: "/admin/victims/history" },
        ],
      },
      {
        title: "Announcements",
        icon: TfiAnnouncement,
        items: [
          { title: "New Announcements", url: "/admin/announcements/new" },
          { title: "Pending Announcements", url: "/admin/announcements/pending" },
        ],
      },
      {
        title: "Donations",
        icon: LiaDonateSolid,
        badge: user?.notifications,
        items: [
          { title: "New Donations", url: "/admin/donations/new" },
          { title: "Pending Donations", url: "/admin/donations/pending" },
          { title: "Donations History", url: "/admin/donations/history" },
        ],
      },
    ],
    grama_sewaka: [
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
