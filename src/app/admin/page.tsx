'use client'

import { useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/components/admin/AdminProvider'
import { LoginModal } from '@/components/admin/LoginModal'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { Loader2 } from 'lucide-react'

// Safe mounting hook
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function AdminPage() {
  const { isAuthenticated, loading } = useAdmin()
  const mounted = useMounted()
  const router = useRouter()

  const handleCloseLogin = (open: boolean) => {
    if (!open) {
      // Redirect to home if login cancelled
      router.push('/')
    }
  }

  const handleClosePanel = () => {
    router.push('/')
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // If not authenticated, show login modal
  if (!isAuthenticated) {
    return (
      <LoginModal open={true} onOpenChange={handleCloseLogin} />
    )
  }

  // If authenticated, show admin panel
  return <AdminPanel onClose={handleClosePanel} />
}
