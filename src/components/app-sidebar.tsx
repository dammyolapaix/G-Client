'use client'

import * as React from 'react'

import {
  DollarSign,
  GalleryVerticalEnd,
  GraduationCap,
  Home,
  Users,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  DASHBOARD_COURSES_ROUTE,
  DASHBOARD_INVOICES_ROUTE,
  DASHBOARD_LEARNERS_ROUTE,
  DASHBOARD_ROUTE,
} from '@/lib/routes'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'G Client',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: DASHBOARD_ROUTE,
      icon: Home,
    },
    {
      title: 'Invoices',
      url: DASHBOARD_INVOICES_ROUTE,
      icon: DollarSign,
    },
    {
      title: 'Learners',
      url: DASHBOARD_LEARNERS_ROUTE,
      icon: Users,
    },
    {
      title: 'Courses',
      url: DASHBOARD_COURSES_ROUTE,
      icon: GraduationCap,
    },
    // {
    //   title: 'Reports',
    //   url: DASHBOARD_REPORTS_ROUTE,
    //   icon: File,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
