import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader user={null} cartCount={0} wishlistCount={0} locale="hu" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
