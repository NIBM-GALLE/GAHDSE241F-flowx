"use client";
import { LogOut, CircleUserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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

export function NavUser({ user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <SidebarMenuButton size="lg" className="group opacity-60 cursor-not-allowed" disabled>
        <Avatar>
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
          <p className="font-medium">Guest</p>
          <p className="text-xs text-muted-foreground">Not signed in</p>
        </div>
      </SidebarMenuButton>
    );
  }

  const displayName = user.name || user.firstname || user.firstName || user.email || "User";
  const displayEmail = user.email || "No email";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="group">
          <Avatar>
            {user.avatar ? (
              <AvatarImage src={user.avatar} />
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
        <DropdownMenuItem onClick={() => navigate("/profile")}> 
          <CircleUserRound className="mr-2 size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}