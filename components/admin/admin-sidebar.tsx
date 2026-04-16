'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  RefreshCw,
  Ticket,
  Calendar,
  Gift,
  Star,
  FileText,
  RotateCcw,
  Users,
  Settings,
  LogOut,
  Coffee,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const NAV_ITEMS = [
  {
    group: 'Főmenü',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Termékek', href: '/admin/termekek', icon: Package },
      { label: 'Rendelések', href: '/admin/rendelesek', icon: ShoppingCart },
      { label: 'Szállítások', href: '/admin/szallitasok', icon: Truck },
      { label: 'Előfizetések', href: '/admin/elofizetesek', icon: RefreshCw },
    ],
  },
  {
    group: 'Marketing',
    items: [
      { label: 'Kuponok', href: '/admin/kuponok', icon: Ticket },
      { label: 'Akció napok', href: '/admin/akcio-napok', icon: Calendar },
      { label: 'Ajándékkártyák', href: '/admin/ajandekkartya', icon: Gift },
    ],
  },
  {
    group: 'Tartalom',
    items: [
      { label: 'Értékelések', href: '/admin/ertekelések', icon: Star },
      { label: 'Sztorik', href: '/admin/sztorik', icon: FileText },
    ],
  },
  {
    group: 'Ügyfelek',
    items: [
      { label: 'Visszaküldések', href: '/admin/visszakuldesek', icon: RotateCcw },
      { label: 'Felhasználók', href: '/admin/felhasznalok', icon: Users },
    ],
  },
  {
    group: 'Rendszer',
    items: [
      { label: 'Beállítások', href: '/admin/beallitasok', icon: Settings },
    ],
  },
]

const BREADCRUMB_LABELS: Record<string, string> = {
  admin: 'Admin',
  termekek: 'Termékek',
  rendelesek: 'Rendelések',
  szallitasok: 'Szállítások',
  elofizetesek: 'Előfizetések',
  kuponok: 'Kuponok',
  'akcio-napok': 'Akció napok',
  ajandekkartya: 'Ajándékkártyák',
  ertekelések: 'Értékelések',
  sztorik: 'Sztorik',
  visszakuldesek: 'Visszaküldések',
  felhasznalok: 'Felhasználók',
  beallitasok: 'Beállítások',
}

// Mock admin user
const ADMIN_USER = {
  name: 'Admin User',
  email: 'admin@craftbrew.hu',
  avatar: null,
}

function AdminSidebarContent() {
  const pathname = usePathname()

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-4 py-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Coffee className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold tracking-tight">
              CraftBrew
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Admin
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {NAV_ITEMS.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/admin' && pathname.startsWith(item.href))
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          'transition-colors',
                          isActive && 'bg-primary/10 text-primary font-medium'
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
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={ADMIN_USER.avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {ADMIN_USER.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{ADMIN_USER.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {ADMIN_USER.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/admin/beallitasok">
                    <Settings className="mr-2 h-4 w-4" />
                    Beállítások
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Kijelentkezés
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )
}

function AdminHeader() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const href = '/' + segments.slice(0, index + 1).join('/')
            const isLast = index === segments.length - 1
            const label = BREADCRUMB_LABELS[segment] || segment

            return (
              <React.Fragment key={href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <AdminSidebarContent />
      </Sidebar>
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
