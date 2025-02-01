import { redirect } from 'next/navigation'

import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { UserWithRelationships } from '@/features/users/types'
import auth from '@/lib/auth'
import {
  COMPLETE_PROFILE_ROUTE,
  LOGIN_ROUTE,
  VERIFY_EMAIL_ROUTE,
} from '@/lib/routes'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authUser = (await auth.utils.getAuthUser({
    with: { profile: true },
  })) as UserWithRelationships

  if (!authUser) redirect(LOGIN_ROUTE)

  if (!authUser.emailVerified) redirect(VERIFY_EMAIL_ROUTE)

  if (!auth.utils.authUserProfileIsCompleted(authUser))
    redirect(COMPLETE_PROFILE_ROUTE)

  return (
    <>
      {authUser.role === 'admin' && (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      )}

      {authUser.role === 'learner' && (
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</main>
      )}
    </>
  )
}
