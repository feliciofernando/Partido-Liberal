import { AdminClientWrapper } from '@/components/layout/AdminClientWrapper'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminClientWrapper>{children}</AdminClientWrapper>
}
