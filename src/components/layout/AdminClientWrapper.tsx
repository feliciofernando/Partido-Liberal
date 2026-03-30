'use client'

import { AdminProvider } from '../admin/AdminProvider'

export function AdminClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  )
}
