"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  LayoutDashboard,
  Activity,
  Apple,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useUser();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Activity", href: "/dashboard/activity", icon: Activity },
    { name: "Diet Plan", href: "/dashboard/diet", icon: Apple },
    { name: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-green-600" />
          <span className="text-xl font-bold text-sidebar-foreground">HealthTracker</span>
        </div>
        <ThemeToggle />
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.name}
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              asChild
            >
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-sidebar-border">
        <SignOutButton>
          <Button variant="outline" className="w-full justify-start border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="h-10 w-10"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Activity className="h-6 w-6 text-green-600" />
            <span className="text-lg font-semibold text-foreground">HealthTracker</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-sidebar lg:border-r lg:border-sidebar-border",
          className
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-sidebar shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
