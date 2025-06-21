'use client'

import * as React from 'react'
import { BookOpen, Bot, Command, Settings2, SquareTerminal } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { ModeToggle } from './mode-toggle'
import { DatePicker } from './date-picker'

// This is sample data.
const data = {
  user: {
    name: 'Omega',
    email: 'omega@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Providers',
      url: '/dashboard/providers',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Products',
      url: '/dashboard/products',
      icon: Bot,
    },
    {
      title: 'Orders',
      url: '/dashboard/orders',
      icon: BookOpen,
    },
    {
      title: 'Sales',
      url: '/dashboard/sales',
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row justify-center items-center">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Omega</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
            <ModeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <DatePicker />
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
