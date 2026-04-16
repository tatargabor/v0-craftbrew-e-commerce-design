import { AccountLayout } from "@/components/account-sidebar"

export default function RendeleseinkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AccountLayout>{children}</AccountLayout>
}
