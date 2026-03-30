'use client'

import { useState } from 'react'
import { useAdmin } from './AdminProvider'
import { LoginModal } from './LoginModal'
import { AdminPanel } from './AdminPanel'
import { Button } from '@/components/ui/button'
import { Shield, Loader2, Settings } from 'lucide-react'

// Hook to check if component is mounted (for hydration fix)
function useMounted() {
  const [mounted, setMounted] = useState(false)
  // Using callback pattern instead of effect
  useState(() => {
    // This runs during render, but only on client
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  })
  return mounted
}

export function AdminButton() {
  const { isAuthenticated, loading } = useAdmin()
  const [showLogin, setShowLogin] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  // Show loading state while checking auth or during SSR
  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    )
  }

  // If authenticated, show admin panel button
  if (isAuthenticated) {
    return (
      <>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowPanel(true)}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Settings className="w-4 h-4" />
          Painel Admin
        </Button>
        {showPanel && <AdminPanel onClose={() => setShowPanel(false)} />}
      </>
    )
  }

  // If not authenticated, show login button
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowLogin(true)}
        className="gap-2"
      >
        <Shield className="w-4 h-4" />
        Admin
      </Button>
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </>
  )
}
