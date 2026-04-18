"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User,
  MapPin,
  Package,
  RefreshCw,
  Heart,
  LogOut,
  LayoutDashboard,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/routes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const navItems = [
  {
    label: "Áttekintés",
    href: ROUTES.account,
    icon: LayoutDashboard,
  },
  {
    label: "Adataim",
    href: ROUTES.accountProfile,
    icon: User,
  },
  {
    label: "Címeim",
    href: ROUTES.accountAddresses,
    icon: MapPin,
  },
  {
    label: "Rendeléseim",
    href: ROUTES.orders,
    icon: Package,
  },
  {
    label: "Előfizetéseim",
    href: ROUTES.accountSubscriptions,
    icon: RefreshCw,
  },
  {
    label: "Kedvenceim",
    href: ROUTES.accountWishlist,
    icon: Heart,
  },
]

interface AccountLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function AccountLayout({ children, user }: AccountLayoutProps) {
  const pathname = usePathname()
  
  // Default user for demo
  const currentUser = user ?? {
    name: "Kovács Anna",
    email: "anna.kovacs@email.hu",
    avatar: undefined,
  }

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // Find active nav item
  const activeItem = navItems.find((item) => {
    if (item.href === ROUTES.account) {
      return pathname === ROUTES.account
    }
    return pathname.startsWith(item.href)
  })

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Desktop Sidebar */}
      <Sidebar collapsible="none" className="hidden md:flex border-r border-border/40">
        <SidebarHeader className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {currentUser.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentUser.email}
              </span>
            </div>
          </div>
        </SidebarHeader>
        
        <Separator className="mx-4" />
        
        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = item.href === ROUTES.account 
                    ? pathname === ROUTES.account
                    : pathname.startsWith(item.href)
                  
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          "h-11 px-4 transition-colors",
                          isActive && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Kijelentkezés
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {/* Mobile Tab Navigation */}
        <div className="md:hidden sticky top-0 z-10 bg-background border-b">
          <div className="overflow-x-auto scrollbar-hide">
            <Tabs value={activeItem?.href ?? ROUTES.account} className="w-max min-w-full">
              <TabsList className="h-auto p-1 bg-transparent gap-1">
                {navItems.map((item) => {
                  const isActive = item.href === ROUTES.account 
                    ? pathname === ROUTES.account
                    : pathname.startsWith(item.href)
                  
                  return (
                    <TabsTrigger
                      key={item.href}
                      value={item.href}
                      asChild
                      className={cn(
                        "px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
                        "whitespace-nowrap"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Link>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-8 lg:p-12 max-w-4xl">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
