import React from "react";
import { TfiAnnouncement } from "react-icons/tfi";
import { BiDonateHeart } from "react-icons/bi";
import { LiaDonateSolid } from "react-icons/lia";
import { MdOutlineAnnouncement } from "react-icons/md";
import { FaWater } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { ModeToggle } from "@/components/ui/mode-toggle";

import logo from "@/assets/logo.svg";

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
  const navMain = [
    {
      title: "Flood Impact Prediction",
      icon: FaWater,
      items: [
        {
          title: "Flood Prediction",
          url: "/flood-prediction",
        },
        {
          title: "Flood Impact Map",
          url: "/flood-impact-map",
        },
      ],
    },
    {
      title: "Announcements",
      icon: MdOutlineAnnouncement,
      items: [
        {
          title: "All Announcements",
          url: "/announcements",
        },
      ],
    },
    {
      title: "Victims Requests",
      icon: FaUsers,
      items: [
        {
          title: "Create Request",
          url: "/victims/create",
        },
        {
          title: "Requests History",
          url: "/victims/history",
        },
      ],
    },
    {
      title: "Subsidies",
      icon: LiaDonateSolid,
      items: [
        {
          title: "New Subsidy",
          url: "/subsidies/new",
        },
        {
          title: "Subsidies History",
          url: "/subsidies/history",
        },
      ],
    },
    {
      title: "Safe Shelters",
      icon: BiDonateHeart,
      items: [
        {
          title: "View Shelters",
          url: "/shelters",
        },
        {
          title: "Request Shelter",
          url: "/shelters/requests",
        },
      ],
    },
    {
      title: "Contact Info",
      icon: FaPhoneAlt,
      items: [
        {
          title: "Contactable Officials",
          url: "/contact-info",
        },
        {
          title: "Emergency Contacts",
          url: "/emergency-contacts",
        },
      ],
    },
  ];

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
        <NavUser user={{ name: "Chamindu Induwara" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
