"use client";
import { LogOut, CircleUserRound } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";
import { useNavigate } from "react-router";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Avatar, AvatarImage, AvatarFallback 
} from "@/components/ui/avatar";

import { 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

export function NavUser() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  // Use backend user fields, fallback to sensible defaults
  const displayName = (user?.first_name || user?.firstName || "") && (user?.last_name || user?.lastName || "")
    ? `${user.first_name || user.firstName} ${user.last_name || user.lastName}`
    : user?.name || user?.member_name || user?.member_email || user?.email || "User";
  const displayEmail = user?.email || user?.member_email || "No email";
  const initial = displayName.charAt(0).toUpperCase();
  const avatarUrl = user?.avatar || user?.profile_picture || null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="group">
          <Avatar>
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} />
            ) : (
              <AvatarFallback>{initial}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 text-left">
            <p className="font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{displayEmail}</p>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate("/user-profile")}> 
          <CircleUserRound className="mr-2 size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}