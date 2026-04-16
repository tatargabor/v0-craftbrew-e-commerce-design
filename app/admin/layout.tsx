import { Toaster } from '@/components/ui/sonner'
import { AdminLayout } from '@/components/admin/admin-sidebar'

export const metadata = {
  title: 'CraftBrew Admin',
  description: 'Admin dashboard for CraftBrew',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
      <Toaster position="top-right" />
    </>
  )
}
