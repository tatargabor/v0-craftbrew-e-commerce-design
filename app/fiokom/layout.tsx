import { AccountLayout } from "@/components/account-sidebar"

export default function FiokomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AccountLayout>{children}</AccountLayout>
}
